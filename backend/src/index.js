import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import connectDB from "./config/database.js"
import routes from "./routes/index.js"

dotenv.config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

connectDB()

const app = express()
app.use(
	cors({
		origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", process.env.APP_URL],
		credentials: true,
	})
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

app.use("/api", routes)

app.get("/", (_, res) => {
	res.json({
		success: true,
		message: "Welcome to Stockify API",
		version: "1.0.0",
		database: "MongoDB",
		endpoints: {
			health: "GET /api/health",
			auth: "POST /api/auth/login",
			register: "POST /api/auth/register",
			products: "GET /api/products",
			productStats: "GET /api/products/stats",
			createProduct: "POST /api/products",
			getProduct: "GET /api/products/:id",
			updateProduct: "PUT /api/products/:id",
			deleteProduct: "DELETE /api/products/:id",
			uploadImages: "POST /api/products/:id/images",
		},
	})
})

app.use((_, res) => {
	res.status(404).json({
		success: false,
		message: "Route not found",
	})
})

app.use((err, req, res, next) => {
	console.error(err.stack)

	if (err.code === "LIMIT_FILE_SIZE") {
		return res.status(400).json({
			success: false,
			message: "File too large. Maximum size is 5MB",
		})
	}

	res.status(500).json({
		success: false,
		message: "Internal server error",
		error: process.env.NODE_ENV === "development" ? err.message : undefined,
	})
})

const API_HOST = process.env.HOST || "localhost"
const API_PORT = process.env.PORT || 3000
app.listen(API_PORT, () => {
	console.log(`Server running on port ${API_PORT}`)
	console.log(`API available at http://${API_HOST}:${API_PORT}/api`)
})
