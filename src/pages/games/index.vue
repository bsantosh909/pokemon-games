<template>
    <div>
        <div
            v-for="(game, i) of games"
            :key="i"
            class="rounded-sm bg-gray-100 shadow-md px-3 py-1"
        >
            <NuxtLink :to="game.url">
                <h2 class="text-xl font-semibold" > {{ game.title }} </h2>
            </NuxtLink>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {
        const games = [
            {
                title: "Name all pokemon by Generations",
                url: "/games/name-by-generation"
            }
        ]
        return {
            games
        }
    },
})
</script>
