"use client"

import { Link } from "react-router-dom"
import { ShoppingCart, Plus, Minus, X, ArrowLeft, Heart } from "lucide-react"
import { useApp } from "../App"
import { formatPrice } from "../utils/currency"

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, addToWishlist, isInWishlist } = useApp()

  const handleMoveToWishlist = (product) => {
    if (!isInWishlist(product.id)) {
      addToWishlist(product)
    }
    removeFromCart(product.id)
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mx-auto mb-6" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8 text-sm sm:text-base">
              Looks like you haven't added any items to your cart yet.
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
            </p>
          </div>
          <Link to="/products" className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base">
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <Link to={`/product/${item.id}`}>
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg hover:opacity-75 transition-opacity"
                          />
                        </Link>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.id}`}>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm sm:text-base mb-2 line-clamp-2">{item.description}</p>
                        <div className="flex items-center space-x-4">
                          <span className="text-lg sm:text-xl font-bold text-gray-900">{formatPrice(item.price)}</span>
                          {item.originalPrice > item.price && (
                            <span className="text-sm sm:text-base text-gray-500 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 min-w-[3rem] text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleMoveToWishlist(item)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Move to Wishlist"
                          >
                            <Heart className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove from Cart"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Total */}
                    <div className="mt-4 sm:hidden">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Subtotal:</span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 sticky top-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{getTotalPrice() > 4000 ? "Free" : formatPrice(829)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-medium">{formatPrice(Math.round(getTotalPrice() * 0.18))}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-base sm:text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-blue-600">
                      {formatPrice(
                        getTotalPrice() + (getTotalPrice() > 4000 ? 0 : 829) + Math.round(getTotalPrice() * 0.18),
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block text-sm sm:text-base"
              >
                Proceed to Checkout
              </Link>

              <div className="mt-4 text-center">
                <Link to="/products" className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
