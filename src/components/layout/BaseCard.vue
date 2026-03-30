<script setup lang="ts">
import { computed } from 'vue'

import type { Card } from '@/types'

const props = defineProps<{
  card: Card
  size?: 'sm' | 'md'
  isSelected?: boolean
  isDisabled?: boolean
  currentHp?: number
}>()

const typeColor = computed(() => {
  const colors: Record<string, string> = {
    Fire: 'bg-red-500',
    Water: 'bg-blue-500',
    Grass: 'bg-green-500',
    Electric: 'bg-yellow-400',
    Psychic: 'bg-purple-500',
    Normal: 'bg-gray-400',
  }
  return colors[props.card.type] || 'bg-slate-500'
})
</script>

<template>
  <div
    class="relative border-2 rounded-xl p-3 bg-white transition-all shadow-sm h-full"
    :class="[
      size === 'sm' ? 'w-32 text-xs' : 'w-48 text-sm',
      isSelected
        ? 'border-yellow-400 ring-2 ring-yellow-200 scale-105 z-10'
        : 'border-gray-200',
      isDisabled && !isSelected
        ? 'opacity-40 grayscale pointer-events-none'
        : 'cursor-pointer',
    ]"
  >
    <div class="relative overflow-hidden rounded bg-gray-100">
      <span
        class="absolute top-0 left-0 bg-black/70 text-white text-[10px] px-1 rounded-br z-20"
      >
        #{{ card.pokedexNumber }}
      </span>
      <img
        :src="card.imgUrl"
        :alt="card.name"
        class="w-full h-32 object-contain"
      />
    </div>

    <div class="font-bold truncate mt-2 text-center">{{ card.name }}</div>

    <div class="flex justify-between items-center mt-2">
      <span
        :class="[
          'px-2 py-0.5 rounded-full text-[10px] text-white font-bold',
          typeColor,
        ]"
      >
        {{ card.type }}
      </span>
      <span class="text-red-600 font-bold text-[10px]">{{ card.hp }} HP</span>
    </div>

    <div class="mt-2 text-[10px] text-gray-500 border-t pt-2 italic">
      Attaque : {{ card.attack }}
    </div>

    <div
      v-if="currentHp !== undefined"
      class="w-full bg-gray-200 h-1.5 mt-2 rounded-full overflow-hidden"
    >
      <div
        class="bg-green-500 h-full"
        :style="{ width: `${(currentHp / card.hp) * 100}%` }"
      ></div>
    </div>
  </div>
</template>
