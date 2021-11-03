<template>
    <span class="text-red-500">Test page pls</span>
    <div>
        <p> {{ fetching }} </p>
        <p> {{ error }} </p>
        <br/>
        <div class="bg-gray-100">
            {{ data }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useQuery } from '@urql/vue'

export default defineComponent({
    setup() {
        const result = useQuery({
            query: `
                {
                    pokemon_v2_pokemonspecies(order_by: {id: asc}) {
                        id
                        name
                        generation_id
                    }
                }
            `
        })

        return {
            fetching: result.fetching,
            data: result.data,
            error: result.error
        }
    },
})
</script>
