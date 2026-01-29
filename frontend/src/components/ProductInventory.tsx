import { useState, useEffect } from "react"
import { productApi, Product, getImageUrl } from "../api/productApi"

export const ProductInventory = ({ onAddProduct, onEditProduct }: { onAddProduct: () => void; onEditProduct?: (product: Product) => void }) => {
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [searchTerm, setSearchTerm] = useState("")
	const [selectedCategory, setSelectedCategory] = useState("All Categories")
	const [currentPage, setCurrentPage] = useState(1)
	const [pagination, setPagination] = useState({ total: 0, pages: 1 })
	const limit = 10

	const fetchProducts = async () => {
		try {
			setLoading(true)
			setError(null)
			const response = await productApi.getAll({
				page: currentPage,
				limit,
				search: searchTerm || undefined,
				category: selectedCategory !== "All Categories" ? selectedCategory : undefined,
			})
			setProducts(response.data)
			setPagination({ total: response.pagination.total, pages: response.pagination.pages })
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch products")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchProducts()
	}, [currentPage, selectedCategory])

	useEffect(() => {
		const timer = setTimeout(() => {
			setCurrentPage(1)
			fetchProducts()
		}, 300)
		return () => clearTimeout(timer)
	}, [searchTerm])

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this product?")) return

		try {
			await productApi.delete(id)
			fetchProducts()
		} catch (err) {
			alert(err instanceof Error ? err.message : "Failed to delete product")
		}
	}

	const getStockStatus = (stock: number) => {
		if (stock === 0) return { color: "bg-red-500", textColor: "text-red-400", label: "Out of stock" }
		if (stock <= 5) return { color: "bg-amber-500", textColor: "text-amber-400", label: `${stock} in stock` }
		return { color: "bg-emerald-500", textColor: "text-emerald-400", label: `${stock} in stock` }
	}

	return (
		<main className="flex-1 flex flex-col h-full overflow-hidden relative">
			{/* Header & Toolbar Section */}
			<div className="flex flex-col p-6 gap-6 bg-background-dark border-b border-[#262546]">
				{/* Breadcrumb / Title */}
				<div className="flex justify-between items-end">
					<div className="flex flex-col gap-1">
						<h2 className="text-3xl font-black text-white tracking-tight">Products</h2>
						<p className="text-[#9695c6] text-sm">Manage your product catalog and stock levels.</p>
					</div>
				</div>

				{/* Toolbar */}
				<div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
					<div className="flex flex-1 gap-4 flex-col sm:flex-row">
						{/* Search */}
						<div className="relative group min-w-[280px]">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<span className="material-symbols-outlined text-[#9695c6] group-focus-within:text-primary transition-colors">search</span>
							</div>
							<input
								className="block w-full pl-10 pr-3 py-2.5 bg-[#1b1b32] border border-[#363663] rounded-lg leading-5 text-white placeholder-[#9695c6] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all shadow-sm"
								placeholder="Search products..."
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>

						{/* Filter */}
						<div className="relative min-w-[180px]">
							<select
								className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg bg-[#1b1b32] border border-[#363663] text-white appearance-none cursor-pointer"
								value={selectedCategory}
								onChange={(e) => {
									setSelectedCategory(e.target.value)
									setCurrentPage(1)
								}}
							>
								<option>All Categories</option>
								<option>Electronics</option>
								<option>Accessories</option>
								<option>Wearables</option>
								<option>Furniture</option>
								<option>Stationery</option>
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#9695c6]">
								<span className="material-symbols-outlined">expand_more</span>
							</div>
						</div>
					</div>

					{/* Add Button */}
					<button
						onClick={onAddProduct}
						className="flex items-center justify-center gap-2 bg-primary hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-95 whitespace-nowrap"
					>
						<span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
							add
						</span>
						Add Product
					</button>
				</div>
			</div>

			{/* Table Container */}
			<div className="flex-1 overflow-auto p-6 @container">
				{loading ? (
					<div className="flex items-center justify-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
					</div>
				) : error ? (
					<div className="flex flex-col items-center justify-center h-64 gap-4">
						<span className="material-symbols-outlined text-5xl text-red-400">error</span>
						<p className="text-red-400">{error}</p>
						<button onClick={fetchProducts} className="text-primary hover:underline">
							Try again
						</button>
					</div>
				) : products.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-64 gap-4">
						<span className="material-symbols-outlined text-5xl text-[#9695c6]">inventory_2</span>
						<p className="text-[#9695c6]">No products found</p>
					</div>
				) : (
					<div className="min-w-full inline-block align-middle">
						<div className="border border-[#363663] rounded-xl overflow-hidden bg-background-dark">
							<table className="min-w-full divide-y divide-[#363663]">
								<thead className="bg-[#1b1b32]">
									<tr>
										<th className="px-6 py-4 text-left text-xs font-semibold text-[#9695c6] uppercase tracking-wider w-20" scope="col">
											Image
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold text-[#9695c6] uppercase tracking-wider" scope="col">
											Name
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold text-[#9695c6] uppercase tracking-wider" scope="col">
											Category
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold text-[#9695c6] uppercase tracking-wider" scope="col">
											Price
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold text-[#9695c6] uppercase tracking-wider" scope="col">
											Stock
										</th>
										<th className="px-6 py-4 text-right text-xs font-semibold text-[#9695c6] uppercase tracking-wider" scope="col">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-[#363663] bg-[#1E293B]">
									{products.map((product) => {
										const stockStatus = getStockStatus(product.stock)
										return (
											<tr key={product._id} className="hover:bg-[#334155] transition-colors group">
												<td className="px-6 py-4 whitespace-nowrap">
													<div
														className="h-10 w-10 rounded-lg bg-center bg-cover border border-[#363663] bg-[#1b1b32]"
														style={{
															backgroundImage: product.images[0] ? `url('${getImageUrl(product.images[0])}')` : undefined,
														}}
													>
														{!product.images[0] && (
															<div className="h-full w-full flex items-center justify-center">
																<span className="material-symbols-outlined text-[#9695c6] text-lg">image</span>
															</div>
														)}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex flex-col">
														<span className="text-sm font-medium text-white">{product.name}</span>
														<span className="text-xs text-[#9695c6]">SKU: {product.sku}</span>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className="px-2.5 py-1 text-xs font-medium rounded-full bg-[#363663]/50 text-[#9695c6] border border-[#363663]">{product.category}</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">${product.price.toFixed(2)}</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center gap-2">
														<span className={`h-2 w-2 rounded-full ${stockStatus.color}`}></span>
														<span className={`text-sm ${stockStatus.textColor} font-medium`}>{stockStatus.label}</span>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
													<div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
														<button onClick={() => onEditProduct?.(product)} className="p-1.5 rounded-md hover:bg-[#363663] text-[#9695c6] hover:text-white transition-colors">
															<span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
																edit
															</span>
														</button>
														<button onClick={() => handleDelete(product._id)} className="p-1.5 rounded-md hover:bg-red-500/20 text-[#9695c6] hover:text-red-400 transition-colors">
															<span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
																delete
															</span>
														</button>
													</div>
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>

			{/* Pagination Footer */}
			{!loading && !error && products.length > 0 && (
				<div className="bg-background-dark px-6 py-4 border-t border-[#262546] flex items-center justify-between">
					<p className="text-sm text-[#9695c6]">
						Showing <span className="font-medium text-white">{(currentPage - 1) * limit + 1}</span> to <span className="font-medium text-white">{Math.min(currentPage * limit, pagination.total)}</span>{" "}
						of <span className="font-medium text-white">{pagination.total}</span> results
					</p>
					<div className="flex items-center gap-2">
						<button
							onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
							disabled={currentPage === 1}
							className="p-2 rounded-lg border border-[#363663] text-[#9695c6] hover:bg-[#262546] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							<span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
								chevron_left
							</span>
						</button>
						<div className="flex items-center gap-1">
							{Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
								let pageNum: number
								if (pagination.pages <= 5) {
									pageNum = i + 1
								} else if (currentPage <= 3) {
									pageNum = i + 1
								} else if (currentPage >= pagination.pages - 2) {
									pageNum = pagination.pages - 4 + i
								} else {
									pageNum = currentPage - 2 + i
								}
								return (
									<button
										key={pageNum}
										onClick={() => setCurrentPage(pageNum)}
										className={`h-8 w-8 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
											currentPage === pageNum ? "bg-primary text-white" : "hover:bg-[#262546] text-[#9695c6] hover:text-white"
										}`}
									>
										{pageNum}
									</button>
								)
							})}
							{pagination.pages > 5 && currentPage < pagination.pages - 2 && (
								<>
									<span className="text-[#9695c6] px-1">...</span>
									<button
										onClick={() => setCurrentPage(pagination.pages)}
										className="h-8 w-8 rounded-lg hover:bg-[#262546] text-[#9695c6] hover:text-white text-sm font-medium flex items-center justify-center transition-colors"
									>
										{pagination.pages}
									</button>
								</>
							)}
						</div>
						<button
							onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))}
							disabled={currentPage === pagination.pages}
							className="p-2 rounded-lg border border-[#363663] text-[#9695c6] hover:bg-[#262546] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							<span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
								chevron_right
							</span>
						</button>
					</div>
				</div>
			)}
		</main>
	)
}
