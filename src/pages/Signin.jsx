import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { loginUser } from "../utils/auth"
import { useApp } from "../App"
import { validationRules } from "../utils/validation"

export default function Signin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Get the redirect path from location state, default to home
  const from = location.state?.from?.pathname || "/"

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    clearErrors,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    clearErrors()

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const user = loginUser(data.email, data.password)
      setUser(user)

      // Redirect to the intended page or home
      navigate(from, { replace: true })
    } catch (error) {
      setError("root", { type: "manual", message: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  // Demo accounts for testing
  const demoAccounts = [
    { email: "demo@shophub.com", password: "demo123", name: "Demo User" },
    { email: "john@example.com", password: "password", name: "John Doe" },
  ]

  const handleDemoLogin = async (demoAccount) => {
    setValue("email", demoAccount.email)
    setValue("password", demoAccount.password)

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const user = loginUser(demoAccount.email, demoAccount.password)
      setUser(user)
      navigate(from, { replace: true })
    } catch (error) {
      // If demo account doesn't exist, create it
      try {
        const { registerUser } = await import("../utils/auth")
        registerUser({
          firstName: demoAccount.name.split(" ")[0],
          lastName: demoAccount.name.split(" ")[1] || "",
          email: demoAccount.email,
          phone: "9876543210",
          password: demoAccount.password,
        })
        const user = loginUser(demoAccount.email, demoAccount.password)
        setUser(user)
        navigate(from, { replace: true })
      } catch (createError) {
        setError("root", { type: "manual", message: "Demo account setup failed" })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-md mx-auto px-4">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 text-sm sm:text-base">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600 text-sm sm:text-base">Sign in to your Shophub account</p>
          </div>

          {/* Demo Accounts */}
          <div className="mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
            <p className="text-xs sm:text-sm text-blue-800 font-medium mb-2">Quick Demo Login:</p>
            <div className="space-y-2">
              {demoAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => handleDemoLogin(account)}
                  disabled={isLoading}
                  className="w-full text-left px-2 sm:px-3 py-1 sm:py-2 bg-white rounded border border-blue-200 hover:border-blue-300 transition-colors text-xs sm:text-sm disabled:opacity-50"
                >
                  <div className="font-medium text-gray-900">{account.name}</div>
                  <div className="text-gray-600">{account.email}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  {...register("email", validationRules.email)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 pl-10 sm:pl-12 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", validationRules.password)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 pl-10 sm:pl-12 pr-10 sm:pr-12 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm sm:text-base">
                <input type="checkbox" {...register("rememberMe")} className="mr-2" />
                <span className="text-gray-700">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 text-sm sm:text-base">
                Forgot password?
              </Link>
            </div>

            {/* Submit Error */}
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                <p className="text-red-600 text-xs sm:text-sm">{errors.root.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isValid}
              className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
