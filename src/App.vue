<script setup>
import { ref, onMounted } from 'vue';
import * as XLSX from 'xlsx';
import NounsCard from './components/NounsCard.vue';
import VerbsCard from './components/VerbsCard.vue';
import AdjectivesCard from './components/AdjectivesCard.vue';

const words = ref([]);
const cardStates = ref({
  'nouns-card': true,
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
    words.value = json.map(row => ({
      number: row[0],
      hiragana: row[1],
      kanji: row[2],
      type: row[3],
      definition: row[4],
      lesson: row[5],
    }));
  } catch (error) {
    console.error('Error loading Excel file:', error);
  }
};

const toggleCardLanguage = (cardId) => {
  cardStates.value[cardId] = !cardStates.value[cardId];
};

onMounted(() => {
  loadExcelFile();
});
</script>

<template>
  <div id="app">
    <div class="cards-container">
      <NounsCard :words="words" :cardStates="cardStates" id="nouns-card" />
      <VerbsCard :words="words" :cardStates="cardStates" id="verbs-card" />
      <AdjectivesCard :words="words" :cardStates="cardStates" id="adjectives-card" />
    </div>
  </div>
</template>