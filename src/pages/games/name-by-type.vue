<template>
  <div>
    <h1 class="text-emerald-500 text-3xl text-center mb-10">
      Name Pokemon by Types
    </h1>
    <div v-if="fetching !== false" class="text-center">
      Fetching data. Please wait!
    </div>
    <div v-else-if="error">
      {{ error }}
    </div>
    <div v-else>
      <div class="flex flex-wrap justify-center select-none">
        <button
          v-for="type in types.sort()"
          :key="type"
          class="
            rounded-full
            px-3
            py-1
            cursor-pointer
            m-2
            shadow-md
            border-2
            flex
          "
          :class="[
            isPlaying && activeType !== type ? ' blur-sm' : '',
            activeType === type ? 'border-black' : 'border-white',
            type,
          ]"
          :disabled="isPlaying"
          @click="changeType(type)"
        >
          <img
            :src="`/images/types/${type}.svg`"
            :alt="`Type ${type}`"
            class="w-6 h-6"
          />
          <span class="ml-2 capitalize text-gray-200 text-with-shadow">
            {{ type }} Type
          </span>
        </button>
      </div>
      <div v-if="activeType === ''" class="mt-10">
        <p class="text-2xl text-center italic">
          Select from above and start playing!
        </p>
      </div>
      <div v-else class="bg-gray-100 p-3 mt-10">
        <!-- Section to show game related info -->
        <div class="sticky top-10 bg-gray-100 py-1">
          <div>
            <h3 class="text-center text-2xl font-semibold capitalize">
              {{ activeType }} Type
            </h3>
          </div>
          <div class="flex justify-around">
            <p class="my-auto">
              <span class="text-lg border-b border-red-300">
                <span class="font-semibold"> {{ pokemonList?.length }} </span>
                <span> Pokemons </span>
              </span>
              <span v-if="isPlaying || hasPlayed" class="text-sm">
                ({{ foundList.length }} guessed)
              </span>
            </p>
            <p
              class="text-3xl font-semibold border-b border-emerald-300"
              :class="
                foundList.length === pokemonList?.length
                  ? 'text-blue-600'
                  : gameTime < 60
                  ? 'text-red-600'
                  : gameTime < 180
                  ? 'text-orange-500'
                  : ''
              "
            >
              {{ formattedTime }}
            </p>
          </div>
          <div class="flex justify-center my-6">
            <input
              type="text"
              name="pokemon-input"
              placeholder="Enter pokemon name"
              :disabled="!isPlaying"
              class="
                w-80
                border border-gray-400
                rounded-sm
                px-2
                py-1
                focus:outline-none
                placeholder-gray-500
              "
              :class="isPlaying ? 'bg-white' : 'bg-gray-100'"
              v-model="nameInput"
              @input="handleNameInput"
            />
          </div>
          <p v-if="hasCompleted" class="mt-5 mb-2 text-center">
            🎉 You Successfully completed the challenge !!! 🎉
          </p>
        </div>
        <!-- Start/Stop game -->
        <div class="my-5" align="center">
          <button
            v-if="isPlaying && foundList.length !== pokemonList?.length"
            @click="stopGame()"
            class="bg-red-300 px-2 py-1"
          >
            Forefit
          </button>
          <button v-else @click="startGame()" class="bg-green-300 px-2 py-1">
            <span v-if="!hasPlayed"> Start Playing </span>
            <span v-else> Play Again </span>
          </button>
        </div>
        <!-- Pokemon lists -->
        <div
          v-if="isPlaying || hasPlayed"
          class="flex flex-wrap justify-center text-sm"
        >
          <div
            v-for="(pokemon, i) of pokemonList"
            :key="i"
            class="px-3 my-1 flex"
          >
            <p class="w-6 text-right my-auto">{{ i + 1 }}.</p>
            <div class="ml-2">
              <input
                type="text"
                class="
                  w-36
                  px-2
                  py-1
                  rounded
                  shadow
                  placeholder-gray-600
                  capitalize
                "
                :class="
                  isGuessed(pokemon.name)
                    ? 'bg-green-200 font-semibold'
                    : hasPlayed
                    ? 'bg-red-200'
                    : 'bg-white'
                "
                disabled
                :placeholder="getPlaceholderValue(pokemon.name)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useQuery } from "@urql/vue";
