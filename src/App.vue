<script setup>
import { ref, onMounted } from 'vue';
import * as XLSX from 'xlsx';
import NounsCard from './components/NounsCard.vue';
import VerbsCard from './components/VerbsCard.vue';
import AdjectivesCard from './components/AdjectivesCard.vue';

const words = ref([]);
const cardStates = ref({
  'nouns-card': 'Japanese',
  'adjectives-card': true,
  'verb-card': true,
  'grammar-card': true
});

const loadExcelFile = async () => {
  try {
    const response = await fetch('/GenkiWordIndex.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    words.value = json.map(row => {
      const lessonMatch = row[5]?.match(/L(\d+)/); // Extract lesson number
      const normalizedLesson = lessonMatch ? `Lesson ${lessonMatch[1]}` : null; // Normalize lesson format

      return {
        number: row[0],
        hiragana: row[1],
        kanji: row[2],
        type: row[3],
        definition: row[4],
        lesson: normalizedLesson, // Use normalized lesson
      };
    });
  } catch (error) {
    console.error('Error loading Excel file:', error);
  }
};

const handleCardStateUpdate = ({ key, value }) => {
  cardStates.value = { ...cardStates.value, [key]: value };
  console.log(`Card state updated: ${key} = ${value}`);
};

onMounted(() => {
  loadExcelFile();
});
</script>

<template>
  <div id="app">
    <div class="cards-container">
      <NounsCard :words="words" :cardStates="cardStates" @update-card-state="handleCardStateUpdate"/>
      <VerbsCard :words="words" :cardStates="cardStates" id="verbs-card" @update-card-state="handleCardStateUpdate"/>
      <AdjectivesCard :words="words" :cardStates="cardStates" @update-card-state="handleCardStateUpdate"/>
    </div>
  </div>
</template>