// Utility function to format Indian currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Alternative simple format for display
export const formatPrice = (amount) => {
  return `₹${amount.toLocaleString("en-IN")}`
}
