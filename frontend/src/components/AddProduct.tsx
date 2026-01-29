import { useState, useRef, DragEvent } from "react"
import { productApi, Product, getImageUrl } from "../api/productApi"

interface AddProductProps {
	onCancel: () => void
	onSuccess?: () => void
	editProduct?: Product | null
}

interface ImagePreview {
	id: string
	url: string
	displayUrl: string
	file?: File
	isExisting?: boolean
}

export const AddProduct = ({ onCancel, onSuccess, editProduct }: AddProductProps) => {
	const isEditing = !!editProduct
	const fileInputRef = useRef<HTMLInputElement>(null)

	const [formData, setFormData] = useState({
		name: editProduct?.name || "",
		description: editProduct?.description || "",
		category: editProduct?.category || "",
		brand: editProduct?.brand || "",
		price: editProduct?.price?.toString() || "",
		stock: editProduct?.stock?.toString() || "",
		sku: editProduct?.sku || "",
	})

	const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>(
		editProduct?.images?.map((url, idx) => ({
			id: `existing-${idx}`,
			url,
			displayUrl: getImageUrl(url),
			isExisting: true,
		})) || []
	)
	const [newFiles, setNewFiles] = useState<File[]>([])
	const [isDragging, setIsDragging] = useState(false)

	const [loading, setLoading] = useState(false)
	const [uploadingImages, setUploadingImages] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { id, value } = e.target
		setFormData((prev) => ({ ...prev, [id]: value }))
	}

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (files) {
			addFiles(Array.from(files))
		}
		if (fileInputRef.current) {
			fileInputRef.current.value = ""
		}
	}

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setIsDragging(true)
	}

	const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setIsDragging(false)
	}

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setIsDragging(false)
		const files = e.dataTransfer.files
		if (files) {
			addFiles(Array.from(files))
		}
	}

	const addFiles = (files: File[]) => {
		const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml", "image/webp"]
		const maxSize = 5 * 1024 * 1024

		const validFiles = files.filter((file) => {
			if (!validTypes.includes(file.type)) {
				setError(`Invalid file type: ${file.name}. Only images are allowed.`)
				return false
			}
			if (file.size > maxSize) {
				setError(`File too large: ${file.name}. Maximum size is 5MB.`)
				return false
			}
			return true
		})

		const newPreviews: ImagePreview[] = validFiles.map((file) => {
			const objectUrl = URL.createObjectURL(file)
			return {
				id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
				url: objectUrl,
				displayUrl: objectUrl,
				file,
			}
		})

		setImagePreviews((prev) => [...prev, ...newPreviews])
		setNewFiles((prev) => [...prev, ...validFiles])
	}

	const removeImage = (id: string) => {
		const preview = imagePreviews.find((p) => p.id === id)
		if (preview) {
			if (!preview.isExisting) {
				URL.revokeObjectURL(preview.url)
			}
			setImagePreviews((prev) => prev.filter((p) => p.id !== id))
			if (preview.file) {
				setNewFiles((prev) => prev.filter((f) => f !== preview.file))
			}
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		if (!formData.name.trim()) {
			setError("Product name is required")
			return
		}
		if (!formData.category) {
			setError("Category is required")
			return
		}
		if (!formData.price || parseFloat(formData.price) < 0) {
			setError("Valid price is required")
			return
		}
		if (!formData.stock || parseInt(formData.stock) < 0) {
			setError("Valid stock quantity is required")
			return
		}
		if (!formData.sku.trim()) {
			setError("SKU is required")
			return
		}

		try {
			setLoading(true)

			const existingImages = imagePreviews.filter((p) => p.isExisting).map((p) => p.url)

			let allImageUrls = [...existingImages]

			if (newFiles.length > 0) {
				setUploadingImages(true)
				try {
					if (isEditing && editProduct) {
						const uploadResponse = await productApi.uploadImages(editProduct._id, newFiles)
						const uploadedProduct = uploadResponse.data
						const newlyUploadedUrls = uploadedProduct.images.filter((img: string) => !editProduct.images.includes(img))
						allImageUrls = [...existingImages, ...newlyUploadedUrls]
					}
				} catch (uploadError) {
					console.error("Image upload failed:", uploadError)
				}
				setUploadingImages(false)
			}

			const productData = {
				name: formData.name.trim(),
				description: formData.description.trim(),
				category: formData.category,
				brand: formData.brand.trim(),
				price: parseFloat(formData.price),
				stock: parseInt(formData.stock),
				sku: formData.sku.trim().toUpperCase(),
				images: allImageUrls,
				status: parseInt(formData.stock) === 0 ? ("out-of-stock" as const) : ("active" as const),
			}

			if (isEditing && editProduct) {
				await productApi.update(editProduct._id, productData)
			} else {
				const response = await productApi.create(productData)
				const savedProduct = response.data

				if (newFiles.length > 0) {
					setUploadingImages(true)
					try {
						await productApi.uploadImages(savedProduct._id, newFiles)
					} catch (uploadError) {
						console.error("Image upload failed:", uploadError)
					}
					setUploadingImages(false)
				}
			}

			onSuccess?.()
			onCancel()
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to save product")
		} finally {
			setLoading(false)
			setUploadingImages(false)
		}
	}

	return (
		<main className="flex-1 flex flex-col h-full bg-background-dark overflow-y-auto">
			<div className="flex justify-center py-10 px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col w-full max-w-[960px] flex-1 gap-6">
					{/* Breadcrumbs */}
					<div className="flex flex-wrap items-center gap-2 px-1">
						<button onClick={onCancel} className="text-text-secondary hover:text-primary transition-colors text-sm font-medium leading-normal flex items-center gap-1">
							<span className="material-symbols-outlined text-lg">inventory_2</span>
							Products
						</button>
						<span className="material-symbols-outlined text-text-secondary text-sm">chevron_right</span>
						<span className="text-white text-sm font-medium leading-normal">{isEditing ? "Edit Product" : "Add New"}</span>
					</div>

					{/* Page Heading */}
					<div className="flex flex-wrap justify-between items-end gap-3 px-1">
						<h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">{isEditing ? "Edit Product" : "Add New Product"}</h1>
						<p className="text-text-secondary text-sm md:text-base max-w-lg text-right hidden sm:block">
							{isEditing ? "Update product information in your inventory." : "Create a new product card for your inventory tracking system."}
						</p>
					</div>

					{/* Error Message */}
					{error && (
						<div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
							<span className="material-symbols-outlined text-red-400">error</span>
							<p className="text-red-400 text-sm">{error}</p>
							<button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
								<span className="material-symbols-outlined text-lg">close</span>
							</button>
						</div>
					)}

					{/* Main Form Card */}
					<form onSubmit={handleSubmit} className="w-full bg-card-dark rounded-xl border border-border-dark/50 shadow-sm p-6 md:p-8 flex flex-col gap-8">
						{/* Section 1: General Info */}
						<div className="flex flex-col gap-6">
							<h2 className="text-lg font-bold text-white border-b border-border-dark/50 pb-2">General Information</h2>
							{/* Product Name */}
							<div className="flex flex-col gap-2">
								<label className="text-white text-sm font-medium leading-normal" htmlFor="name">
									Product Name <span className="text-red-500">*</span>
								</label>
								<input
									className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-[#1b1b32] focus:border-primary h-12 placeholder:text-text-secondary px-4 text-base font-normal leading-normal transition-all duration-200"
									id="name"
									placeholder="e.g. Wireless Noise-Cancelling Headphones"
									type="text"
									value={formData.name}
									onChange={handleChange}
								/>
							</div>
							{/* Description */}
							<div className="flex flex-col gap-2">
								<label className="text-white text-sm font-medium leading-normal" htmlFor="description">
									Description
								</label>
								<textarea
									className="flex w-full min-w-0 flex-1 resize-y rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-[#1b1b32] focus:border-primary min-h-[140px] placeholder:text-text-secondary p-4 text-base font-normal leading-normal transition-all duration-200"
									id="description"
									placeholder="Enter a detailed description of the product features and specifications..."
									value={formData.description}
									onChange={handleChange}
									maxLength={500}
								></textarea>
								<p className="text-xs text-text-secondary text-right">{formData.description.length}/500 characters</p>
							</div>
						</div>

						{/* Section 2: Details & Categorization */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{/* Left Column: Pricing & Category */}
							<div className="flex flex-col gap-6">
								<h2 className="text-lg font-bold text-white border-b border-border-dark/50 pb-2">Categorization</h2>
								{/* Category Dropdown */}
								<div className="flex flex-col gap-2">
									<label className="text-white text-sm font-medium leading-normal" htmlFor="category">
										Category <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<select
											className="w-full appearance-none rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-[#1b1b32] focus:border-primary h-12 px-4 pr-10 text-base font-normal leading-normal transition-all duration-200 cursor-pointer"
											id="category"
											value={formData.category}
											onChange={handleChange}
										>
											<option disabled value="">
												Select a category
											</option>
											<option value="Electronics">Electronics</option>
											<option value="Accessories">Accessories</option>
											<option value="Wearables">Wearables</option>
											<option value="Furniture">Furniture</option>
											<option value="Stationery">Stationery</option>
										</select>
										<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary">
											<span className="material-symbols-outlined">expand_more</span>
										</div>
									</div>
								</div>
								{/* Brand / Manufacturer */}
								<div className="flex flex-col gap-2">
									<label className="text-white text-sm font-medium leading-normal" htmlFor="brand">
										Brand
									</label>
									<input
										className="w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-[#1b1b32] focus:border-primary h-12 px-4 text-base font-normal leading-normal transition-all duration-200"
										id="brand"
										placeholder="e.g. Sony"
										type="text"
										value={formData.brand}
										onChange={handleChange}
									/>
								</div>
							</div>

							{/* Right Column: Inventory Data */}
							<div className="flex flex-col gap-6">
								<h2 className="text-lg font-bold text-white border-b border-border-dark/50 pb-2">Inventory & Pricing</h2>
								<div className="grid grid-cols-2 gap-4">
									{/* Price */}
									<div className="flex flex-col gap-2">
										<label className="text-white text-sm font-medium leading-normal" htmlFor="price">
											Price (USD) <span className="text-red-500">*</span>
										</label>
										<div className="relative">
											<span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">$</span>
											<input
												className="w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-[#1b1b32] focus:border-primary h-12 pl-8 pr-4 text-base font-normal leading-normal transition-all duration-200"
												id="price"
												placeholder="0.00"
												step="0.01"
												type="number"
												min="0"
												value={formData.price}
												onChange={handleChange}
											/>
										</div>
									</div>
									{/* Stock */}
									<div className="flex flex-col gap-2">
										<label className="text-white text-sm font-medium leading-normal" htmlFor="stock">
											Stock Qty <span className="text-red-500">*</span>
										</label>
										<input
											className="w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-[#1b1b32] focus:border-primary h-12 px-4 text-base font-normal leading-normal transition-all duration-200"
											id="stock"
											placeholder="0"
											type="number"
											min="0"
											value={formData.stock}
											onChange={handleChange}
										/>
									</div>
								</div>
								{/* SKU Input */}
								<div className="flex flex-col gap-2">
									<label className="text-white text-sm font-medium leading-normal" htmlFor="sku">
										SKU (Stock Keeping Unit) <span className="text-red-500">*</span>
									</label>
									<input
										className="w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-[#1b1b32] focus:border-primary h-12 px-4 text-base font-normal leading-normal transition-all duration-200"
										id="sku"
										placeholder="PROD-00001"
										type="text"
										value={formData.sku}
										onChange={handleChange}
									/>
								</div>
							</div>
						</div>

						{/* Section 3: Media Upload */}
						<div className="flex flex-col gap-6">
							<h2 className="text-lg font-bold text-white border-b border-border-dark/50 pb-2">Product Media</h2>
							<div className="flex flex-col gap-4">
								<label className="text-white text-sm font-medium leading-normal">Product Images</label>

								{/* Drag & Drop Zone */}
								<div
									className={`group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer ${
										isDragging ? "border-primary bg-primary/10" : "border-border-dark bg-[#1b1b32]/30 hover:bg-[#1b1b32] hover:border-primary"
									}`}
									onDragOver={handleDragOver}
									onDragLeave={handleDragLeave}
									onDrop={handleDrop}
									onClick={() => fileInputRef.current?.click()}
								>
									<div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
										<div className={`mb-3 p-3 rounded-full transition-colors ${isDragging ? "bg-primary/20 text-primary" : "bg-[#1b1b32] text-primary"}`}>
											<span className="material-symbols-outlined text-3xl">cloud_upload</span>
										</div>
										<p className="mb-2 text-sm text-white font-medium">
											<span className="font-bold text-primary">Click to upload</span> or drag and drop
										</p>
										<p className="text-xs text-text-secondary">PNG, JPG, GIF, SVG or WebP (max. 5MB each)</p>
									</div>
									<input ref={fileInputRef} className="hidden" type="file" accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml,image/webp" multiple onChange={handleFileSelect} />
								</div>

								{/* Image Previews */}
								{imagePreviews.length > 0 && (
									<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-2">
										{imagePreviews.map((preview) => (
											<div key={preview.id} className="relative group aspect-square rounded-lg overflow-hidden border border-border-dark bg-black/20">
												<img alt="Product thumbnail" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={preview.displayUrl} />
												<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
													<a
														href={preview.displayUrl}
														target="_blank"
														rel="noopener noreferrer"
														onClick={(e) => e.stopPropagation()}
														className="p-1.5 bg-white/10 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-colors"
													>
														<span className="material-symbols-outlined text-sm">visibility</span>
													</a>
													<button
														type="button"
														onClick={(e) => {
															e.stopPropagation()
															removeImage(preview.id)
														}}
														className="p-1.5 bg-red-500/80 hover:bg-red-500 backdrop-blur-sm rounded-full text-white transition-colors"
													>
														<span className="material-symbols-outlined text-sm">delete</span>
													</button>
												</div>
												{preview.isExisting && <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white">Saved</div>}
											</div>
										))}
									</div>
								)}

								{/* Image count */}
								{imagePreviews.length > 0 && (
									<p className="text-xs text-text-secondary">
										{imagePreviews.length} image{imagePreviews.length !== 1 ? "s" : ""} selected
										{newFiles.length > 0 && ` (${newFiles.length} new)`}
									</p>
								)}
							</div>
						</div>

						{/* Action Bar */}
						<div className="flex items-center justify-end gap-4 mt-4 pt-6 border-t border-border-dark/50">
							<button
								type="button"
								onClick={onCancel}
								disabled={loading || uploadingImages}
								className="px-6 py-3 rounded-lg text-text-secondary hover:text-white font-medium text-sm transition-colors border border-transparent hover:border-border-dark disabled:opacity-50"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={loading || uploadingImages}
								className="px-8 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium text-sm shadow-lg shadow-primary/20 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading || uploadingImages ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
										{uploadingImages ? "Uploading images..." : "Saving..."}
									</>
								) : (
									<>
										<span className="material-symbols-outlined text-lg">save</span>
										{isEditing ? "Update Product" : "Save Product"}
									</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</main>
	)
}
