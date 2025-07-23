// Local Storage utility functions
const STORAGE_KEYS = {
  CART: "shophub_cart",
  WISHLIST: "shophub_wishlist",
  USER: "shophub_user",
  ORDERS: "shophub_orders",
  USER_INFO: "shophub_user_info",
}

// Generic storage functions
export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error)
    return null
  }
}

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error setting ${key} to localStorage:`, error)
  }
}

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error)
  }
}

// Cart functions
export const getCart = () => getFromStorage(STORAGE_KEYS.CART) || []
export const setCart = (cart) => setToStorage(STORAGE_KEYS.CART, cart)

// Wishlist functions
export const getWishlist = () => getFromStorage(STORAGE_KEYS.WISHLIST) || []
export const setWishlist = (wishlist) => setToStorage(STORAGE_KEYS.WISHLIST, wishlist)

// User functions
export const getUser = () => getFromStorage(STORAGE_KEYS.USER)
export const setUser = (user) => setToStorage(STORAGE_KEYS.USER, user)
export const removeUser = () => removeFromStorage(STORAGE_KEYS.USER)

// Orders functions
export const getOrders = () => getFromStorage(STORAGE_KEYS.ORDERS) || []
export const setOrders = (orders) => setToStorage(STORAGE_KEYS.ORDERS, orders)
export const addOrder = (order) => {
  const orders = getOrders()
  const newOrder = {
    ...order,
    id: `ORD-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    status: order.paymentMethod === "cod" ? "Processing" : "Confirmed",
  }
  orders.unshift(newOrder)
  setOrders(orders)
  return newOrder
}

// User Info functions
export const getUserInfo = () =>
  getFromStorage(STORAGE_KEYS.USER_INFO) || {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  }
export const setUserInfo = (userInfo) => setToStorage(STORAGE_KEYS.USER_INFO, userInfo)
