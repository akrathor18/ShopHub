import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState, createContext, useContext, useEffect } from "react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import CartSidebar from "./components/CartSidebar"
import Home from "./pages/Home"
import Products from "./pages/Products"
import ProductDetail from "./pages/ProductDetail"
import Categories from "./pages/Categories"
import Contact from "./pages/Contact"
import Checkout from "./pages/Checkout"
import Account from "./pages/Account"
import Cart from "./pages/Cart"
import Wishlist from "./pages/Wishlist"
import Signin from "./pages/Signin"
import Signup from "./pages/Signup"
import {
  getCart,
  setCart,
  getWishlist,
  setWishlist,
  getUserInfo,
  setUserInfo as setStorageUserInfo,
} from "./utils/localStorage"
import { getCurrentUser, logoutUser } from "./utils/auth"
import "./App.css"

// Context for global state
const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}

function App() {
  const [cart, setCartState] = useState([])
  const [wishlist, setWishlistState] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [user, setUserState] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [userInfo, setUserInfoState] = useState({})

  // Load data from localStorage on app start
  useEffect(() => {
    const savedCart = getCart()
    const savedWishlist = getWishlist()
    const savedUser = getCurrentUser()
    const savedUserInfo = getUserInfo()

    setCartState(savedCart)
    setWishlistState(savedWishlist)
    setUserState(savedUser)
    setUserInfoState(savedUserInfo)
  }, [])

  // Cart functions
  const addToCart = (product) => {
    setCartState((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      let newCart
      if (existingItem) {
        newCart = prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }]
      }
      setCart(newCart)
      return newCart
    })
  }

  const removeFromCart = (productId) => {
    setCartState((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== productId)
      setCart(newCart)
      return newCart
    })
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
      return
    }
    setCartState((prevCart) => {
      const newCart = prevCart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
      setCart(newCart)
      return newCart
    })
  }

  const clearCart = () => {
    setCartState([])
    setCart([])
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Wishlist functions
  const addToWishlist = (product) => {
    setWishlistState((prevWishlist) => {
      const isAlreadyInWishlist = prevWishlist.find((item) => item.id === product.id)
      if (isAlreadyInWishlist) {
        return prevWishlist
      }
      const newWishlist = [...prevWishlist, product]
      setWishlist(newWishlist)
      return newWishlist
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlistState((prevWishlist) => {
      const newWishlist = prevWishlist.filter((item) => item.id !== productId)
      setWishlist(newWishlist)
      return newWishlist
    })
  }

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId)
  }

  // User functions
  const setUser = (userData) => {
    setUserState(userData)
  }

  const logout = () => {
    logoutUser()
    setUserState(null)
  }

  const setUserInfo = (info) => {
    setUserInfoState(info)
    setStorageUserInfo(info)
  }

  const contextValue = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isCartOpen,
    setIsCartOpen,
    user,
    setUser,
    logout,
    searchQuery,
    setSearchQuery,
    userInfo,
    setUserInfo,
  }

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:category" element={<Products />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/account" element={<Account />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
          <Footer />
          <CartSidebar />
        </div>
      </Router>
    </AppContext.Provider>
  )
}

export default App
