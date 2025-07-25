import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { ShoppingCart, Search, Menu, X, User, Heart } from "lucide-react"
import { useApp } from "../App"

export default function Header() {
  const { getTotalItems, setIsCartOpen, searchQuery, setSearchQuery, user, wishlist } = useApp()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsMenuOpen(false)
    }
  }

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/cart", label: "Cart" },
    { to: "/categories", label: "Categories" },
    { to: "/contact", label: "Contact" },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl sm:text-3xl font-bold text-blue-600 transition-colors">
              Shophub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  ` hover:text-gray-900 transition-colors text-m font-bold xl:text-base ${isActive ? "text-blue-600" : "text-gray-700"}`
                }
              >
                {link.label}
              </NavLink>
            ))

            }

          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <form onSubmit={handleSearch} className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <Search className="h-4 w-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-32 lg:w-48"
              />
            </form>

            <Link
              to="/wishlist"
              className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors hidden sm:block"
            >
              <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/account" className="p-2 text-gray-700 hover:text-gray-900 transition-colors hidden sm:block">
              <User className="h-5 w-5 sm:h-6 sm:w-6" />
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-700">
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-4 md:hidden">
              <Search className="h-4 w-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm flex-1"
              />
            </form>
            <nav className="flex flex-col space-y-2">
              <NavLink to="/" className={({ isActive }) =>
                `py-2 px-2 ${isActive ? "text-blue-600 bg-gray-100 p-2 rounded-lg" : "text-gray-700"}`
              } onClick={() => setIsMenuOpen(false)}>
                Home
              </NavLink>
              <NavLink
                to="/products" className={({ isActive }) =>
                  `py-2 px-2 ${isActive ? "text-blue-600 bg-gray-100 p-2 rounded-lg" : "text-gray-700"}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </NavLink>
              <NavLink
                to="/categories" className={({ isActive }) =>
                  `py-2 px-2 ${isActive ? "text-blue-600 bg-gray-100 p-2 rounded-lg" : "text-gray-700"}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </NavLink>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `py-2 px-2 ${isActive ? "text-blue-600 bg-gray-100 p-2 rounded-lg" : "text-gray-700"}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Cart ({getTotalItems()})
              </NavLink>
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  `py-2 px-2 ${isActive ? "text-blue-600 bg-gray-100 p-2 rounded-lg" : "text-gray-700"}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Wishlist ({wishlist.length})
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `py-2 px-2 ${isActive ? "text-blue-600 bg-gray-100 p-2 rounded-lg" : "text-gray-700"}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </NavLink>
              <NavLink
                to="/account"
                className={({ isActive }) =>
                  `py-2 px-2 ${isActive ? "text-blue-600 bg-gray-100 p-2 rounded-lg" : "text-gray-700"}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Account
              </NavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
