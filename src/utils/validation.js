// Validation schemas and helper functions
export const validationRules = {
  email: {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters long",
    },
  },
  confirmPassword: (password) => ({
    required: "Please confirm your password",
    validate: (value) => value === password || "Passwords do not match",
  }),
  firstName: {
    required: "First name is required",
    minLength: {
      value: 2,
      message: "First name must be at least 2 characters",
    },
    pattern: {
      value: /^[A-Za-z\s]+$/,
      message: "First name can only contain letters and spaces",
    },
  },
  lastName: {
    required: "Last name is required",
    minLength: {
      value: 2,
      message: "Last name must be at least 2 characters",
    },
    pattern: {
      value: /^[A-Za-z\s]+$/,
      message: "Last name can only contain letters and spaces",
    },
  },
  phone: {
    required: "Phone number is required",
    pattern: {
      value: /^[6-9]\d{9}$/,
      message: "Please enter a valid 10-digit Indian mobile number",
    },
  },
  address: {
    required: "Address is required",
    minLength: {
      value: 10,
      message: "Address must be at least 10 characters long",
    },
  },
  city: {
    required: "City is required",
    minLength: {
      value: 2,
      message: "City name must be at least 2 characters",
    },
    pattern: {
      value: /^[A-Za-z\s]+$/,
      message: "City name can only contain letters and spaces",
    },
  },
  state: {
    required: "State is required",
    minLength: {
      value: 2,
      message: "State name must be at least 2 characters",
    },
  },
  zipCode: {
    required: "PIN code is required",
    pattern: {
      value: /^[1-9][0-9]{5}$/,
      message: "Please enter a valid 6-digit PIN code",
    },
  },
  cardNumber: {
    required: "Card number is required",
    pattern: {
      value: /^[0-9]{13,19}$/,
      message: "Please enter a valid card number (13-19 digits)",
    },
  },
  expiryDate: {
    required: "Expiry date is required",
    pattern: {
      value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
      message: "Please enter expiry date in MM/YY format",
    },
    validate: (value) => {
      const [month, year] = value.split("/")
      const expiry = new Date(2000 + Number.parseInt(year), Number.parseInt(month) - 1)
      const now = new Date()
      return expiry > now || "Card has expired"
    },
  },
  cvv: {
    required: "CVV is required",
    pattern: {
      value: /^[0-9]{3,4}$/,
      message: "CVV must be 3 or 4 digits",
    },
  },
  cardName: {
    required: "Name on card is required",
    minLength: {
      value: 2,
      message: "Name must be at least 2 characters",
    },
    pattern: {
      value: /^[A-Za-z\s]+$/,
      message: "Name can only contain letters and spaces",
    },
  },
  subject: {
    required: "Subject is required",
    minLength: {
      value: 5,
      message: "Subject must be at least 5 characters long",
    },
  },
  message: {
    required: "Message is required",
    minLength: {
      value: 20,
      message: "Message must be at least 20 characters long",
    },
  },
}

// Helper function to format card number
export const formatCardNumber = (value) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
  const matches = v.match(/\d{4,16}/g)
  const match = (matches && matches[0]) || ""
  const parts = []
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }
  if (parts.length) {
    return parts.join(" ")
  } else {
    return v
  }
}

// Helper function to format expiry date
export const formatExpiryDate = (value) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
  if (v.length >= 2) {
    return v.substring(0, 2) + "/" + v.substring(2, 4)
  }
  return v
}

// Helper function to check if user exists (for signup validation)
export const checkUserExists = async (email) => {
  const { userExists } = await import("./auth")
  return !userExists(email) || "An account with this email already exists"
}
