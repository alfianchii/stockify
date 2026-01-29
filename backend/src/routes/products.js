import express from "express"
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, uploadProductImages, deleteProductImage, getProductStats } from "../controllers/productController.js"
import upload from "../middleware/upload.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

router.use(protect)

router.get("/stats", getProductStats)

router.route("/").get(getProducts).post(createProduct)
router.route("/:id").get(getProductById).put(updateProduct).delete(deleteProduct)

router.post("/:id/images", upload.array("images", 10), uploadProductImages)
router.delete("/:id/images", deleteProductImage)

export default router
