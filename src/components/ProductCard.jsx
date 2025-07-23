import { Star, Heart, ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"
import { useApp } from "../App"
import { formatPrice } from "../utils/currency"

export default function ProductCard({ product }) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp()

  const handleWishlistToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative group">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full shadow-md transition-colors ${
            isInWishlist(product.id)
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
        </button>
        {product.originalPrice > product.price && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-red-500 text-white px-2 py-1 rounded-lg text-xs sm:text-sm font-semibold">
            Sale
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6">
        <Link to={`/product/${product.id}`}>
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h4>
        </Link>

        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                  i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs sm:text-sm text-gray-600 ml-2">
            {product.rating} ({product.reviews})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm sm:text-base lg:text-lg text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white p-2 sm:p-2.5 rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
          >
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
