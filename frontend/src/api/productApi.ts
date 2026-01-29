const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

export interface Product {
  _id: string
  name: string
  description: string
  category: string
  brand: string
  price: number
  stock: number
  sku: string
  images: string[]
  status: "active" | "inactive" | "out-of-stock"
  createdAt: string
  updatedAt: string
}

export interface ProductStats {
  totalProducts: number
  lowStockAlerts: number
  outOfStockCount: number
  newToday: number
  productsByCategory: { category: string; count: number }[]
  recentProducts: Product[]
  lowStockProducts: { name: string; sku: string; stock: number }[]
}

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/"
    throw new Error("Session expired. Please log in again.")
  }
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

export const productApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; category?: string; status?: string; sortBy?: string; sortOrder?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          searchParams.append(key, String(value))
        }
      })
    }
    const response = await fetch(`${API_BASE_URL}/products?${searchParams}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  create: async (product: Omit<Product, "_id" | "createdAt" | "updatedAt">) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
    })
    return handleResponse(response)
  },

  update: async (id: string, product: Partial<Product>) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
    })
    return handleResponse(response)
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },

  getStats: async (): Promise<{ success: boolean; data: ProductStats }> => {
    const response = await fetch(`${API_BASE_URL}/products/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  uploadImages: async (id: string, images: File[]) => {
    const formData = new FormData()
    images.forEach((image) => formData.append("images", image))
    const response = await fetch(`${API_BASE_URL}/products/${id}/images`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    })
    return handleResponse(response)
  },

  deleteImage: async (id: string, imageUrl: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}/images`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      body: JSON.stringify({ imageUrl }),
    })
    return handleResponse(response)
  },
}

export const getImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath
  }
  const backendUrl = API_BASE_URL.replace("/api", "")
  return `${backendUrl}${imagePath}`
}
