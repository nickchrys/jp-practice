<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  words: Array,
  cardStates: Object
});
const emit = defineEmits(['update-card-state']);

const verb = ref(null);
const showDefinitions = ref(false);
const selectedLessons = ref([]);
const showOptions = ref(false);

// build unique, sorted lesson list for verbs
const availableLessons = computed(() => {
  const lessons = props.words
    .filter(w => ['u-v.','ru-v.','irr-v.'].includes(w.type) && w.lesson)
    .map(w => w.lesson);
  const uniq = Array.from(new Set(lessons));
  uniq.sort((a, b) =>
    parseInt(a.replace('Lesson ',''))
    - parseInt(b.replace('Lesson ',''))
  );
  return uniq;
});

// pick a random verb, constrained by selectedLessons
function getRandomWord() {
  const pool = props.words.filter(w =>
    ['u-v.','ru-v.','irr-v.'].includes(w.type) &&
    (selectedLessons.value.length === 0 || selectedLessons.value.includes(w.lesson))
  );
  return pool[Math.floor(Math.random() * pool.length)];
}

function toggleDefinitions() {
  showDefinitions.value = !showDefinitions.value;
}

function rerollVerbs() {
  verb.value = getRandomWord();
}

function toggleOptions() {
  showOptions.value = !showOptions.value;
}

// swap cardState between Japanese/English
function toggleLanguage() {
  const key = 'verbs-card';
  const newState = props.cardStates[key] === 'Japanese' ? 'English' : 'Japanese';
  emit('update-card-state', { key, value: newState });
}

// initialize on mount and when words change
watch(() => props.words, rerollVerbs, { immediate: true });
</script>

<template>
  <!-- MAIN CARD -->
  <div v-if="!showOptions" class="card" id="verbs-card">
    <div class="opt-button" @click="toggleOptions">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#fff" d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z"/></svg>
   
    </div>
    <h3>Verbs</h3>
    <p>
      <strong>Verb:</strong>
      <span
        v-if="props.cardStates['verbs-card']=='Japanese'"
        class="japanese-word"
        :data-hiragana="verb?.hiragana"
      >
        {{ verb?.kanji || verb?.hiragana }}
      </span>
      <span v-else>
        {{ verb?.definition }}
      </span>
    </p>
    <p v-if="showDefinitions" class="definition">
      <span v-if="props.cardStates['verbs-card']=='Japanese'">
        {{ verb?.definition }}
      </span>
      <span v-else class="japanese-word" :data-hiragana="verb?.hiragana">
        {{ verb?.kanji || verb?.hiragana }}
      </span>
      <span class="lesson-num">{{ verb?.lesson }}</span>
    </p>

    <div class="button-group">
      <button @click="toggleDefinitions">Show/Hide Definitions</button>
      <button @click="rerollVerbs">Reroll Verbs</button>
      <button @click="toggleLanguage">
        <span v-if="props.cardStates['verbs-card']=='Japanese'">Swap to English</span>
        <span v-else>Swap to Japanese</span>
      </button>
    </div>
  </div>

  <!-- OPTIONS PANE -->
  <div v-else class="card" id="verbs-card">
    <div class="back-button" @click="toggleOptions">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m4 8l-.707.707L2.586 8l.707-.707zm5 12a1 1 0 1 1 0-2zm-.707-6.293l-5-5l1.414-1.414l5 5zm-5-6.414l5-5l1.414 1.414l-5 5zM4 7h10.5v2H4zm10.5 13H9v-2h5.5zm6.5-6.5a6.5 6.5 0 0 1-6.5 6.5v-2a4.5 4.5 0 0 0 4.5-4.5zM14.5 7a6.5 6.5 0 0 1 6.5 6.5h-2A4.5 4.5 0 0 0 14.5 9z"/></svg>
    </div>
    <div class="lesson-selector">
      <p>Lessons</p>
      <div class="lessons-grid">
        <div v-for="lesson in availableLessons" :key="lesson">
          <input
            type="checkbox"
            :id="`verbs-${lesson}`"
            :value="lesson"
            v-model="selectedLessons"
          />
          <label :for="`verbs-${lesson}`">{{ lesson }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* …existing styling… */
</style>