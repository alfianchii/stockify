import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Product name is required"],
			trim: true,
			maxlength: [200, "Product name cannot exceed 200 characters"],
		},
		description: {
			type: String,
			trim: true,
			maxlength: [2000, "Description cannot exceed 2000 characters"],
		},
		category: {
			type: String,
			required: [true, "Product category is required"],
			enum: {
				values: ["Electronics", "Wearables", "Accessories", "Furniture", "Stationery", "Other"],
				message: "{VALUE} is not a valid category",
			},
		},
		brand: {
			type: String,
			trim: true,
			maxlength: [100, "Brand name cannot exceed 100 characters"],
		},
		price: {
			type: Number,
			required: [true, "Product price is required"],
			min: [0, "Price cannot be negative"],
		},
		stock: {
			type: Number,
			required: [true, "Stock quantity is required"],
			min: [0, "Stock cannot be negative"],
			default: 0,
		},
		sku: {
			type: String,
			required: [true, "SKU is required"],
			unique: true,
			trim: true,
			uppercase: true,
		},
		images: {
			type: [String],
			default: [],
		},
		status: {
			type: String,
			enum: {
				values: ["active", "inactive", "out-of-stock"],
				message: "{VALUE} is not a valid status",
			},
			default: "active",
		},
	},
	{
		timestamps: true,
	}
)

// Pre-save middleware to auto-update status based on stock
productSchema.pre("save", function () {
	if (this.stock === 0) {
		this.status = "out-of-stock"
	} else if (this.status === "out-of-stock" && this.stock > 0) {
		this.status = "active"
	}
})

// Pre-update middleware to auto-update status based on stock
productSchema.pre("findOneAndUpdate", function () {
	const update = this.getUpdate()
	if (update.stock !== undefined) {
		if (update.stock === 0) {
			this.set({ status: "out-of-stock" })
		}
	}
})

// Index for faster queries
productSchema.index({ name: "text", sku: "text" })
productSchema.index({ category: 1 })
productSchema.index({ status: 1 })
productSchema.index({ stock: 1 })
productSchema.index({ createdAt: -1 })

const Product = mongoose.model("Product", productSchema)

export default Product
