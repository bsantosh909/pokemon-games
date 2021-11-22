<template>
  <div>
    <!-- Navbar -->
    <nav
      class="
        sticky
        top-0
        bg-gray-200
        shadow-sm
        py-2
        px-2
        lg:px-5
        flex flex-wrap
      "
    >
      <NuxtLink to="/">
        <p>Poké-Games</p>
      </NuxtLink>
      <div class="ml-auto">
        <NuxtLink to="/games"> Games </NuxtLink>
      </div>
    </nav>
    <!-- Pages -->
    <div class="container p-5">
      <slot />
    </div>
    <!-- Footer -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { createClient, provideClient } from "@urql/vue";

export default defineComponent({
  setup() {
    const client = createClient({
      url: "https://beta.pokeapi.co/graphql/v1beta",
    });
    provideClient(client);
  },
});
</script>
