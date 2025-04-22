<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  words: Array,
  cardStates: Object
});

const subject = ref(null);
const object = ref(null);
const place = ref(null);
const showDefinitions = ref(false);
const selectedLessons = ref([]);

function getRandomWord() {
  const nouns = props.words.filter(word => word.type === 'n.' && (selectedLessons.value.length === 0 || selectedLessons.value.includes(word.lesson)));
  return nouns[Math.floor(Math.random() * nouns.length)];
}

function toggleDefinitions() {
  showDefinitions.value = !showDefinitions.value;
}

function rerollNouns() {
  subject.value = getRandomWord();
  object.value = getRandomWord();
  place.value = getRandomWord();
}

// Initialize nouns on mount and when words prop changes
watch(() => props.words, () => {
  rerollNouns();
}, { immediate: true });

function toggleLanguage() {
  props.cardStates['nouns-card'] = !props.cardStates['nouns-card'];
}
</script>

<template>
  <div class="card">
    <h3>Nouns</h3>
    <p><strong>Subject:</strong> <span class="japanese-word">{{ subject?.hiragana }}</span></p>
    <p v-if="showDefinitions" class="definition">{{ subject?.definition }}</p>

    <p><strong>Object:</strong> <span class="japanese-word">{{ object?.hiragana }}</span></p>
    <p v-if="showDefinitions" class="definition">{{ object?.definition }}</p>

    <p><strong>Location:</strong> <span class="japanese-word">{{ place?.hiragana }}</span></p>
    <p v-if="showDefinitions" class="definition">{{ place?.definition }}</p>

    <div class="lesson-selector">
      <label for="nounLessons">Select Lessons:</label>
      <select id="nounLessons" v-model="selectedLessons" multiple>
        <option value="Lesson 1">Lesson 1</option>
        <option value="Lesson 2">Lesson 2</option>
        <!-- Add more lessons as needed -->
      </select>
    </div>

    <div class="button-group">
      <button @click="toggleDefinitions">Show/Hide Definitions</button>
      <button @click="rerollNouns">Reroll Nouns</button>
      <button @click="toggleLanguage">Swap Language</button>
    </div>
  </div>
</template>

<style scoped>
/* Add card styling */
</style>