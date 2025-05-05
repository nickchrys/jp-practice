<template>
    <div class="p-4">
      <h2 class="text-xl font-bold mb-2">Practice This Grammar</h2>
      <div v-if="current">
        <p class="mb-4"><strong>Grammar:</strong> {{ current['Grammar Point'] }}</p>
        <button @click="reveal = !reveal" class="btn mb-2">
          {{ reveal ? 'Hide Lesson' : 'Show Lesson' }}
        </button>
        <p v-if="reveal" class="italic">Lesson: {{ current.Lesson }}</p>
      </div>
      <button @click="pickRandom" class="btn-primary mt-4">Next</button>
    </div>
  </template>
  
  <script>
  import Papa from 'papaparse';
  
  export default {
    name: 'RandomPrompt',
    data() {
      return {
        rows: [],        // Parsed CSV rows
        current: null,   // Currently selected row
        reveal: false,   // Toggle for showing the lesson
      };
    },
    mounted() {
      this.loadCsv();
    },
    methods: {
      async loadCsv() {
        try {
          const response = await fetch('/genki2_lessons16_20_grammar.csv');
          const text = await response.text();
          Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              this.rows = results.data;
              this.pickRandom();
            }
          });
        } catch (error) {
          console.error('Error loading CSV:', error);
        }
      },
      pickRandom() {
        this.reveal = false;
        if (!this.rows.length) return;
        const index = Math.floor(Math.random() * this.rows.length);
        this.current = this.rows[index];
      },
    },
  };
  </script>
  
  <style scoped>
  .btn {
    @apply px-4 py-2 border rounded;
  }
  .btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded;
  }
  </style>