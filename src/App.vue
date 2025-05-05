<script setup>
import { ref, onMounted } from 'vue';
import Papa from 'papaparse';
import NounsCard from './components/NounsCard.vue';
import VerbsCard from './components/VerbsCard.vue';
import AdjectivesCard from './components/AdjectivesCard.vue';
import GrammarCard from './components/GrammarCard.vue';

const words = ref([]);
const cardStates = ref({
  'nouns-card': 'Japanese',
  'adjectives-card': true,
  'verb-card': true,
  'grammar-card': true
});

const loadCsvFile = async () => {
  try {
    const response = await fetch('/GenkiWordIndex.csv');
    const text = await response.text();
    // Set header:false as the CSV file does not include a header row.
    const results = Papa.parse(text, { header: false, skipEmptyLines: true });
    words.value = results.data.map(row => {
      const lessonMatch = row[5]?.match(/L(\d+)/);
      const normalizedLesson = lessonMatch ? `Lesson ${lessonMatch[1]}` : row[5];
      return {
        number: row[0],
        hiragana: row[1],
        kanji: row[2],
        type: row[3],
        definition: row[4],
        lesson: normalizedLesson,
      };
    });
    console.log('CSV loaded successfully:', words.value);
  } catch (error) {
    console.error('Error loading CSV file:', error);
  }
};

const handleCardStateUpdate = ({ key, value }) => {
  cardStates.value = { ...cardStates.value, [key]: value };
  console.log(`Card state updated: ${key} = ${value}`);
};

onMounted(() => {
  loadCsvFile();
});
</script>

<template>
  <div id="app">
    
    <div class="cards-container">
      <GrammarCard :cardStates="cardStates" @update-card-state="handleCardStateUpdate"/>
      <VerbsCard :words="words" :cardStates="cardStates" @update-card-state="handleCardStateUpdate"/>
      <NounsCard :words="words" :cardStates="cardStates" @update-card-state="handleCardStateUpdate"/>
      <AdjectivesCard :words="words" :cardStates="cardStates" @update-card-state="handleCardStateUpdate"/>
    </div>
  </div>
</template>