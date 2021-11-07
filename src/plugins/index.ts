import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("normalizeName", (name: string) => {
    return (
      (name ?? "")
        .toLowerCase()
        // replacing most of the space breakers
        .replace(/-/g, " ")
        // Nidoran m,f
        // .replace(/ (m|f)$/g, "")
        // wormadam
        .replace(/ plant$/g, "")
        // Giratina
        .replace(/ altered$/g, "")
        // Thundurs, Tornadus, Landorus
        .replace(/ incarnate$/g, "")
        // Toxricity
        .replace(/ amped$/g, "")
        // Mimikyu
        .replace(/ disguised$/g, "")
        // Keldeo
        .replace(/ ordinary$/g, "")
        // Zacian, Zamazenta
        .replace(/ hero$/g, "")
        // Darminatan
        .replace(/ standard$/g, "")
        // minior
        .replace(/ red metwor$/g, "")
        // Pumpkaboo, gourgeist
        .replace(/ average$/, "")
        // Aegislash
        .replace(/ shield$/, "")
        // Shaymin
        .replace(/ lang$/, "")
        // Indeedee
        .replace(/ male$/, "")
        // Deoxys
        .replace(/ normal$/, "")
        // Lycanroc
        .replace(/ midday$/, "")
        // Wishiwashi
        .replace(/ solo$/, "")
        // Basculin
        .replace(/ red striped$/, "")
    );
  });
});

declare module "#app" {
  interface NuxtApp {
    $normalizeName(name: string): string;
  }
}
