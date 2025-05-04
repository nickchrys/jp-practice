<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  words: Array,
  cardStates: Object
});
const emit = defineEmits(['update-card-state']);

const adjective = ref(null);
const showDefinitions = ref(false);
const selectedLessons = ref([]);
const showOptions = ref(false);

const availableLessons = computed(() => {
  const lessons = props.words
    .filter(word =>
      (word.type === 'い-adj.' || word.type === 'な-adj.') &&
      word.lesson
    )
    .map(word => word.lesson);

  const uniqueLessons = Array.from(new Set(lessons));
  uniqueLessons.sort((a, b) => {
    const numA = parseInt(a.replace("Lesson ", ""), 10);
    const numB = parseInt(b.replace("Lesson ", ""), 10);
    return numA - numB;
  });

  return uniqueLessons;
});

// update getRandomWord to respect selectedLessons:
function getRandomWord() {
  const candidates = props.words.filter(word =>
    (word.type === 'い-adj.' || word.type === 'な-adj.') &&
    (selectedLessons.value.length === 0 || selectedLessons.value.includes(word.lesson))
  );
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function toggleDefinitions() {
  showDefinitions.value = !showDefinitions.value;
}

function rerollAdjectives() {
  adjective.value = getRandomWord();
}

function toggleLanguage() {
  const newState = props.cardStates['adjectives-card'] === 'Japanese' ? 'English' : 'Japanese';
  emit('update-card-state', { key: 'adjectives-card', value: newState });
}

// Add toggleOptions function
function toggleOptions() {
  showOptions.value = !showOptions.value;
}

watch(() => props.words, () => {
  rerollAdjectives();
}, { immediate: true });
</script>

<template>
  <div v-if="!showOptions" class="card" id="adjectives-card">
    <div class="opt-button" @click="toggleOptions">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#fff" d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z"/></svg>
    </div>
    <h3>Adjectives</h3>
    <p><strong>Adjective:</strong> <span v-if="props.cardStates['adjectives-card'] == 'Japanese'" class="japanese-word"
          :data-hiragana="adjective?.hiragana">{{
            adjective?.kanji || adjective?.hiragana }}</span><span v-else>{{ adjective?.definition }}</span></p>
      <p v-if="showDefinitions" class="definition"><span v-if="props.cardStates['adjectives-card'] == 'Japanese'">{{
        adjective?.definition }}</span><span v-else class="japanese-word" :data-hiragana="adjective?.hiragana">{{
          adjective?.kanji || adjective?.hiragana }}</span><span class="lesson-num">{{ adjective?.lesson }}</span></p>

    <div class="button-group">
      <button @click="toggleDefinitions">Show/Hide Definitions</button>
      <button @click="rerollAdjectives">Reroll Adjectives</button>
      <button @click="toggleLanguage">
        <span v-if="props.cardStates['adjectives-card'] == 'Japanese'">Swap to English</span>
        <span v-else>Swap to Japanese</span>
      </button>
    </div>
  </div>

  <div v-if="showOptions" class="card" id="adjectives-card">
    <div class="back-button" @click="toggleOptions">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m4 8l-.707.707L2.586 8l.707-.707zm5 12a1 1 0 1 1 0-2zm-.707-6.293l-5-5l1.414-1.414l5 5zm-5-6.414l5-5l1.414 1.414l-5 5zM4 7h10.5v2H4zm10.5 13H9v-2h5.5zm6.5-6.5a6.5 6.5 0 0 1-6.5 6.5v-2a4.5 4.5 0 0 0 4.5-4.5zM14.5 7a6.5 6.5 0 0 1 6.5 6.5h-2A4.5 4.5 0 0 0 14.5 9z"/></svg>
    </div>
    <div class="lesson-selector">
      <p>Lessons</p>
      <div class="lessons-grid">
        <div v-for="lesson in availableLessons" :key="lesson">
          <input type="checkbox" :id="`adjectives-${lesson}`" :value="lesson" v-model="selectedLessons" />
          <label :for="`adjectives-${lesson}`">{{ lesson }}</label>
        </div>
      </div>
    </div>
  </div>
</template>
