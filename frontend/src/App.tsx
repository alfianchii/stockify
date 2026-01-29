import { useState, useCallback } from "react"
import { Sidebar } from "./components/Sidebar"
import { ProductInventory } from "./components/ProductInventory"
import { Dashboard } from "./components/Dashboard"
import { AddProduct } from "./components/AddProduct"
import { Product } from "./api/productApi"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"

function App() {
	const [currentView, setCurrentView] = useState<"login" | "register" | "app">(() => {
		return localStorage.getItem("token") ? "app" : "login"
	})

	const getUserName = () => {
		try {
			const user = localStorage.getItem("user")
			if (user) {
				const parsed = JSON.parse(user)
				return parsed.name || "User"
			}
		} catch {
			return "User"
		}

		return "User"
	}

	const [userName, setUserName] = useState(getUserName)

	const [activeTab, setActiveTab] = useState<"dashboard" | "inventory" | "add-product">("dashboard")
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)
	const [refreshKey, setRefreshKey] = useState(0)

	const handleAddProduct = useCallback(() => {
		setEditingProduct(null)
		setActiveTab("add-product")
	}, [])

	const handleEditProduct = useCallback((product: Product) => {
		setEditingProduct(product)
		setActiveTab("add-product")
	}, [])

	const handleProductSaved = useCallback(() => {
		setRefreshKey((k) => k + 1)
	}, [])

	const handleCancel = useCallback(() => {
		setEditingProduct(null)
		setActiveTab("inventory")
	}, [])

	const handleLoginSuccess = () => {
		setUserName(getUserName())
		setCurrentView("app")
	}

	const handleLogout = () => {
		localStorage.removeItem("token")
		localStorage.removeItem("user")
		setCurrentView("login")
	}

	if (currentView == "login") {
		return <Login onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setCurrentView("register")} />
	}

	if (currentView == "register") {
		return <Register onRegisterSuccess={handleLoginSuccess} onNavigateToLogin={() => setCurrentView("login")} />
	}

	return (
		<div className="flex h-screen w-full bg-background-dark text-white font-display">
			<Sidebar activeTab={activeTab === "add-product" ? "inventory" : activeTab} onTabChange={setActiveTab} userName={userName} onLogout={handleLogout} />
			{activeTab === "dashboard" && <Dashboard key={`dashboard-${refreshKey}`} userName={userName} />}
			{activeTab === "inventory" && <ProductInventory key={`inventory-${refreshKey}`} onAddProduct={handleAddProduct} onEditProduct={handleEditProduct} />}
			{activeTab === "add-product" && <AddProduct onCancel={handleCancel} onSuccess={handleProductSaved} editProduct={editingProduct} />}
		</div>
	)
}

export default App
