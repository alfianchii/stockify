import { useState } from "react"

interface RegisterProps {
	onRegisterSuccess: () => void
	onNavigateToLogin: () => void
}

export const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onNavigateToLogin }) => {
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError("")

		if (password !== confirmPassword) {
			setError("Passwords do not match")
			setIsLoading(false)
			return
		}

		try {
			const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

			const response = await fetch(`${API_URL}/auth/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, email, password }),
			})

			const { token, data } = await response.json()
			if (!response.ok) {
				throw new Error(data.message || "Registration failed")
			}

			if (token) {
				localStorage.setItem("token", token)
				localStorage.setItem("user", JSON.stringify(data))
				onRegisterSuccess()
			} else {
				onNavigateToLogin()
			}
		} catch (error: any) {
			setError(error.message || "An error occured during registration")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased min-h-screen flex flex-col relative overflow-hidden bg-slate-900">
			{/* Abstract background pattern helper */}
			<div
				className="absolute inset-0 z-0 opacity-100 pointer-events-none"
				style={{
					backgroundColor: "#0F172A",
					backgroundImage: `radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
                radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), 
                radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)`,
				}}
			></div>

			{/* Abstract background elements for depth */}
			<div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
			<div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#6366F1]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

			<main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 w-full">
				{/* Registration Card */}
				<div className="w-full max-w-[520px] rounded-xl p-8 sm:p-10 flex flex-col gap-8 animate-fade-in-up border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)] bg-slate-800/70 backdrop-blur-xl">
					{/* Header */}
					<div className="flex flex-col gap-2 text-center">
						<h1 className="text-white text-3xl sm:text-4xl font-black tracking-tight">Create Account</h1>
						<p className="text-slate-400 text-base font-normal">Start managing your inventory today</p>
					</div>

					{/* Form */}
					<form className="flex flex-col gap-5" onSubmit={handleSubmit}>
						{/* Full Name */}
						<div className="flex flex-col gap-2">
							<label className="text-slate-200 text-sm font-medium" htmlFor="fullname">
								Full Name
							</label>
							<div className="relative">
								<input
									className="w-full rounded-lg bg-surface-dark/50 border border-slate-700/60 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder-slate-500 h-12 px-4 transition-all duration-200 outline-none"
									id="fullname"
									placeholder="e.g. John Doe"
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								/>
							</div>
						</div>

						{/* Email */}
						<div className="flex flex-col gap-2">
							<label className="text-slate-200 text-sm font-medium" htmlFor="email">
								Email Address
							</label>
							<div className="relative">
								<input
									className="w-full rounded-lg bg-surface-dark/50 border border-slate-700/60 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder-slate-500 h-12 px-4 transition-all duration-200 outline-none"
									id="email"
									placeholder="name@company.com"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
						</div>

						{/* Password */}
						<div className="flex flex-col gap-2">
							<label className="text-slate-200 text-sm font-medium" htmlFor="password">
								Password
							</label>
							<div className="relative flex items-center">
								<input
									className="w-full rounded-lg bg-surface-dark/50 border border-slate-700/60 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder-slate-500 h-12 px-4 pr-12 transition-all duration-200 outline-none"
									id="password"
									placeholder="••••••••"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
								<button className="absolute right-4 text-slate-500 hover:text-slate-300 focus:outline-none transition-colors" type="button" onClick={() => setShowPassword(!showPassword)}>
									<span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
								</button>
							</div>
						</div>

						{/* Confirm Password */}
						<div className="flex flex-col gap-2">
							<label className="text-slate-200 text-sm font-medium" htmlFor="confirm-password">
								Confirm Password
							</label>
							<div className="relative">
								<input
									className="w-full rounded-lg bg-surface-dark/50 border border-slate-700/60 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder-slate-500 h-12 px-4 transition-all duration-200 outline-none"
									id="confirm-password"
									placeholder="••••••••"
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
								/>
							</div>
						</div>

						{/* Error Message */}
						{error && <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">{error}</div>}

						{/* Submit Button */}
						<button
							disabled={isLoading}
							className="mt-4 w-full h-12 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg shadow-lg shadow-primary/20 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
							type="submit"
						>
							<span>{isLoading ? "creating Account..." : "Sign Up"}</span>
							{!isLoading && <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>}
						</button>
					</form>

					{/* Footer Link */}
					<div className="text-center pt-2">
						<p className="text-slate-400 text-sm">
							Already have an account?{" "}
							<a className="text-primary hover:text-primary-hover font-medium transition-colors hover:underline cursor-pointer" onClick={onNavigateToLogin}>
								Login
							</a>
						</p>
					</div>
				</div>
			</main>

			{/* Simple footer for credibility */}
			<footer className="absolute bottom-20 w-full text-center z-10 pointer-events-none">
				<p className="text-xs text-slate-600 dark:text-slate-500">© 2026 Stockify. All rights reserved.</p>
			</footer>
		</div>
	)
}
