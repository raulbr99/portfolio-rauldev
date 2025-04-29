/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	darkMode: "class",
	theme: {
		extend: {
			animation: {
				carousel: "carousel 20s linear infinite",
			},
			keyframes: {
				carousel: {
					"0%": { transform: "translateX(0)" },
					"100%": {
						transform:
							"translateX(calc(-100% / var(--slides) * var(--slides-to-scroll)))",
					},
				},
			},
		},
	},
	plugins: [],
};
