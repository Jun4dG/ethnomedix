<template>
    <div class="container">
      <div class="text-img-logo">
        <img src="/assets/images/logo.png" class="img-logo" />
      </div>
      <p class="description">
        Recommendation of Ethno-medicinal plants for natural common disease treatment.
      </p>
      <h1 class="title">Search Ailment</h1>
  
      <!-- Dropdown for Disease Selection -->
      <div class="dropdown-container">
        <select v-model="selectedDisease" @change="goToDiseasePage" class="custom-dropdown">
          <option value="" disabled>Select an ailment...</option>
          <option v-for="disease in sortedDiseases" :key="disease.id" :value="disease.name">
            {{ disease.name }}
          </option>
        </select>
      </div>
  
      <!-- Results Section -->
      <div v-if="selectedDisease" class="results">
        <h2>Recommended Plants for "{{ selectedDisease }}"</h2>
        <ul>
          <li v-for="plant in filteredPlants" :key="plant.name">
            <strong>{{ plant.name }}</strong> - {{ plant.preparation }}
          </li>
        </ul>
      </div>
    </div>
  </template>  
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { ref, computed } from 'vue';
  
  const router = useRouter();
  
  const diseases = ref([
  {
  id: 1,
  name: "High Blood Pressure"
  },
  {
  id: 2,
  name: "Heart problems"
  },
  {
  id: 3,
  name: "Cough"
  },
  {
  id: 4,
  name: "Tuberculosis"
  },
  {
  id: 5,
  name: "Fever"
  },
  {
  id: 6,
  name: "Wound"
  },
  {
  id: 7,
  name: "Acid reflux (kabuhi)"
  },
  {
  id: 8,
  name: "Headache"
  },
  {
  id: 9,
  name: "Stomachache"
  },
  {
  id: 10,
  name: "Rheumatoid"
  },
  {
  id: 11,
  name: "Diarrhea"
  },
  {
  id: 12,
  name: "Relapse (bughat)"
  },
  {
  id: 13,
  name: "Irregular Menstruation or Bleeding in Women"
  },
  {
  id: 14,
  name: "Toothache"
  },
  {
  id: 15,
  name: "Mild stroke"
  },
  {
  id: 16,
  name: "Edema"
  },
  {
  id: 17,
  name: "Tonsilitis"
  },
  {
  id: 18,
  name: "Flatulence (panuhot)"
  },
  {
  id: 19,
  name: "Arthritis"
  },
  {
  id: 20,
  name: "Swollen Gums"
  },
  {
  id: 21,
  name: "Urination"
  },
  {
  id: 22,
  name: "Sinusitis"
  },
  {
  id: 23,
  name: "Vertigo"
  },
  {
  id: 24,
  name: "Bruises"
  },
  {
  id: 25,
  name: "Sore throat"
  },
  {
  id: 26,
  name: "Sore eyes"
  },
  {
  id: 27,
  name: "Abdominal Pain"
  },
  {
  id: 28,
  name: "Ulcers"
  },
  {
  id: 29,
  name: "Asthmatic Attack"
  },
  {
  id: 30,
  name: "Anemia"
  },
  {
  id: 31,
  name: "Dysentery"
  },
  {
  id: 32,
  name: "Expel intestinal parasites or worms"
  }
  ]);
  
  const selectedDisease = ref("");
  
  // Sort diseases alphabetically
  const sortedDiseases = computed(() => {
  return [...diseases.value].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  });

  const filteredPlants = computed(() => {
	const disease = diseases.value.find(d => d.name === selectedDisease.value);
	return disease ? disease.plants : [];
  });
  
  const goToDiseasePage = () => {
  if (selectedDisease.value) {
    router.push(`/disease/${selectedDisease.value.toLowerCase()}`);
  }
  };
  </script>
