import mongoose from "mongoose"
import dotenv from "dotenv"
import Product from "../models/Product.js"

dotenv.config()

const products = [
	{
		name: "Wireless Headphones",
		description: "Premium wireless noise-cancelling headphones with exceptional sound quality and 30-hour battery life.",
		category: "Electronics",
		brand: "AudioTech",
		price: 299.0,
		stock: 45,
		sku: "WH-001",
		images: [
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCeKXDXUTS2081EgaPH1Ruw3-oi98AT0gDy-y3YmsYhcQRdKdQQyP1Gd71v6nBVtgZHKASkYsJ_5UeWjkyD4JRMrTcuyDpBw8yLMRECFik6kNVFbTsQmDC9-B708h95CDBuCuoXfCEIOlFox-PBZ_kTW30V-8ZDXufkQUbuAkmIqQozsdO0AvJs3yT_J5AAFRMFJlxmIjrH9b8gQrIHCRZv8HUR0RRiNx_bPrhya7mj9ZLgcVoLrc77gXWqBDc992YAwTkNqfUoHbM",
		],
		status: "active",
	},
	{
		name: "Series 7 Smartwatch",
		description: "Advanced smartwatch with health monitoring, GPS, and water resistance up to 50 meters.",
		category: "Wearables",
		brand: "TechWear",
		price: 399.0,
		stock: 3,
		sku: "SW-007",
		images: [
			"https://lh3.googleusercontent.com/aida-public/AB6AXuBXtZvZ0xhHZQpg1Xs6iXZS5uTpXPRapp8jMnYT7ddacuCLLn1vw-9IIvJoKEb7RAkC2rVc3dSnZEKGXD2kguGZeFspQFeicvLg9FOisTWhAeHko4YGX_nQdOi2f4iB4IiQld0jRAjQHz5DGefaCwCtrjMfze_V9NGT-cfYoxivxSP-gew6jSJ-1pZZ_LBBw6yEwOJ7DzkYR0IluV-9Gi84QhzgldmP_bzPtHssjP0fzqidBmOnEvnWHEXVKLv9PqWImu87td3oRAo",
		],
		status: "active",
	},
	{
		name: "Mechanical Keyboard",
		description: "RGB mechanical gaming keyboard with Cherry MX switches and programmable macros.",
		category: "Electronics",
		brand: "GameGear",
		price: 149.0,
		stock: 120,
		sku: "MK-RGB",
		images: [
			"https://lh3.googleusercontent.com/aida-public/AB6AXuDxjD6y6sC2ogTxHBlaWXYVB1gxyu7AGmDqGt7sWLvsPeyIY-yctiHvM_dLAgGPQY9-bF2S8QDUPPoly6OX4DTzexdLzTK6dNaa3ceAqJoID61L8a9JkKB4khKqvT5bbBovw12kMiLYN9AWW7eBkVRLkJDUZb8OBZYgudtDTLQtDrd81e2pAU8HbZwYLZ5oESvGUcZYWEn-QyXoNun_qUjI4cvejD4k0ueR4OFNTNBbn2YdAaKJtZvNEct3-7Fcj2YAW8SoL3CDJfY",
		],
		status: "active",
	},
	{
		name: '4K IPS Monitor 27"',
		description: "27-inch 4K IPS monitor with HDR support, 144Hz refresh rate, and USB-C connectivity.",
		category: "Electronics",
		brand: "VisionPro",
		price: 450.0,
		stock: 0,
		sku: "MN-4K27",
		images: [
			"https://lh3.googleusercontent.com/aida-public/AB6AXuB84XBdTKNdtp5wDtyg4I646nFYcVz6zf1zC62sRz21G3N3ygVIFDz6SkSGuWFfgW_CKSl1GLef4YpUOSqu3wJ7xJ0ZIQ_rwW92B64QLKJASEfJYYn5a8CgmTd__qTJHYeEuXuEl7jn6s6GMMwD9YWrMW3De3UoLR4SmHblnimk6HtbW9V2RdIneRSPYsSwEptE-qPVQ_JulnPRDJcEjwV7HMmbVaFCyMJU06r-xjDpkp5Bwd__PO0zJosaUJ6JsSYn6VhFirGCJoE",
		],
		status: "out-of-stock",
	},
	{
		name: "Gaming Mouse",
		description: "Ergonomic gaming mouse with 16000 DPI sensor, RGB lighting, and 8 programmable buttons.",
		category: "Accessories",
		brand: "GameGear",
		price: 89.0,
		stock: 15,
		sku: "GM-PRO",
		images: [
			"https://lh3.googleusercontent.com/aida-public/AB6AXuAW6VErekOR0dq1QK3a4jZeAdFmKxg6CkpIBp0W8HJ-mJV5bizub8Fz6DVKNJ95DPC67dh7PAB0Mcy4X1M8OBFb494xmumzXHrgeg5-A7fqugt3WkeJcEr44I-YM03sl19GFFmY4X4oUJgUpzJ6IldB6aNBv3kXlcF_c0_9AHYiqRByw9Dln9zjtV5KDyqxpzXFEbLHtzuV6NFM5bbq4LJPag_4pM6vMCHnY-V7qft0DfA5R0U_7hskKQQabI4L2jVOjiImkAQZ1Vo",
		],
		status: "active",
	},
	{
		name: "Ergonomic Chair",
		description: "Premium ergonomic office chair with lumbar support and adjustable armrests.",
		category: "Furniture",
		brand: "ComfortPlus",
		price: 250.0,
		stock: 25,
		sku: "EC-4920",
		images: [
			"https://lh3.googleusercontent.com/aida-public/AB6AXuAJ422Wl42lCRz5M6uNPjDvBBvZgI3wtnZm6eOOlU9qvcYsCz9fea5aOm3LGHWjl2j3aE5Pjs_S5JoXkXno_pwopMFX-mBrWr_YntXtvoP2JXsINlTNZgFQFy4Nkq1o1Op3vLvEF9eofhRJ2mOFyLIT5Kkup3n2sP2MlGAPlhXw5n3DdYQml79RWMpdKIBdYpE4YERn943Hb3UxesvM2M-EBxvWhutopwIKLTU14GJg8aIQZhorzirKs1LDwQ47m6-U11UJ40Txuwg",
		],
		status: "active",
	},
	{
		name: "Leather Journal",
		description: "Handcrafted leather-bound journal with premium paper, perfect for notes and sketches.",
		category: "Stationery",
		brand: "CraftNotes",
		price: 25.0,
		stock: 50,
		sku: "LJ-4923",
		images: [
			"https://lh3.googleusercontent.com/aida-public/AB6AXuAy-iIkDAuVD4LiNJ5kHQzw6ajt6nz5D0-gcsWnXcM0T6TAsFj-VzRx40dNOh98KGYYNFaqIj0GYDEwNGhcxvcH8hvrRGM4SR2roSv9plCXtP2g9sVOyA1iEQAymfnLvqhLLg68KWIP3lKDzUn3v2IoNEberMMqEDFgE6p8nelsYGOLyRkMt8z0xUpVshsGNN5ef2jOh0eocGX21caqE_o0m9FdhurN_Pdk7oQmbEp5-PsAKXdXQank-OE0F8NaWYG2XFPRNj8FxH4",
		],
		status: "active",
	},
	{
		name: "Wireless Headset",
		description: "Gaming wireless headset with surround sound and noise-cancelling microphone.",
		category: "Electronics",
		brand: "AudioTech",
		price: 129.0,
		stock: 2,
		sku: "WH-002",
		images: [],
		status: "active",
	},
	{
		name: "Gaming Mouse Pro",
		description: "Professional gaming mouse with adjustable weight system.",
		category: "Accessories",
		brand: "GameGear",
		price: 79.0,
		stock: 4,
		sku: "GM-203",
		images: [],
		status: "active",
	},
	{
		name: "Screen Protector X11",
		description: "Tempered glass screen protector with anti-fingerprint coating.",
		category: "Accessories",
		brand: "ScreenGuard",
		price: 15.0,
		stock: 0,
		sku: "SP-X11",
		images: [],
		status: "out-of-stock",
	},
	{
		name: "USB-C Cable 1m",
		description: "High-speed USB-C cable with fast charging support up to 100W.",
		category: "Accessories",
		brand: "CablePro",
		price: 12.0,
		stock: 5,
		sku: "CB-005",
		images: [],
		status: "active",
	},
]

const seedProducts = async () => {
	try {
		console.log("Connecting to MongoDB...")
		await mongoose.connect(process.env.MONGODB_URI)
		console.log("MongoDB Connected!")

		console.log("Clearing existing products...")
		await Product.deleteMany({})

		console.log("Inserting seed products...")
		const insertedProducts = await Product.insertMany(products)

		console.log(`✅ Seeded ${insertedProducts.length} products successfully!`)

		await mongoose.disconnect()
		console.log("MongoDB Disconnected.")
		process.exit(0)
	} catch (error) {
		console.error("❌ Error seeding products:", error.message)
		process.exit(1)
	}
}

seedProducts()
