<template>
  <div>
    <h1 class="text-emerald-500 text-3xl text-center mb-10">
      Guess that Pokedex description
    </h1>
    <div v-if="fetching !== false" class="text-center">
      Fetching data. Please wait!
    </div>
    <div v-else-if="error">
      {{ error }}
    </div>
    <div v-else class="bg-gray-200 pt-5 pb-2">
      <div align="center">
        <button
          v-if="isPlaying"
          class="px-2 py-1 rounded-sm shadow-sm bg-red-300"
          @click="stopGame"
        >
          Forefit
        </button>
        <button
          v-else
          class="px-2 py-1 rounded-sm shadow-md bg-green-300"
          :class="{ 'cursor-not-allowed': noMorePokemons }"
          @click="startGame"
          :disabled="noMorePokemons"
        >
          <span v-if="hasPlayed"> Next Pokemon </span>
          <span v-else> Start Game </span>
        </button>
      </div>
      <div class="flex justify-around my-5">
        <div>
          <span class="text-xl"> Guesses </span>
          <p>
            <span class="font-semibold">
              {{ correctGuess || (seenPokemons.length ? 0 : "-") }}
            </span>
            <span> / {{ seenPokemons.length || "-" }} </span>
          </p>
        </div>
        <p
          class="text-3xl font-semibold border-b border-emerald-300"
          :class="[
            gameTime < 5
              ? 'text-red-600'
              : gameTime < 10
              ? 'text-orange-500'
              : '',
            gameTime < 5 && gameTime > 0 ? 'animate-pulse' : '',
          ]"
        >
          {{ formattedTime }}
        </p>
      </div>
      <div class="flex justify-center my-5">
        <input
          type="text"
          name="pokemon-input"
          placeholder="Enter pokemon name"
          :disabled="!isPlaying && !hasPlayed"
          class="
            w-80
            border border-gray-400
            rounded-sm
            px-2
            py-1
            focus:outline-none
            placeholder-gray-600
          "
          :class="isPlaying ? 'bg-white' : 'bg-gray-100'"
          v-model="nameInput"
          @input="handleNameInput"
        />
      </div>
      <div v-if="isPlaying || hasPlayed" class="text-center text-xl my-16">
        <span>
          "{{
            activePokemonRandomDescription.description
              .replace(/\f/g, " ")
              .replace(/\n/g, " ")
          }}"
        </span>
      </div>
      <p v-if="hasPlayed && !isPlaying" class="mt-5 text-lg text-center">
        <span> The answer is </span>
        <span class="font-semibold capitalize">
          {{ activePokemon?.name }}!
        </span>
        <span class="italic block capitalize text-sm">
          The description is from Pokemon
          {{ activePokemonRandomDescription.game.name.replace("-", " ") }}!
        </span>
      </p>
      <p v-if="hasPlayed || isPlaying" class="text-xs italic ml-2">
        <span> * Press </span>
        <span class="font-semibold"> ESC </span>
        <span> to Stop current round or Start new round! </span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useQuery } from "@urql/vue";
import { useIntervalFn, onKeyStroke } from "@vueuse/core";

import { useNuxtApp } from "#app";

interface Pokemon {
  id: number;
  name: string;
  descriptions: {
    description: string;
    game: {
      name: string;
    };
  }[];
}

interface PokemonList {
  pokemons: Pokemon[];
}

export default defineComponent({
  async setup() {
    const nuxtApp = useNuxtApp();

    const result = await useQuery<PokemonList>({
      query: `
                {
                    pokemons: pokemon_v2_pokemonspecies {
                        name
                        id
                        descriptions: pokemon_v2_pokemonspeciesflavortexts(where: {language_id: {_eq: 9}}) {
                            description: flavor_text
                            game: pokemon_v2_version {
                                name
                            }
                        }
                    }
                }
            `,
    });

    const gameTime = ref(120);

    const formattedTime = computed(() => {
      const min = Math.floor(gameTime.value / 60);
      const sec = gameTime.value % 60;
      return `${min}:${sec < 10 ? `0${sec}` : sec}`;
    });

    const seenPokemons = ref<number[]>([]);
    const activePokemon = ref<Pokemon>();

    const correctGuess = ref(0);

    const isPlaying = ref(false);
    const hasPlayed = ref(false);
    const nameInput = ref("");

    const noMorePokemons = computed(
      () => seenPokemons.value.length >= result.data.value?.pokemons.length!
    );

    const activePokemonRandomDescription = computed(() => {
      const list = activePokemon.value?.descriptions!.filter(
        (desc) =>
          !desc.description
            .toLowerCase()
            .includes(activePokemon.value?.name.toLowerCase()!)
      )!;
      return list[Math.floor(Math.random() * list.length)];
    });

    const getPokemon = () => {
      const list = result.data.value?.pokemons.filter(
        (poke) => !seenPokemons.value.includes(poke.id)
      )!;
      const nextPokemon = list[Math.floor(Math.random() * list.length)];
      activePokemon.value = nextPokemon;
    };

    const guessPokemon = (name: string) => {
      return (
        nuxtApp.$normalizeName(activePokemon.value?.name!) ===
        nuxtApp.$normalizeName(name)
      );
    };

    const game = useIntervalFn(
      () => {
        gameTime.value -= 1;
        if (gameTime.value <= 0) stopGame();
      },
      1000,
      { immediate: false }
    );

    const startGame = () => {
      gameTime.value = 120;
      isPlaying.value = true;
      game.resume();
      getPokemon();
    };

    const stopGame = () => {
      game.pause();
      seenPokemons.value.push(activePokemon.value?.id!);
      nameInput.value = "";
      isPlaying.value = false;
      hasPlayed.value = true;
    };

    const handleNameInput = () => {
      if (!isPlaying.value) return;
      if (
        nuxtApp.$normalizeName(nameInput.value) ===
        nuxtApp.$normalizeName(activePokemon.value?.name!)
      ) {
        correctGuess.value += 1;
        stopGame();
      }
    };

    onKeyStroke("Escape", () => {
      if (isPlaying.value) stopGame();
      else if (hasPlayed.value) startGame();
    });

    return {
      // API response
      fetching: result.fetching,
      error: result.error,
      // Page related data
      seenPokemons,
      activePokemon,
      activePokemonRandomDescription,
      nameInput,
      getPokemon,
      guessPokemon,
      handleNameInput,
      startGame,
      stopGame,
      // IDK
      gameTime,
      formattedTime,
      correctGuess,
      isPlaying,
      hasPlayed,
      noMorePokemons,
    };
  },
});
</script>
