import React, { useState } from "react"

interface LoginProps {
	onLoginSuccess: () => void
	onNavigateToRegister: () => void
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigateToRegister }) => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError("")

		try {
			const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

			const response = await fetch(`${API_URL}/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			})

			const { token, data } = await response.json()
			if (!response.ok) {
				throw new Error(data.message || "Login failed")
			}

			localStorage.setItem("token", token)
			localStorage.setItem("user", data)

			onLoginSuccess()
		} catch (error: any) {
			setError(error.message || "An error occurred during login")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background-light dark:bg-background-dark overflow-x-hidden font-display text-white selection:bg-primary selection:text-white">
			{/* Background */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
				<div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen"></div>
				<div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
			</div>

			{/* Main */}
			<div className="relative flex flex-col w-full max-w-[440px] z-10 animate-fade-in-up">
				{/* Glass Card */}
				<div className="rounded-2xl p-8 sm:p-10 flex flex-col gap-6 w-full border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] bg-slate-800/60 backdrop-blux-xl">
					{/* Header */}
					<div className="flex flex-col gap-2 text-center mb-2">
						<div className="flex justify-center items-center gap-2 mb-2">
							<span className="text-4xl">💥</span>
						</div>
						<h1 className="text-white tracking-light text-2xl font-bold leading-tight">STOCKIFY</h1>
						<p className="text-slate-400 text-sm font-normal leading-normal">Welcome back! Please enter your details.</p>
					</div>

					{/* Form */}
					<form className="flex flex-col gap-5" onSubmit={handleSubmit}>
						{/* Email */}
						<label className="flex flex-col gap-2">
							<span className="text-slate-200 text-sm font-medium leading-normal">Email Address</span>
							<div className="relative group">
								<div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500">
									<span className="material-symbols-outlined text-[20px]">mail</span>
								</div>
								<input
									className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white bg-[#1E293B] border border-slate-700/50 focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-11 pr-4 text-sm font-normal leading-normal placeholder:text-slate-500 transition-all duration-200 ease-in-out hover:border-slate-600 outline-none"
									placeholder="alfian@gmail.com"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
						</label>

						{/* Password */}
						<label className="flex flex-col gap-2">
							<span className="text-slate-200 text-sm font-medium leading-normal">Password</span>
							<div className="relative group flex w-full items-stretch rounded-lg">
								<div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500">
									<span className="material-symbols-outlined text-[20px]">lock</span>
								</div>
								<input
									className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white bg-[#1E293B] border border-slate-700/50 focus:border-primary focus:ring-1 focus:ring-primary h-10 pl-9 pr-8 text-sm font-normal leading-normal placeholder:text-slate-500 transition-all duration-200 ease-in-out hover:border-slate-600 rounded-r-none border-r-0 outline-none"
									placeholder="••••••••"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="flex items-center justify-center pr-4 pl-2 bg-[#1E293B] border-y border-r border-slate-700/50 rounded-r-lg cursor-pointer text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
								>
									<span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
								</button>
							</div>
						</label>

						{/* Error */}
						{error && <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">{error}</div>}

						{/* Submit */}
						<button
							disabled={isLoading}
							className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-indigo-500 text-white text-base font-bold leading-normal tracking-[0.015em] transition-all duration-200 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<span className="truncate">{isLoading ? "Signing In..." : "Sign In"}</span>
						</button>
					</form>

					{/* Sign Up */}
					<div className="text-center pt-2">
						<p className="text-slate-400 text-sm">
							Don't have an account?{" "}
							<a className="text-primary font-medium hover:text-indigo-400 transitions-colors cursor-pointer" onClick={onNavigateToRegister}>
								Sign Up
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
