/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				transparent: "transparent",
				current: "currentColor",
				white: "#ffffff",
				foreground: "rgba(var(--foreground) / <alpha-value>)",
				background: "rgba(var(--background) / <alpha-value>)",
				primary: {
					DEFAULT: "rgba(var(--primary) / <alpha-value>)",
					foreground: "rgba(var(--primary-foreground) / <alpha-value>)",
				},
				secondary: {
					DEFAULT: "rgba(var(--secondary) / <alpha-value>)",
					foreground: "rgba(var(--secondary-foreground) / <alpha-value>)",
				},
				muted: {
					DEFAULT: "rgba(var(--muted) / <alpha-value>)",
					foreground: "rgba(var(--muted-foreground) / <alpha-value>)",
				},
				accent: {
					DEFAULT: "rgba(var(--accent) / <alpha-value>)",
					foreground: "rgba(var(--accent-foreground) / <alpha-value>)",
				},
				popover: {
					DEFAULT: "rgba(var(--popover) / <alpha-value>)",
					foreground: "rgba(var(--popover-foreground) / <alpha-value>)",
				},
				destructive: {
					DEFAULT: "rgba(var(--destructive) / <alpha-value>)",
					destructive: "rgba(var(--destructive-foreground) / <alpha-value>)",
				},
				border: "rgba(var(--border) / <alpha-value>)",
				ring: "rgba(var(--ring) / <alpha-value>)",
				input: "rgba(var(--input) / <alpha-value>)",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
