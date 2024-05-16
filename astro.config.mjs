import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import vercel from '@astrojs/vercel/serverless';
import robotsTxt from "astro-robots-txt";
import sitemap from '@astrojs/sitemap';


// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), robotsTxt(), sitemap()],
  site: 'https://porfolio-rauldev99.vercel.app/',
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  })
});
