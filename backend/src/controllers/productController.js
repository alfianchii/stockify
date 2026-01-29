import Product from "../models/Product.js"

export const getProducts = async (req, res) => {
	try {
		const { page = 1, limit = 10, search, category, status } = req.query

		const query = {}

		if (search) {
			query.$or = [{ name: { $regex: search, $options: "i" } }, { sku: { $regex: search, $options: "i" } }]
		}

		if (category && category !== "All Categories") {
			query.category = category
		}

		if (status) {
			query.status = status
		}

		const skip = (parseInt(page) - 1) * parseInt(limit)

		const products = await Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit))

		const total = await Product.countDocuments(query)

		res.json({
			success: true,
			data: products,
			pagination: {
				page: parseInt(page),
				limit: parseInt(limit),
				total,
				pages: Math.ceil(total / parseInt(limit)),
			},
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching products",
			error: error.message,
		})
	}
}

export const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id)

		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product not found",
			})
		}

		res.json({
			success: true,
			data: product,
		})
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				success: false,
				message: "Invalid product ID format",
			})
		}

		res.status(500).json({
			success: false,
			message: "Error fetching product",
			error: error.message,
		})
	}
}

export const createProduct = async (req, res) => {
	try {
		const product = await Product.create(req.body)

		res.status(201).json({
			success: true,
			data: product,
			message: "Product created successfully",
		})
	} catch (error) {
		if (error.code === 11000) {
			return res.status(400).json({
				success: false,
				message: "A product with this SKU already exists",
			})
		}

		if (error.name === "ValidationError") {
			const messages = Object.values(error.errors).map((err) => err.message)
			return res.status(400).json({
				success: false,
				message: messages.join(", "),
			})
		}

		res.status(500).json({
			success: false,
			message: "Error creating product",
			error: error.message,
		})
	}
}

export const updateProduct = async (req, res) => {
	try {
		const currentProduct = await Product.findById(req.params.id)

		if (!currentProduct) {
			return res.status(404).json({
				success: false,
				message: "Product not found",
			})
		}

		const updateData = { ...req.body }
		if (updateData.stock !== undefined) {
			if (updateData.stock === 0) {
				updateData.status = "out-of-stock"
			} else if (currentProduct.status === "out-of-stock" && updateData.stock > 0) {
				updateData.status = "active"
			}
		}

		const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
			new: true,
			runValidators: true,
		})

		res.json({
			success: true,
			data: product,
			message: "Product updated successfully",
		})
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				success: false,
				message: "Invalid product ID format",
			})
		}

		if (error.code === 11000) {
			return res.status(400).json({
				success: false,
				message: "A product with this SKU already exists",
			})
		}

		if (error.name === "ValidationError") {
			const messages = Object.values(error.errors).map((err) => err.message)
			return res.status(400).json({
				success: false,
				message: messages.join(", "),
			})
		}

		res.status(500).json({
			success: false,
			message: "Error updating product",
			error: error.message,
		})
	}
}

export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id)

		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product not found",
			})
		}

		res.json({
			success: true,
			message: "Product deleted successfully",
		})
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				success: false,
				message: "Invalid product ID format",
			})
		}

		res.status(500).json({
			success: false,
			message: "Error deleting product",
			error: error.message,
		})
	}
}

export const uploadProductImages = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id)

		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product not found",
			})
		}

		if (!req.files || req.files.length === 0) {
			return res.status(400).json({
				success: false,
				message: "Please upload at least one image",
			})
		}

		const imageUrls = req.files.map((file) => `/uploads/${file.filename}`)
		product.images.push(...imageUrls)

		await product.save()

		res.json({
			success: true,
			data: product,
			message: "Images uploaded successfully",
		})
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				success: false,
				message: "Invalid product ID format",
			})
		}

		res.status(500).json({
			success: false,
			message: "Error uploading images",
			error: error.message,
		})
	}
}

export const deleteProductImage = async (req, res) => {
	try {
		const { imageUrl } = req.body

		if (!imageUrl) {
			return res.status(400).json({
				success: false,
				message: "Image URL is required",
			})
		}

		const product = await Product.findById(req.params.id)

		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product not found",
			})
		}

		product.images = product.images.filter((img) => img !== imageUrl)

		await product.save()

		res.json({
			success: true,
			data: product,
			message: "Image deleted successfully",
		})
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				success: false,
				message: "Invalid product ID format",
			})
		}

		res.status(500).json({
			success: false,
			message: "Error deleting image",
			error: error.message,
		})
	}
}

export const getProductStats = async (req, res) => {
	try {
		const totalProducts = await Product.countDocuments()

		const lowStockProducts = await Product.find({
			stock: { $gt: 0, $lte: 5 },
		}).select("name sku stock category")

		const outOfStockCount = await Product.countDocuments({ stock: 0 })

		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const newToday = await Product.countDocuments({
			createdAt: { $gte: today },
		})

		const productsByCategory = await Product.aggregate([
			{
				$group: {
					_id: "$category",
					count: { $sum: 1 },
				},
			},
			{
				$sort: { count: -1 },
			},
		])

		const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5).select("name sku price stock status createdAt images")

		res.json({
			success: true,
			data: {
				totalProducts,
				lowStockAlerts: lowStockProducts.length,
				lowStockProducts,
				outOfStockCount,
				newToday,
				productsByCategory,
				recentProducts,
			},
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching statistics",
			error: error.message,
		})
	}
}
