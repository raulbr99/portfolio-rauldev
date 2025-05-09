import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind(), robotsTxt(), sitemap(), react()],
	site: "https://rauldev.dev/",
	output: "server",
	adapter: vercel({
		webAnalytics: {
			enabled: true,
		},
	}),
	vite: {
		resolve: {
			alias: {
				"@": "/src",
			},
		},
	},
	i18n: {
		locales: ["en", "es"],
		defaultLocale: "es",
	},
});
