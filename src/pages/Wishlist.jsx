"use client"

import { Link } from "react-router-dom"
import { Heart, ShoppingCart, X, ArrowLeft } from "lucide-react"
import { useApp } from "../App"
import { formatPrice } from "../utils/currency"

export default function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart, isInWishlist } = useApp()

  const handleAddToCart = (product) => {
    addToCart(product)
    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(product.id)
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Heart className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mx-auto mb-6" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-8 text-sm sm:text-base">
              Save items you love by clicking the heart icon on any product.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved for later
            </p>
          </div>
          <Link to="/products" className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base">
            Continue Shopping
          </Link>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="relative group">
                <Link to={`/product/${item.id}`}>
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
                {item.originalPrice > item.price && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                    Sale
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-6">
                <Link to={`/product/${item.id}`}>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                </Link>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <span className="text-lg sm:text-xl font-bold text-gray-900">{formatPrice(item.price)}</span>
                    {item.originalPrice > item.price && (
                      <span className="text-sm text-gray-500 line-through">{formatPrice(item.originalPrice)}</span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Heart className="h-4 w-4 text-red-500 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Love Everything?</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Add all your wishlist items to cart with one click
            </p>
            <button
              onClick={() => {
                wishlist.forEach((item) => addToCart(item))
              }}
              className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Add All to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
