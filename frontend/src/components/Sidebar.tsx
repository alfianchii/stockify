interface SidebarProps {
	activeTab: "dashboard" | "inventory"
	onTabChange: (tab: "dashboard" | "inventory") => void
	userName: string
	onLogout: () => void
}

export const Sidebar = ({ activeTab, onTabChange, userName, onLogout }: SidebarProps) => {
	return (
		<aside className="hidden md:flex flex-col w-64 h-full bg-[#121221] border-r border-[#262546]">
			{/* Brand */}
			<div className="p-6 flex items-center gap-3">
				<div className="size-8 rounded-lg bg-primary flex items-center justify-center">
					<span className="material-symbols-outlined text-white" style={{ fontSize: "20px" }}>
						inventory_2
					</span>
				</div>
				<h1 className="text-xl font-bold tracking-tight text-white">Stockify</h1>
			</div>

			{/* Navigation */}
			<div className="flex flex-col gap-2 px-4 py-2 flex-1">
				<button
					onClick={() => onTabChange("dashboard")}
					className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-colors group ${activeTab === "dashboard" ? "bg-[#262546] text-white shadow-sm" : "text-[#9695c6] hover:bg-[#262546] hover:text-white"}`}
				>
					<span
						className={`material-symbols-outlined ${activeTab === "dashboard" ? "text-primary fill-1" : "text-[#9695c6] group-hover:text-white"}`}
						style={activeTab === "dashboard" ? { fontVariationSettings: "'FILL' 1" } : {}}
					>
						dashboard
					</span>
					<span className="text-sm font-medium">Dashboard</span>
				</button>
				<button
					onClick={() => onTabChange("inventory")}
					className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-colors group ${activeTab === "inventory" ? "bg-[#262546] text-white shadow-sm" : "text-[#9695c6] hover:bg-[#262546] hover:text-white"}`}
				>
					<span
						className={`material-symbols-outlined ${activeTab === "inventory" ? "text-primary fill-1" : "text-[#9695c6] group-hover:text-white"}`}
						style={activeTab === "inventory" ? { fontVariationSettings: "'FILL' 1" } : {}}
					>
						inventory_2
					</span>
					<span className="text-sm font-medium">Inventory</span>
				</button>
			</div>

			{/* User Footer */}
			<div className="p-4 border-t border-[#262546]">
				<div className="flex items-center gap-3 px-3 py-2 rounded-lg">
					<div className="bg-primary/20 rounded-full size-9 border border-[#363663] flex items-center justify-center">
						<span className="material-symbols-outlined text-primary text-lg">person</span>
					</div>
					<div className="flex flex-col flex-1">
						<p className="text-white text-sm font-medium">{userName}</p>
						<p className="text-[#9695c6] text-xs">Admin</p>
					</div>
					<button onClick={onLogout} className="text-[#9695c6] hover:text-red-400 transition-colors p-1" title="Logout">
						<span className="material-symbols-outlined text-lg">logout</span>
					</button>
				</div>
			</div>
		</aside>
	)
}
