"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CreditCard, Truck, Shield, ArrowLeft, Banknote } from "lucide-react"
import { useApp } from "../App"
import { formatPrice } from "../utils/currency"
import { addOrder, getUserInfo } from "../utils/localStorage"

export default function Checkout() {
  const { cart, getTotalPrice, clearCart, userInfo, setUserInfo } = useApp()
  const navigate = useNavigate()
  const [orderComplete, setOrderComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",

    // Payment Information
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",

    // Order Options
    shippingMethod: "standard",
    paymentMethod: "card", // card, cod, upi
  })

  // Load user info on component mount
  useEffect(() => {
    const savedUserInfo = getUserInfo()
    setFormData((prev) => ({
      ...prev,
      ...savedUserInfo,
    }))
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Save user info to localStorage
    const userInfoToSave = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
    }
    setUserInfo(userInfoToSave)

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create order
    const order = {
      items: cart,
      total: total,
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      paymentMethod: formData.paymentMethod,
      shippingMethod: formData.shippingMethod,
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      },
    }

    addOrder(order)
    setOrderComplete(true)
    clearCart()
    setIsSubmitting(false)
  }

  const subtotal = getTotalPrice()
  const shipping = formData.shippingMethod === "express" ? 1329 : subtotal > 4000 ? 0 : 829
  const tax = Math.round(subtotal * 0.18) // 18% GST in India
  const total = subtotal + shipping + tax

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 max-w-md w-full text-center">
          <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            {formData.paymentMethod === "cod"
              ? "Your order has been placed. You can pay when your order is delivered."
              : "Thank you for your purchase. You'll receive a confirmation email shortly."}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/products")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate("/account")}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              View Order History
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 sm:mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Checkout</h1>

              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Shipping Information */}
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Shipping Method</h2>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 sm:p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="standard"
                        checked={formData.shippingMethod === "standard"}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm sm:text-base">Standard Shipping</p>
                            <p className="text-xs sm:text-sm text-gray-600">5-7 business days</p>
                          </div>
                          <p className="font-medium text-sm sm:text-base">
                            {subtotal > 4000 ? "Free" : formatPrice(829)}
                          </p>
                        </div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 sm:p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="express"
                        checked={formData.shippingMethod === "express"}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm sm:text-base">Express Shipping</p>
                            <p className="text-xs sm:text-sm text-gray-600">2-3 business days</p>
                          </div>
                          <p className="font-medium text-sm sm:text-base">{formatPrice(1329)}</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 sm:p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-gray-600 mr-3" />
                        <div>
                          <p className="font-medium text-sm sm:text-base">Credit/Debit Card</p>
                          <p className="text-xs sm:text-sm text-gray-600">Pay securely with your card</p>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center p-3 sm:p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <Banknote className="h-5 w-5 text-gray-600 mr-3" />
                        <div>
                          <p className="font-medium text-sm sm:text-base">Cash on Delivery</p>
                          <p className="text-xs sm:text-sm text-gray-600">Pay when your order is delivered</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Payment Information - Only show for card payment */}
                {formData.paymentMethod === "card" && (
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Card Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          required={formData.paymentMethod === "card"}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            required={formData.paymentMethod === "card"}
                            placeholder="MM/YY"
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            required={formData.paymentMethod === "card"}
                            placeholder="123"
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card *</label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          required={formData.paymentMethod === "card"}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:text-base disabled:bg-blue-400"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {formData.paymentMethod === "card" ? (
                        <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      ) : (
                        <Banknote className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      )}
                      {formData.paymentMethod === "cod" ? "Place Order" : `Pay ${formatPrice(total)}`}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 sticky top-8">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs sm:text-sm truncate">{item.name}</p>
                      <p className="text-gray-600 text-xs sm:text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-xs sm:text-sm">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                {formData.paymentMethod === "cod" && (
                  <div className="flex justify-between text-orange-600">
                    <span>COD Charges</span>
                    <span>Free</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold text-base sm:text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-green-600" />
                  Secure checkout
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <Truck className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-600" />
                  Free returns within 30 days
                </div>
                {formData.paymentMethod === "cod" && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Banknote className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-orange-600" />
                    Pay on delivery
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
