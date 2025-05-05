<script setup>
import { ref, computed, onMounted } from 'vue';
import Papa from 'papaparse';

const props = defineProps({
  cardStates: Object
});
const emit = defineEmits(['update-card-state']);

const rows = ref([]);
const current = ref(null);
const reveal = ref(false);
const showOptions = ref(false);
const selectedLessons = ref([]);

const availableLessons = computed(() => {
  const lessons = rows.value.map(r => r.Lesson).filter(Boolean);
  return Array.from(new Set(lessons)).sort((a, b) => +a - +b);
});

const filteredRows = computed(() =>
  rows.value.filter(r =>
    !selectedLessons.value.length || selectedLessons.value.includes(r.Lesson)
  )
);

function pickRandom() {
  reveal.value = false;
  if (!filteredRows.value.length) return;
  current.value =
    filteredRows.value[
      Math.floor(Math.random() * filteredRows.value.length)
    ];
}

function toggleOptions() {
  showOptions.value = !showOptions.value;
}

function toggleKeyword() {
  reveal.value = !reveal.value;
}

function toggleLanguage() {
  const key = 'grammar-card';
  const newState =
    props.cardStates[key] === 'Japanese' ? 'English' : 'Japanese';
  emit('update-card-state', { key, value: newState });
}

async function loadCsv() {
    const res = await fetch('/genki2_lessons16_20_grammar.csv');
    const txt = await res.text();
    Papa.parse(txt, {
      header: true,
      skipEmptyLines: true,
      transformHeader: h => h.trim(),    // ← ADD THIS LINE
      complete: ({ data }) => {
        rows.value = data;
        pickRandom();
      }
    });
  }

  onMounted(loadCsv);
</script>

<template>
  <!-- MAIN CARD -->
  <div v-if="!showOptions" class="card" id="grammar-card">
    <div class="opt-button" @click="toggleOptions">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path fill="#fff"
          d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z" />
      </svg>
    </div>
    <h3>Grammar</h3>
    <div class="noun-container">
      <p>
        <span v-if="props.cardStates['grammar-card']==='Japanese'">
          {{ current?.['Grammar Point'] }}
        </span>
        <span v-else>
          {{ current?.Keyword }}
        </span>
      </p>
      <p v-if="reveal" class="definition">
        <span v-if="props.cardStates['grammar-card']==='Japanese'">
          {{ current?.Keyword }}
        </span>
        <span v-else>
          {{ current?.['Grammar Point'] }}
        </span>
        <span class="lesson-num">Lesson {{ current?.Lesson }}</span>
      </p>
    </div>
    <div class="button-group">
      <button @click="toggleKeyword">
        <span v-if="!reveal">Show Keyword</span>
        <span v-else>Hide Keyword</span>
      </button>
      <button @click="pickRandom">Next</button>
      <button @click="toggleLanguage">
        <span v-if="props.cardStates['grammar-card']==='Japanese'">
          Swap to English
        </span>
        <span v-else>
          Swap to Japanese
        </span>
      </button>
    </div>
  </div>

  <!-- OPTIONS PANEL -->
  <div v-else class="card" id="grammar-card">
    <div class="back-button" @click="toggleOptions">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="m4 8l-.707.707L2.586 8l.707-.707zm5 12a1 1 0 1 1 0-2zm-.707-6.293l-5-5l1.414-1.414l5 5zm-5-6.414l5-5l1.414 1.414l-5 5zM4 7h10.5v2H4zm10.5 13H9v-2h5.5zm6.5-6.5a6.5 6.5 0 0 1-6.5 6.5v-2a4.5 4.5 0 0 0 4.5-4.5zM14.5 7a6.5 6.5 0 0 1 6.5 6.5h-2A4.5 4.5 0 0 0 14.5 9z" />
      </svg>
    </div>
    <div class="lesson-selector grammar-selector">
      <p>Lessons</p>
      <div class="lessons-grid">
        <div v-for="L in availableLessons" :key="L">
          <input
            type="checkbox"
            :id="`grammar-${L}`"
            :value="L"
            v-model="selectedLessons"
          />
          <label :for="`grammar-${L}`">{{ L }}</label>
        </div>
      </div>
    </div>
  </div>
</template>