/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./lib/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				cardo: ["var(--font-cardo)", "serif"],
				sans: ["var(--font-josefin-sans)", "sans-serif"],
			},
			colors: {
				// 60% - White/light backgrounds
				"bg-primary": "#FFFFFF",
				"bg-secondary": "#F8F9FA",
				"bg-tertiary": "#F1F3F4",

				// 30% - Cambridge Blue for primary elements
				primary: "#73AB84",
				"primary-dark": "#5A8A6A",
				"primary-light": "#8BB894",

				// 10% - Accent colors
				"accent-celadon": "#99D19C",
				"accent-tiffany": "#79C7C5",
				"accent-nonphoto": "#ADE1E5",

				// Text colors
				"text-primary": "#000501",
				"text-secondary": "#374151",
				"text-muted": "#6B7280",
			},
		},
	},
	plugins: [],
}
