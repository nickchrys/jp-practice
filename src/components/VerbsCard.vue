<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  words: Array,
  cardStates: Object
});

const verb = ref(null);
const showDefinitions = ref(false);

function getRandomWord() {
  const verbs = props.words.filter(word => word.type === 'u-v.' || word.type === 'ru-v.' || word.type === 'irr-v.');
  return verbs[Math.floor(Math.random() * verbs.length)];
}

function toggleDefinitions() {
  showDefinitions.value = !showDefinitions.value;
}

function rerollVerbs() {
  verb.value = getRandomWord();
}

// Initialize verbs on mount and when words prop changes
watch(() => props.words, () => {
  rerollVerbs();
}, { immediate: true });
</script>

<template>
  <div class="card">
    <h3>Verbs</h3>
    <p><strong>Verb:</strong> <span class="japanese-word">{{ verb?.hiragana }}</span></p>
    <p v-if="showDefinitions" class="definition">{{ verb?.definition }}</p>

    <div class="button-group">
      <button @click="toggleDefinitions">Show/Hide Definitions</button>
      <button @click="rerollVerbs">Reroll Verbs</button>
    </div>
  </div>
</template>

<style scoped>
/* Add card styling */
</style>