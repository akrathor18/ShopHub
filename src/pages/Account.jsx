import { useState, useEffect } from "react"
import { User, Package, Settings, LogOut, Edit } from "lucide-react"
import { Link } from "react-router-dom"
import { useApp } from "../App"
import { formatPrice } from "../utils/currency"
import { getOrders } from "../utils/localStorage"
import { updateUserProfile, changePassword } from "../utils/auth"

export default function Account() {
  const { user, setUser, logout, userInfo, setUserInfo } = useApp()
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({})
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState("")

  // Get orders from localStorage
  const orders = getOrders()

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: userInfo.address || "",
        city: userInfo.city || "",
        state: userInfo.state || "",
        zipCode: userInfo.zipCode || "",
      })
    }
  }, [user, userInfo])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    try {
      const updatedUser = updateUserProfile(user.id, profileData)
      setUser(updatedUser)
      setUserInfo(profileData)
      setIsEditing(false)
      setSuccess("Profile updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setErrors({ profile: error.message })
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setErrors({})

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ password: "New passwords do not match" })
      return
    }

    if (passwordData.newPassword.length < 6) {
      setErrors({ password: "Password must be at least 6 characters long" })
      return
    }

    try {
      changePassword(user.id, passwordData.currentPassword, passwordData.newPassword)
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setSuccess("Password changed successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setErrors({ password: error.message })
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Welcome to Shophub</h1>
            <p className="text-gray-600 text-sm sm:text-base">Sign in to access your account</p>
          </div>

          <div className="space-y-3">
            <Link
              to="/signin"
              className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block text-sm sm:text-base"
            >
              Sign In
            </Link>
            <Link
              to  ="/signup"
              className="w-full border border-gray-300 text-gray-700 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center block text-sm sm:text-base"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <p className="text-green-600 text-sm sm:text-base">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="text-center mb-6">
                <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">{user.name}</h2>
                <p className="text-gray-600 text-sm sm:text-base">{user.email}</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-colors text-sm sm:text-base ${
                    activeTab === "profile" ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5 mr-3" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-colors text-sm sm:text-base ${
                    activeTab === "orders" ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-3" />
                  Orders ({orders.length})
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-colors text-sm sm:text-base ${
                    activeTab === "settings" ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 mr-3" />
                  Settings
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors text-sm sm:text-base"
                >
                  <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-3" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
              {activeTab === "profile" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Profile Information</h1>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm sm:text-base"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? "Cancel" : "Edit"}
                    </button>
                  </div>

                  {errors.profile && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm">{errors.profile}</p>
                    </div>
                  )}

                  <form onSubmit={handleProfileUpdate}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          value={profileData.firstName || ""}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                          disabled={!isEditing}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-50 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          value={profileData.lastName || ""}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                          disabled={!isEditing}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-50 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={profileData.email || ""}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          disabled={!isEditing}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-50 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={profileData.phone || ""}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          disabled={!isEditing}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-50 text-sm sm:text-base"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input
                          type="text"
                          value={profileData.address || ""}
                          onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                          disabled={!isEditing}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-50 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={profileData.city || ""}
                          onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                          disabled={!isEditing}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-50 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          value={profileData.state || ""}
                          onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                          disabled={!isEditing}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-50 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
                        <input
                          type="text"
                          value={profileData.zipCode || ""}
                          onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                          disabled={!isEditing}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-50 text-sm sm:text-base"
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="mt-6">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Order History</h1>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm sm:text-base">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Order {order.id}</h3>
                              <p className="text-gray-600 text-xs sm:text-sm">Placed on {order.date}</p>
                            </div>
                            <div className="mt-2 sm:mt-0 text-left sm:text-right">
                              <span
                                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                                  order.status === "Delivered"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "Processing"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {order.status}
                              </span>
                              <p className="text-base sm:text-lg font-semibold text-gray-900 mt-1">
                                {formatPrice(order.total)}
                              </p>
                              {order.paymentMethod === "cod" && (
                                <p className="text-xs sm:text-sm text-orange-600 mt-1">Cash on Delivery</p>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-xs sm:text-sm">
                                <span>
                                  {item.name} (x{item.quantity})
                                </span>
                                <span>{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>
                  <div className="space-y-6">
                    {/* Change Password */}
                    <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                      <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Change Password</h3>

                      {errors.password && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-red-600 text-sm">{errors.password}</p>
                        </div>
                      )}

                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                          <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
                        >
                          Change Password
                        </button>
                      </form>
                    </div>

                    {/* Email Notifications */}
                    <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                      <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Email Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center text-sm sm:text-base">
                          <input type="checkbox" defaultChecked className="mr-3" />
                          Order updates and shipping notifications
                        </label>
                        <label className="flex items-center text-sm sm:text-base">
                          <input type="checkbox" defaultChecked className="mr-3" />
                          New product announcements
                        </label>
                        <label className="flex items-center text-sm sm:text-base">
                          <input type="checkbox" className="mr-3" />
                          Marketing emails and promotions
                        </label>
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                      <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Privacy Settings</h3>
                      <div className="space-y-3">
                        <label className="flex items-center text-sm sm:text-base">
                          <input type="checkbox" defaultChecked className="mr-3" />
                          Allow personalized recommendations
                        </label>
                        <label className="flex items-center text-sm sm:text-base">
                          <input type="checkbox" className="mr-3" />
                          Share data for analytics
                        </label>
                      </div>
                    </div>

                    {/* Account Actions */}
                    <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                      <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Account Actions</h3>
                      <div className="space-y-3">
                        <button className="text-red-600 hover:text-red-700 font-medium text-sm sm:text-base">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
