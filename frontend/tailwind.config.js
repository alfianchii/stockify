/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				primary: "#6366F1",
				"background-light": "#f6f6f8",
				"background-dark": "#0F172A",
				"surface-dark": "#1E293B",
				"card-dark": "#1a1a2e",
				"input-dark": "#1b1b32",
				"sidebar-bg": "#121221",
				"border-color": "#262546",
				"border-dark": "#363663",
				"text-muted": "#9695c6",
				"text-secondary": "#9695c6",
			},
			fontFamily: {
				display: ["Inter", "sans-serif"],
			},
			borderRadius: {
				DEFAULT: "0.25rem",
				lg: "0.5rem",
				xl: "0.75rem",
				full: "9999px",
			},
		},
	},
	plugins: [],
}
