import { defineNuxtConfig } from "nuxt3";

export default defineNuxtConfig({
  srcDir: "src/",

  css: ["~/assets/css/tailwind.css"],

  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
  },
});
