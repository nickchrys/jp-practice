<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  words: Array,
  cardStates: Object
});

const adjective = ref(null);
const showDefinitions = ref(false);

function getRandomWord() {
  const adjectives = props.words.filter(word => word.type === 'な-adj.' || word.type === 'い-adj.');
  return adjectives[Math.floor(Math.random() * adjectives.length)];
}

function toggleDefinitions() {
  showDefinitions.value = !showDefinitions.value;
}

function rerollAdjectives() {
  adjective.value = getRandomWord();
}

// Initialize adjectives on mount and when words prop changes
watch(() => props.words, () => {
  rerollAdjectives();
}, { immediate: true });
</script>

<template>
  <div class="card">
    <h3>Adjectives</h3>
    <p><strong>Adjective:</strong> <span class="japanese-word">{{ adjective?.hiragana }}</span></p>
    <p v-if="showDefinitions" class="definition">{{ adjective?.definition }}</p>

    <div class="button-group">
      <button @click="toggleDefinitions">Show/Hide Definitions</button>
      <button @click="rerollAdjectives">Reroll Adjectives</button>
    </div>
  </div>
</template>

<style scoped>
/* Add card styling */
</style>