import { useIntervalFn } from "@vueuse/core";

import { useNuxtApp } from "#app";

interface PokemonSpeciesList {
  pokemons: {
    id: number;
    name: string;
    types: {
      type: {
        name: string;
      };
    }[];
  }[];
}

export default defineComponent({
  async setup() {
    const nuxtApp = useNuxtApp();

    const result = await useQuery<PokemonSpeciesList>({
      query: `
                {
                    pokemons: pokemon_v2_pokemon(order_by: { id: asc }, where: { is_default: { _eq: true } }) {
                        id
                        name
                        types: pokemon_v2_pokemontypes {
                            type: pokemon_v2_type {
                                name
                            }
                        }
                    }
                }
            `,
    });

    const nameInput = ref("");

    const isPlaying = ref(false);
    const hasPlayed = ref(false);
    const hasCompleted = ref(false);

    const gameTime = ref(720);

    const formattedTime = computed(() => {
      const min = Math.floor(gameTime.value / 60);
      const sec = gameTime.value % 60;
      return `${min}:${sec < 10 ? `0${sec}` : sec}`;
    });

    const pokemonAllList = result.data.value?.pokemons.map((poke) => ({
      id: poke.id,
      name: poke.name,
      types: poke.types.map((type) => type.type.name),
    }));

    const types: string[] = [];
    for (const _poke of pokemonAllList!) {
      for (const type of _poke.types) {
        if (!types.includes(type)) types.push(type);
      }
    }

    const pokemonList = computed(() => {
      return result.data.value?.pokemons
        .map((poke) => ({
          id: poke.id,
          name: poke.name,
          types: poke.types.map((type) => type.type.name),
        }))
        .filter((poke) => poke.types.includes(activeType.value));
    });

    const normalizedPokemonList = computed(() => {
      return pokemonList.value?.map((poke) =>
        nuxtApp.$normalizeName(poke.name)
      );
    });

    const activeType = ref("");

    const changeType = (gen: string) => {
      if (isPlaying.value) return;
      activeType.value = gen;
      hasCompleted.value = false;
      hasPlayed.value = false;
      gameTime.value =
        pokemonList.value!.length <= 60
          ? 480
          : pokemonList.value!.length >= 100
          ? 900
          : 720;
    };

    const foundList = ref([""]);

    const getPlaceholderValue = (name: string) => {
      const normalName = nuxtApp.$normalizeName(name);
      return foundList.value.includes(normalName) || hasPlayed.value
        ? normalName
        : "";
    };

    const isGuessed = (name: string) => {
      return foundList.value.includes(nuxtApp.$normalizeName(name));
    };

    const game = useIntervalFn(
      () => {
        gameTime.value -= 1;
        if (gameTime.value <= 0) {
          game.pause();
          isPlaying.value = false;
          hasPlayed.value = true;
        }
      },
      1000,
      { immediate: false }
    );

    const startGame = () => {
      gameTime.value =
        pokemonList.value!.length <= 60
          ? 480
          : pokemonList.value!.length >= 100
          ? 900
          : 720;
      // Resetting values to defaults
      hasPlayed.value = false;
      isPlaying.value = true;
      foundList.value = [];
      // interval to decrease timer
      game.resume();
    };

    const stopGame = () => {
      isPlaying.value = false;
      hasPlayed.value = true;
      nameInput.value = "";
      game.pause();
    };

    const handleNameInput = () => {
      const normalizedName = nuxtApp.$normalizeName(nameInput.value);
      // Successfully fetched
      if (
        normalizedPokemonList.value?.includes(normalizedName) &&
        !foundList.value.includes(normalizedName)
      ) {
        foundList.value.push(normalizedName);
        nameInput.value = "";
      }
      // Game completed
      if (foundList.value.length === pokemonList.value?.length) {
        stopGame();
        hasCompleted.value = true;
      }
    };

    return {
      // API fetch related
      fetching: result.fetching,
      error: result.error,
      // game related
      types,
      activeType,
      pokemonList,
      foundList,
      changeType,
      getPlaceholderValue,
      handleNameInput,
      // Game controls
      nameInput,
      gameTime,
      formattedTime,
      startGame,
      stopGame,
      isGuessed,
      // active status IG
      isPlaying,
      hasPlayed,
      hasCompleted,
    };
  },
});
</script>
