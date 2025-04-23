<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  words: Array,
  cardStates: Object
});

const emit = defineEmits(['update-card-state']);

const subject = ref(null);
const object = ref(null);
const place = ref(null);
const showDefinitions = ref(false);
const selectedLessons = ref([]);
const showOptions = ref(false);

const availableLessons = computed(() => {
  // Use the lesson value directly since it's already normalized (e.g., "Lesson 3")
  const lessons = props.words
    .filter(word => word.type === 'n.' && word.lesson)
    .map(word => word.lesson);
  let uniqueLessons = Array.from(new Set(lessons));
  uniqueLessons.sort((a, b) => {
    const numA = parseInt(a.replace("Lesson ", ""));
    const numB = parseInt(b.replace("Lesson ", ""));
    return numA - numB;
  });
  return uniqueLessons;
});

function getRandomWord() {
  const nouns = props.words.filter(word => {
    const lessonLabel = word.lesson;
    return word.type === 'n.' &&
      (selectedLessons.value.length === 0 || selectedLessons.value.includes(lessonLabel));
  });
  return nouns[Math.floor(Math.random() * nouns.length)];
}

function toggleDefinitions() {
  showDefinitions.value = !showDefinitions.value;
}

function toggleOptions() {
  showOptions.value = !showOptions.value;
}

function rerollNouns() {
  subject.value = getRandomWord();
  object.value = getRandomWord();
  place.value = getRandomWord();
}

watch(() => props.words, () => {
  rerollNouns();
}, { immediate: true });

function toggleLanguage() {
  const newState = props.cardStates['nouns-card'] === 'Japanese' ? 'English' : 'Japanese';
  emit('update-card-state', { key: 'nouns-card', value: newState });
}
</script>

<template>
  <div v-if="!showOptions" class="card" id="nouns-card">
    <h3>Nouns</h3>
    <div class="noun-container">
      <p><strong>Subject:</strong> <span v-if="props.cardStates['nouns-card'] == 'Japanese'" class="japanese-word"
          :data-hiragana="subject?.hiragana">{{
            subject?.kanji || subject?.hiragana }}</span><span v-else>{{ subject?.definition }}</span></p>
      <p v-if="showDefinitions" class="definition"><span v-if="props.cardStates['nouns-card'] == 'Japanese'">{{
        subject?.definition }}</span><span v-else class="japanese-word" :data-hiragana="subject?.hiragana">{{
            subject?.kanji || subject?.hiragana }}</span><span class="lesson-num">{{ subject?.lesson }}</span></p>
    </div>
    <div class="noun-container">
      <p><strong>Object:</strong> <span v-if="props.cardStates['nouns-card'] == 'Japanese'" class="japanese-word"
          :data-hiragana="object?.hiragana">{{
            object?.kanji || object?.hiragana }}</span><span v-else>{{ object?.definition }}</span></p>
      <p v-if="showDefinitions" class="definition"><span v-if="props.cardStates['nouns-card'] == 'Japanese'">{{
        object?.definition }}</span><span v-else class="japanese-word" :data-hiragana="object?.hiragana">{{
            object?.kanji || object?.hiragana }}</span><span class="lesson-num">{{ object?.lesson }}</span></p>
    </div>
    <div class="noun-container">
      <p><strong>Place:</strong> <span v-if="props.cardStates['nouns-card'] == 'Japanese'" class="japanese-word"
          :data-hiragana="place?.hiragana">{{
            place?.kanji || place?.hiragana }}</span><span v-else>{{ place?.definition }}</span></p>
      <p v-if="showDefinitions" class="definition"><span v-if="props.cardStates['nouns-card'] == 'Japanese'">{{
        place?.definition }}</span><span v-else class="japanese-word" :data-hiragana="place?.hiragana">{{
            place?.kanji || place?.hiragana }}</span><span class="lesson-num">{{ place?.lesson }}</span></p>
    </div>

    <div class="button-group">
      <button @click="toggleDefinitions">
        <span v-if="!showDefinitions">Show Definition</span>
        <span v-else>Hide Definition</span>
      </button>
      <button @click="rerollNouns">Reroll Nouns</button>
      <button @click="toggleLanguage">
        <span v-if="props.cardStates['nouns-card'] == 'Japanese'">Swap to English</span>
        <span v-else>Swap to Japanese</span>
      </button>
      <button @click="toggleOptions">Options</button>
    </div>
  </div>

  <div v-if="showOptions" class="card" id="nouns-card">
    <div class="back-button" @click="toggleOptions">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m4 8l-.707.707L2.586 8l.707-.707zm5 12a1 1 0 1 1 0-2zm-.707-6.293l-5-5l1.414-1.414l5 5zm-5-6.414l5-5l1.414 1.414l-5 5zM4 7h10.5v2H4zm10.5 13H9v-2h5.5zm6.5-6.5a6.5 6.5 0 0 1-6.5 6.5v-2a4.5 4.5 0 0 0 4.5-4.5zM14.5 7a6.5 6.5 0 0 1 6.5 6.5h-2A4.5 4.5 0 0 0 14.5 9z"/></svg>
    </div>
    <div class="lesson-selector">
      <p>Lessons</p>
      <div class="lessons-grid">
        <div v-for="lesson in availableLessons" :key="lesson">
          <input type="checkbox" :id="lesson" :value="lesson" v-model="selectedLessons" />
          <label :for="lesson">{{ lesson }}</label>
        </div>
      </div>
    </div>
  </div>
</template>