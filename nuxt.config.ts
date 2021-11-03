import { defineNuxtConfig } from "nuxt3";

export default defineNuxtConfig({
  dev: true,

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
