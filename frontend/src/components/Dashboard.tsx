import { useState, useEffect } from "react"
import { productApi, ProductStats, Product, getImageUrl } from "../api/productApi"

interface DashboardProps {
	userName: string
}

export const Dashboard = ({ userName }: DashboardProps) => {
	const [stats, setStats] = useState<ProductStats | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchStats = async () => {
		try {
			setLoading(true)
			setError(null)
			const response = await productApi.getStats()
			setStats(response.data)
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch statistics")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchStats()
	}, [])

	return (
		<main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
			{/* Top Header */}
			<header className="flex-shrink-0 flex items-center justify-between border-b border-[#262546] bg-[#111121] px-8 py-4 z-10">
				<div className="flex items-center gap-4">
					<button className="md:hidden text-[#9695c6]">
						<span className="material-symbols-outlined">menu</span>
					</button>
					<h2 className="text-white text-xl font-bold leading-tight tracking-tight">Dashboard</h2>
				</div>
				<div className="flex items-center gap-6">
					<div className="relative hidden sm:block">
						<span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#9695c6] text-[20px]">search</span>
						<input
							className="bg-[#1b1b32] border-none rounded-full py-2 pl-10 pr-4 text-sm text-[#9695c6] focus:ring-2 focus:ring-primary w-64 placeholder-[#9695c6]"
							placeholder="Search..."
							type="text"
						/>
					</div>
					<div className="flex items-center gap-3 border-l border-[#262546] pl-6">
						<div className="flex flex-col items-end hidden sm:flex">
							<span className="text-sm font-bold text-white">{userName}</span>
							<span className="text-xs text-[#9695c6]">Admin</span>
						</div>
						<div
							className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-[#363663] shadow-sm cursor-pointer"
							data-alt={`User profile portrait of ${userName}`}
							style={{
								backgroundImage:
									'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCVJC1-wiS4OnK9fT4Z7YIhrrNn2rJRsTjvu3sc5ojLaOH1DIo7ZE52xHbvAy2DRgLws6VmH5YnVlKsfzIT4312ZkiOHbicsNiAU33icdHz5Z5JtRTc2cP0AhrWAb2sYu0jFTtpWH1Wc0yErnG5tMfTyVJgsfGYrVAySDOxvGuQ_ty0ONQAXm1mbcRKFxiPvuqzeYVnGm-M8usdDkFbGJL8SAPR8suMl2ZhKLGZwOwJKQmSodzAaKjamNZjw3YAd3IVzWKnHYhPUMQ")',
							}}
						></div>
					</div>
				</div>
			</header>

			{/* Scrollable Content */}
			<div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
				{loading ? (
					<div className="flex items-center justify-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
					</div>
				) : error ? (
					<div className="flex flex-col items-center justify-center h-64 gap-4">
						<span className="material-symbols-outlined text-5xl text-red-400">error</span>
						<p className="text-red-400">{error}</p>
						<button onClick={fetchStats} className="text-primary hover:underline">
							Try again
						</button>
					</div>
				) : (
					<>
						{/* Stats Section */}
						<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{/* Stat Card 1 */}
							<div className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-indigo-600 to-primary shadow-lg shadow-indigo-500/20 group hover:scale-[1.02] transition-transform duration-300">
								<div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
									<span className="material-symbols-outlined text-6xl text-white">inventory_2</span>
								</div>
								<div className="flex flex-col gap-1 relative z-10">
									<p className="text-indigo-100 text-sm font-medium">Total Products</p>
									<h3 className="text-white text-3xl font-bold tracking-tight">{stats?.totalProducts.toLocaleString() || 0}</h3>
									<p className="text-indigo-200 text-xs mt-2 flex items-center gap-1">
										<span className="bg-white/20 rounded px-1.5 py-0.5 text-white font-semibold">{stats?.productsByCategory?.length || 0} categories</span>
									</p>
								</div>
							</div>
							{/* Stat Card 2 */}
							<div className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-orange-500/20 group hover:scale-[1.02] transition-transform duration-300">
								<div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
									<span className="material-symbols-outlined text-6xl text-white">warning</span>
								</div>
								<div className="flex flex-col gap-1 relative z-10">
									<p className="text-orange-100 text-sm font-medium">Low Stock Alerts</p>
									<h3 className="text-white text-3xl font-bold tracking-tight">{stats?.lowStockAlerts || 0}</h3>
									<p className="text-orange-100 text-xs mt-2 flex items-center gap-1">
										<span className="bg-white/20 rounded px-1.5 py-0.5 text-white font-semibold">{stats?.outOfStockCount || 0} out of stock</span>
									</p>
								</div>
							</div>
							{/* Stat Card 3 */}
							<div className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-teal-500/20 group hover:scale-[1.02] transition-transform duration-300">
								<div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
									<span className="material-symbols-outlined text-6xl text-white">new_releases</span>
								</div>
								<div className="flex flex-col gap-1 relative z-10">
									<p className="text-emerald-100 text-sm font-medium">New Today</p>
									<h3 className="text-white text-3xl font-bold tracking-tight">{stats?.newToday || 0}</h3>
									<p className="text-emerald-100 text-xs mt-2 flex items-center gap-1">
										<span className="bg-white/20 rounded px-1.5 py-0.5 text-white font-semibold">Added today</span>
									</p>
								</div>
							</div>
						</section>

						{/* Content Grid */}
						<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
							{/* Recent Products Panel */}
							<div className="xl:col-span-2 flex flex-col bg-[#1E293B] rounded-xl border border-[#262546] shadow-sm overflow-hidden">
								<div className="flex items-center justify-between px-6 py-4 border-b border-[#262546]">
									<h3 className="text-white font-bold text-lg">Recent Products</h3>
									<button className="text-primary hover:text-primary/80 text-sm font-medium">View All</button>
								</div>
								<div className="overflow-x-auto">
									<table className="w-full text-left border-collapse">
										<thead>
											<tr className="bg-[#1b1b32] text-xs uppercase tracking-wider text-[#9695c6] font-semibold border-b border-[#262546]">
												<th className="px-6 py-4 w-16">Image</th>
												<th className="px-6 py-4">Name</th>
												<th className="px-6 py-4">Category</th>
												<th className="px-6 py-4">Price</th>
												<th className="px-6 py-4 text-center">Status</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-[#262546]">
											{stats?.recentProducts?.length === 0 ? (
												<tr>
													<td colSpan={5} className="px-6 py-8 text-center text-[#9695c6]">
														No products yet
													</td>
												</tr>
											) : (
												stats?.recentProducts?.map((product: Product) => (
													<tr key={product._id} className="hover:bg-[#262546] transition-colors group">
														<td className="px-6 py-3">
															<div
																className="bg-[#1b1b32] rounded-lg h-10 w-10 bg-cover bg-center"
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
														<td className="px-6 py-3">
															<p className="text-white text-sm font-medium">{product.name}</p>
															<p className="text-[#9695c6] text-xs">SKU: {product.sku}</p>
														</td>
														<td className="px-6 py-3 text-[#9695c6] text-sm">{product.category}</td>
														<td className="px-6 py-3 text-gray-200 text-sm font-medium">${product.price.toFixed(2)}</td>
														<td className="px-6 py-3 text-center">
															<span
																className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
																	product.status === "active" ? "bg-emerald-500/20 text-emerald-400" : product.status === "out-of-stock" ? "bg-red-500/20 text-red-400" : "bg-slate-700 text-slate-300"
																}`}
															>
																{product.status === "out-of-stock" ? "Out of Stock" : product.status.charAt(0).toUpperCase() + product.status.slice(1)}
															</span>
														</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</div>

							{/* Low Stock Alert Panel */}
							<div className="xl:col-span-1 flex flex-col bg-[#1E293B] rounded-xl border border-[#262546] shadow-sm">
								<div className="flex items-center justify-between px-6 py-4 border-b border-[#262546]">
									<div className="flex items-center gap-2">
										<span className="material-symbols-outlined text-warning">warning</span>
										<h3 className="text-white font-bold text-lg">Low Stock Alerts</h3>
									</div>
								</div>
								<div className="flex-1 flex flex-col divide-y divide-[#262546] overflow-y-auto max-h-[400px]">
									{stats?.lowStockProducts?.length === 0 ? (
										<div className="flex flex-col items-center justify-center py-12 text-[#9695c6]">
											<span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
											<p>All products are well stocked!</p>
										</div>
									) : (
										stats?.lowStockProducts?.map((product) => (
											<div key={product.sku} className="p-4 flex items-center justify-between hover:bg-[#262546] transition-colors">
												<div className="flex items-center gap-3">
													<div className="h-10 w-10 rounded bg-[#1b1b32] flex items-center justify-center shrink-0">
														<span className="material-symbols-outlined text-slate-400 text-xl">inventory_2</span>
													</div>
													<div>
														<p className="text-white text-sm font-medium">{product.name}</p>
														<p className="text-[#9695c6] text-xs">SKU: {product.sku}</p>
													</div>
												</div>
												<div className="flex flex-col items-end gap-1">
													<span className="px-2 py-1 rounded bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-bold border border-[#F59E0B]/20">Qty: {product.stock}</span>
													<button className="text-primary text-xs font-medium hover:underline">Restock</button>
												</div>
											</div>
										))
									)}
								</div>
								<div className="p-4 border-t border-[#262546] bg-[#182335]">
									<button className="w-full py-2 border border-[#363663] rounded-lg text-sm font-medium text-slate-300 hover:bg-[#262546] transition-colors">View All Alerts</button>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</main>
	)
}
