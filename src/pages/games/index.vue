<template>
    <div class="flex flex-wrap">
        <div
            v-for="game of games"
            :key="game.id"
            class="w-full md:w-1/2"
        >
            <div class="m-4 bg-gray-100 sh rounded-sm shadow-md px-3 py-2">
                <NuxtLink :to="`/games/${game.id}`">
                    <h2 class="text-2xl font-semibold" > {{ game.title }} </h2>
                    <div class="mt-3 mb-6">
                        <p
                            v-for="(diff, i) of game.difficulty"
                            :key="i"
                            class="my-1 mr-2 px-2 py-1 rounded-full text-sm capitalize inline shadow"
                            :class="diff"
                        >
                            {{ diff }}
                        </p>
                    </div>
                    <p>
                        {{ game.description }}
                    </p>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {
        const games = [
            {
                title: "Guess that pokemon",
                id: "guess-that-pokemon",
                description: 'The classic "Who is that Pokemon?"',
                difficulty: ["easy", "medium"]
            },
            {
                title: "Name all pokemon by Generations",
                id: "name-by-generation",
                description: "Kanto to Galar, Try your best to name them all by the region they originated from!",
                difficulty: ["medium", "hard"]
            },
            {
                title: "Name all pokemon by Types",
                id: "name-by-type",
                description: "Beautify fairy types or fierce dragon types, Try your best to name them all by the their types!",
                difficulty: ["medium", "hard"]
            }
        ]
        return {
            games
        }
    },
})
</script>

<style lang="postcss" scoped>
.easy {
    @apply bg-sky-300;
}
.medium {
    @apply bg-emerald-300;
}
.hard {
    @apply bg-red-300;
}
</style>