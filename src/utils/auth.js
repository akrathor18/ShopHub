// Authentication utility functions
import { getFromStorage, setToStorage, removeFromStorage } from "./localStorage"

const AUTH_STORAGE_KEY = "shophub_users"
const CURRENT_USER_KEY = "shophub_current_user"

// Get all registered users
export const getUsers = () => getFromStorage(AUTH_STORAGE_KEY) || []

// Save users to localStorage
export const saveUsers = (users) => setToStorage(AUTH_STORAGE_KEY, users)

// Register a new user
export const registerUser = (userData) => {
  const users = getUsers()

  // Check if user already exists
  const existingUser = users.find((user) => user.email === userData.email)
  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
    isActive: true,
  }

  // Add to users array
  users.push(newUser)
  saveUsers(users)

  return newUser
}

// Login user
export const loginUser = (email, password) => {
  const users = getUsers()
  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) {
    throw new Error("Invalid email or password")
  }

  if (!user.isActive) {
    throw new Error("Account is deactivated")
  }

  // Save current user
  const userSession = {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    loginTime: new Date().toISOString(),
  }

  setToStorage(CURRENT_USER_KEY, userSession)
  return userSession
}

// Get current logged in user
export const getCurrentUser = () => getFromStorage(CURRENT_USER_KEY)

// Logout user
export const logoutUser = () => {
  removeFromStorage(CURRENT_USER_KEY)
}

// Update user profile
export const updateUserProfile = (userId, updates) => {
  const users = getUsers()
  const userIndex = users.findIndex((u) => u.id === userId)

  if (userIndex === -1) {
    throw new Error("User not found")
  }

  users[userIndex] = { ...users[userIndex], ...updates }
  saveUsers(users)

  // Update current user session if it's the same user
  const currentUser = getCurrentUser()
  if (currentUser && currentUser.id === userId) {
    const updatedSession = {
      ...currentUser,
      name: `${updates.firstName || currentUser.firstName} ${updates.lastName || currentUser.lastName}`,
      firstName: updates.firstName || currentUser.firstName,
      lastName: updates.lastName || currentUser.lastName,
      email: updates.email || currentUser.email,
      phone: updates.phone || currentUser.phone,
    }
    setToStorage(CURRENT_USER_KEY, updatedSession)
    return updatedSession
  }

  return users[userIndex]
}

// Change password
export const changePassword = (userId, currentPassword, newPassword) => {
  const users = getUsers()
  const user = users.find((u) => u.id === userId)

  if (!user) {
    throw new Error("User not found")
  }

  if (user.password !== currentPassword) {
    throw new Error("Current password is incorrect")
  }

  user.password = newPassword
  saveUsers(users)
  return true
}

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
export const isValidPassword = (password) => {
  return password.length >= 6
}

// Check if user exists
export const userExists = (email) => {
  const users = getUsers()
  return users.some((user) => user.email === email)
}
