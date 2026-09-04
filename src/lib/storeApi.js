import { supabase } from "./supabase";

function requireClient() {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

async function uploadImage(bucket, userId, file) {
  if (!file) throw new Error("Please choose an image.");
  if (!file.type.startsWith("image/")) throw new Error("The selected file must be an image.");
  if (file.size > MAX_IMAGE_SIZE) throw new Error("Images must be 5 MB or smaller.");

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;
  const client = requireClient();
  const { error } = await client.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
  });
  if (error) throw error;
  return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function getProducts({ includeInactive = false } = {}) {
  let query = requireClient().from("products").select("*").order("created_at");
  if (!includeInactive) query = query.eq("active", true);
  const { data, error } = await query;
  if (error) throw error;
  return data.map(mapProduct);
}

export async function getReviews() {
  const { data, error } = await requireClient()
    .from("reviews")
    .select("id, author, rating, body, image_url, created_at, products(name, brand, image_url)")
    .eq("approved", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map((review) => ({
    id: review.id,
    author: review.author,
    rating: review.rating,
    quote: review.body,
    text: review.body,
    product: {
      name: review.products?.name || "Customer fragrance",
      brand: review.products?.brand || "Customer review",
      image: review.image_url || review.products?.image_url || "",
    },
  }));
}

export async function createReview({ productId, author, rating, body, imageFile }) {
  const client = requireClient();
  const { data: authData, error: authError } = await client.auth.getUser();
  if (authError || !authData.user) throw new Error("Please sign in to publish a review.");
  let imageUrl = "";
  if (imageFile) {
    imageUrl = await uploadImage("review-images", authData.user.id, imageFile);
  }
  const { data, error } = await client.from("reviews").insert({
    user_id: authData.user.id,
    product_id: productId || null,
    author,
    rating,
    body,
    image_url: imageUrl,
  }).select().single();
  if (error) throw error;
  return data;
}

export async function createOrder(items, shippingAddress) {
  const payload = items.map((item) => ({ product_id: item.id, quantity: item.quantity }));
  const { data, error } = await requireClient().rpc("create_order", {
    p_items: payload,
    p_shipping_address: shippingAddress,
  });
  if (error) throw error;
  return data;
}

export async function getMyOrders() {
  const { data, error } = await requireClient()
    .from("orders")
    .select("id, order_number, status, total, shipping_address, created_at, order_items(id, name, brand, image_url, unit_price, quantity)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(mapOrder);
}

export async function getAdminData() {
  const client = requireClient();
  const [productsResult, reviewsResult, ordersResult, profilesResult] = await Promise.all([
    client.from("products").select("*").order("created_at"),
    client.from("reviews").select("id, author, rating, body, image_url, products(name, image_url)").order("created_at", { ascending: false }),
    client.from("orders").select("id, order_number, status, total, created_at, profiles(full_name, email)").order("created_at", { ascending: false }),
    client.from("profiles").select("id, full_name, email, role, created_at, orders(count)").order("created_at", { ascending: false }),
  ]);
  const failed = [productsResult, reviewsResult, ordersResult, profilesResult].find((result) => result.error);
  if (failed) throw failed.error;
  return {
    products: productsResult.data.map(mapProduct),
    reviews: reviewsResult.data.map((review) => ({ id: review.id, author: review.author, rating: review.rating, text: review.body, product: review.products?.name || "Deleted product", image: review.image_url || review.products?.image_url || "" })),
    transactions: ordersResult.data.map((order) => ({ id: order.order_number, databaseId: order.id, customer: order.profiles?.full_name || order.profiles?.email || "Customer", total: Number(order.total), date: new Date(order.created_at).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }), status: order.status })),
    customers: profilesResult.data.filter((profile) => profile.role !== "admin").map((profile) => ({ id: profile.id, name: profile.full_name || "Customer", email: profile.email, joined: new Date(profile.created_at).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }), orders: profile.orders?.[0]?.count || 0 })),
  };
}

export async function addProduct(product, imageFile) {
  const client = requireClient();
  const { data: authData, error: authError } = await client.auth.getUser();
  if (authError || !authData.user) throw new Error("Please sign in as an administrator.");
  const imageUrl = await uploadImage("product-images", authData.user.id, imageFile);
  const { data, error } = await client.from("products").insert({ ...product, image_url: imageUrl }).select().single();
  if (error) throw error;
  return mapProduct(data);
}

export async function updateProduct(id, changes) {
  const { data, error } = await requireClient().from("products").update(changes).eq("id", id).select().single();
  if (error) throw error;
  return mapProduct(data);
}

export async function deleteProduct(id) {
  const { error } = await requireClient().from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteReview(id) {
  const { error } = await requireClient().from("reviews").delete().eq("id", id);
  if (error) throw error;
}

export async function updateOrderStatus(id, status) {
  const { error } = await requireClient().from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}

function mapProduct(product) {
  return { ...product, price: Number(product.price), image: product.image_url, type: product.type || "Unisex" };
}

function mapOrder(order) {
  return {
    id: order.order_number,
    databaseId: order.id,
    status: order.status,
    total: Number(order.total),
    shippingAddress: order.shipping_address,
    createdAt: order.created_at,
    items: (order.order_items || []).map((item) => ({ ...item, image: item.image_url, price: Number(item.unit_price) })),
  };
}
