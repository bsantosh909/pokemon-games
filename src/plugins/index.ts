import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("normalizeName", (name: string) => {
    return (name ?? "").toLowerCase().replace(/-/g, " ");
  });
});

declare module "#app" {
  interface NuxtApp {
    $normalizeName(name: string): string;
  }
}
