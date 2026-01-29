import express from "express"
import productRoutes from "./products.js"
import authRoutes from "./auth.js"

const router = express.Router()

// Health check
router.get("/health", (req, res) => {
	res.json({
		success: true,
		message: "Stockify API is running",
		timestamp: new Date().toISOString(),
	})
})

// API routes
router.use("/auth", authRoutes)
router.use("/products", productRoutes)

export default router
