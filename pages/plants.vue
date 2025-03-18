<template>
  <div class="container2">
    <h1 class="title">Search by Plants</h1>

    <!-- Search Bar -->
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search plant..."
      class="search-bar"
    />

    <!-- Grid Layout for Plant Cards -->
    <div class="plant-grid">
      <div
        v-for="plant in filteredPlants"
        :key="plant.id"
        class="plant-card"
        :class="{ highlighted: isHighlighted(plant) }"
        @click="selectPlant(plant)"
      >
        <img :src="plant.image" :alt="plant.name" class="plant-image" />
        <p class="plant-name">{{ plant.name }}</p>
      </div>
    </div>

    <!-- Pop-up Modal for Selected Plant -->
    <div v-if="selectedPlant" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">✖</button>
        <h2>{{ selectedPlant.name }}</h2>
        <p><strong>Scientific Name:</strong> {{ selectedPlant.scientificName }}</p>

        <!-- Table for Diseases & Preparations -->
        <div class="table-container">
          <table class="plant-table">
            <thead>
              <tr>
                <th>Ailments</th>
                <th>Preparation</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(prep, index) in selectedPlant.procedures" :key="index">
                <td><strong><span class="disease-text">{{ selectedPlant.diseases[index]}}</span></strong></td>
                <td>{{ prep }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const searchQuery = ref("");
const selectedPlant = ref(null);

const plants = ref([
{ 
    "id": 1,
    "name": "Salumayag", 
    "scientificName": "Agathis philippinensis", 
    "diseases": ["High Blood Pressure (Hypertension)", "Relapse (Bughat)"], 
    "procedures": ["Decoction", "Decoction"],
    "image": "/ethnomedix/images/salumayag.jpg"
  },
  { 
    "id": 2,
    "name": "Alinggatong", 
    "scientificName": "Urtica dioica L.,", 
    "diseases": ["High Blood Pressure (Hypertension)", "Heart Problems"], 
    "procedures": ["Decoction", "Decoction"] ,
    "image": "images/alinggatong.jpg"
  },
  { 
    "id": 3,
    "name": "Butterfly Pea", 
    "scientificName": "Clitoria ternatea", 
    "diseases": ["High Blood Pressure (Hypertension)"], 
    "procedures": ["Soak in lukewarm water"],
    "image": "images/ButterflyPea.jpg"
  },
  { 
    "id": 4,
    "name": "Sayote", 
    "scientificName": "Chayote frute", 
    "diseases": ["High Blood Pressure (Hypertension)"], 
    "procedures": ["Decoction"],
    "image": "images/sayote.jpeg"
  },
  { 
    "id": 5,
    "name": "Betel Nut Palm", 
    "scientificName": "Areca catechu", 
    "diseases": ["High Blood Pressure (Hypertension)"], 
    "procedures": ["Decoction"] ,
    "image": "images/betel nut.jpg"
  },
  { 
    "id": 6,
    "name": "Ahos", 
    "scientificName": "Allium sativum L.", 
    "diseases": ["High Blood Pressure (Hypertension)"], 
    "procedures": ["Chew and eat raw"] ,
    "image": "images/ahos.jpeg"
  },
  { 
    "id": 7,
    "name": "Gabon/Pahid", 
    "scientificName": "Blumea balsamifera", 
    "diseases": [
      "High Blood Pressure (Hypertension)", 
      "High Blood Pressure (Hypertension)", 
      "Cough", 
      "Cough", 
      "Fever", 
      "Mild Stroke", 
      "Edema"
    ], 
    "procedures": [
      "Roast partly and massage the leaves onto the body", 
      "Squeeze, rub, and massage the leaves onto the body", 
      "Soak in water", 
      "Boil with water, drink thrice a day", 
      "Boil with water, drink thrice a day", 
      "Roast partly, squeeze, rub, or massage the leaves into the body", 
      "Roast partly, squeeze, rub, or massage the leaves into the body"
    ] ,
    "image": "images/gabon.jpg"
  },
  { 
    "id": 8,
    "name": "Tanglad", 
    "scientificName": "Cymbopogon citratus", 
    "diseases": ["High Blood Pressure (Hypertension)", "Toothache"], 
    "procedures": ["Boil with water, drink thrice a day", "Crush or boil with water, put on decaying tooth"] ,
    "image": "images/tanglad.jpg"
  },
  { 
    "id": 9,
    "name": "Kalawag", 
    "scientificName": "Curcuma longa", 
    "diseases": [
      "High Blood Pressure (Hypertension)", 
      "Rheumatoid", 
      "Diarrhea", 
      "Flatulence (Panuhot)", 
      "Arthritis", 
      "Abdominal Pain"
    ], 
    "procedures": [
      "Boil with water, drink thrice a day", 
      "Pound and extract juice and apply directly to affected area", 
      "Boil with water, drink thrice a day", 
      "Boil with water, drink thrice a day", 
      "Boil with water, drink thrice a day", 
      "Boil with water, drink thrice a day"
    ],
    "image": "images/Kalawag.jpg" 
  },
  { 
    "id": 10,
    "name": "Limon", 
    "scientificName": "Citrus reticulata", 
    "diseases": ["High Blood Pressure (Hypertension)", "Cough"], 
    "procedures": ["Boil with water, drink thrice a day", "Partially roast, then squeeze and drink the juice"] ,
    "image": "images/limon.gif"
  },
  { 
    "id": 11,
    "name": "Panyawan", 
    "scientificName": "Tinospora rumphii", 
    "diseases": ["High Blood Pressure (Hypertension)", "High Blood Pressure (Hypertension)"], 
    "procedures": ["Extract the juice and drink", "Soak it in water and drink"] ,
    "image": "images/panyawan.jpg"
  },
  { 
    "id": 12,
    "name": "Atis", 
    "scientificName": "Annona squamosa L.", 
    "diseases": ["High Blood Pressure (Hypertension)", "Rheumatoid", "Diarrhea"], 
    "procedures": [
      "Decoction", 
      "Boil with water, drink thrice a day", 
      "Boil with water, drink thrice a day"
    ] ,
    "image": "images/atis.webp"
  },
  { 
    "id": 13,
    "name": "Orchids", 
    "scientificName": " Orchidaceae family", 
    "diseases": ["Heart Problems"], 
    "procedures": ["Soak in water"] ,
    "image": "images/orchids.jpg"
  },
  { 
    "id": 14,
    "name": "Blue ternate (Blue pea)", 
    "scientificName": "Clitoria ternatea", 
    "diseases": ["Heart Problems"], 
    "procedures": ["Soak in lukewarm water"] ,
    "image": "images/blue ternate.jpeg"
  },
  { 
    "id": 15,
    "name": "Kalabo", 
    "scientificName": "Coleus amboinicus", 
    "diseases": ["Cough", "Cough", "Cough", "Cough"], 
    "procedures": [
      "Boil in water then inhale steam", 
      "Soak in lukewarm water then drink", 
      "Roast or heat, squeeze to extract juice, then drink", 
      "Roast partly and squeeze, drink the sap or juice thrice a day"
    ] ,
    "image": "images/kalabo.jpeg"
  },
  { 
    "id": 16,
    "name": "Mayana", 
    "scientificName": "Plectranthus scutellarioides", 
    "diseases": ["Cough", "Cough", "Wound", "Sinusitis", "Bruises", "Cough"], 
    "procedures": [
      "Decoction",
      "Roast, extract juice with liniment oil and apply to the whole body",
      "Pound until become soft and juicy, apply directly or topically",
      "Roast partly and apply/put over the forehead while still hot",
      "Pound until become soft and juicy, apply directly or topically",
      "Roast, extract juice with liniment oil and apply to the whole body"
    ] ,
    "image": "images/mayana.jpg"
  },
  { 
    "id": 17,
    "name": "Buyo", 
    "scientificName": "Piper siriboa L.", 
    "diseases": ["Cough"], 
    "procedures": ["Place on the back"] ,
    "image": "images/buyo.jpeg"
  },
  { 
    "id": 18,
    "name": "Angelica", 
    "scientificName": "Angelica archangelica", 
    "diseases": ["Cough", "Cough"], 
    "procedures": [
      "Place on the back", 
      "Heat or roast, then inhale"
    ] ,
    "image": "images/angelica.jpeg"
  },
  { 
    "id": 19,
    "name": "Kisol", 
    "scientificName": "Lycoris squamigera", 
    "diseases": ["Cough"], 
    "procedures": ["Soak in lukewarm water"] ,
    "image": "images/kisol.jpg"
  },
  { 
    "id": 20,
    "name": "Yahong yahong", 
    "scientificName": "Centella asiatica", 
    "diseases": ["Cough"], 
    "procedures": ["Roast, extract juice with liniment oil and apply to the whole body"] ,
    "image": "images/yahong yahong.jpg"
  },
  { 
    "id": 21,
    "name": "Atay Atay", 
    "scientificName": "Graptophyllum pictum", 
    "diseases": ["Cough"], 
    "procedures": ["Roast, extract juice with liniment oil and apply to the whole body"] ,
    "image": "images/atay.jpeg"
  },
  { 
    "id": 22,
    "name": "Herba Buena", 
    "scientificName": "Mentha × piperita", 
    "diseases": ["Cough"], 
    "procedures": ["Roast, extract juice with liniment oil and apply to the whole body"] ,
    "image": "images/herba buena.webp"
  },
  { 
    "id": 23,
    "name": "Bangat", 
    "scientificName": "Eleusine indica", 
    "diseases": ["Cough"], 
    "procedures": ["Heat then inhale steam"] ,
    "image": "images/bangat.jpeg"
  },
  { 
    "id": 24,
    "name": "Ganda", 
    "scientificName": "Allium schoenoprasum", 
    "diseases": ["Cough"], 
    "procedures": ["Roast, extract juice with liniment oil and apply to the whole body"] ,
    "image": "images/ganda.jpeg"
  },
  { 
    "id": 25,
    "name": "Dahon Atsuete", 
    "scientificName": "Bixa orellana", 
    "diseases": ["Cough"], 
    "procedures": ["Place on the back"] ,
    "image": "images/dahon atsuete.jpg"
  },
  { 
    "id": 26,
    "name": "Lemonsito", 
    "scientificName": "Triphasia trifolia", 
    "diseases": ["Cough"], 
    "procedures": ["Roast then extract juice and place on the head"] ,
    "image": "images/lemonsito.jpeg"
  },
  { 
    "id": 27,
    "name": "Lagundi", 
    "scientificName": "Vitex negundo", 
    "diseases": ["Cough", "Acid Reflux (Kabuhi)"], 
    "procedures": [
      "Extract and drink", 
      "Drink decoction, thrice a day"
    ] ,
    "image": "images/lagundi.jpg"
  },
  { 
    "id": 28,
    "name": "Pisaw-pisaw", 
    "scientificName": "Emilia sonchifolia", 
    "diseases": ["Cough"], 
    "procedures": ["Roast, extract juice, then drink"] ,
    "image": "images/pisaw.gif"
  },
  { 
    "id": 29,
    "name": "Dila sa iro", 
    "scientificName": "Pseudoelephantopus spicatus(Juss.) Rohr.", 
    "diseases": ["Cough"], 
    "procedures": ["Boil with water, drink thrice a day"] ,
    "image": "images/dila-sa-iro.jpg"
  },
  { 
    "id": 30,
    "name": "Luy-a", 
    "scientificName": "Zingiber officinale", 
    "diseases": ["Cough", "Sore Throat"], 
    "procedures": [
      "Pound and press to extract the sap, then drink it", 
      "Cut into small pieces and use as lozenges (candy), keeping them in the mouth for several hours"
    ] ,
    "image": "images/luy-a.jpeg"
  },
  { 
    "id": 31,
    "name": "Anonang", 
    "scientificName": "Cordia dichotoma", 
    "diseases": ["Tuberculosis"], 
    "procedures": ["Boil with water, drink thrice a day"] ,
    "image": "images/anonang.jpeg"
  },
  { 
    "id": 32,
    "name": "Sedocaw", 
    "scientificName": "Caesalpinia sappan", 
    "diseases": ["Tuberculosis"], 
    "procedures": ["Boil with water, drink thrice a day"] ,
    "image": "images/sedocaw.jpeg"
  },
  { 
    "id": 33,
    "name": "Abaka", 
    "scientificName": "Musa textilis", 
    "diseases": ["Fever", "Wound", "Diarrhea", "Relapse (Bughat)"], 
    "procedures": [
      "Place on the forehead and back", 
      "Extract the juice and put directly on the wound", 
      "Extract juice then drink", 
      "Drink decoction"
    ] ,
    "image": "images/abaka.jpg"
  },
  { 
    "id": 34,
    "name": "Saging", 
    "scientificName": "Musa paradisiaca Linn", 
    "diseases": ["Fever", "High Blood Pressure (Hypertension)", "Wound"], 
    "procedures": [
      "Place on the forehead and back", 
      "Decoction", 
      "Pound until become soft and juicy, squeeze the juice over the wound and apply bandage"
    ] ,
    "image": "images/saging.jpg"
  },
  { 
    "id": 35,
    "name": "Tae sa Talapan", 
    "scientificName": "Lindheimera texana", 
    "diseases": ["Fever", "Headache"], 
    "procedures": [
      "Pound, put in forehead with a piece of cloth or 'hampol'", 
      "Pound, put in forehead with a piece of cloth or 'hampol'"
    ] ,
    "image": "images/tae sa talapan.jpg"
  },
  { 
    "id": 36,
    "name": "Agutay", 
    "scientificName": "Musa acuminata", 
    "diseases": ["Fever"], 
    "procedures": ["Place on the forehead and back"] ,
    "image": "images/agutay.jpg"
  },
  { 
    "id": 37,
    "name": "Ugapong", 
    "scientificName": " Ficus pseudopalma", 
    "diseases": ["Fever"], 
    "procedures": ["Place on the forehead and back"] ,
    "image": "images/ugapong.jpg"
  },
  { 
    "id": 38,
    "name": "Abihid", 
    "scientificName": "Spondias mombin", 
    "diseases": ["Fever"], 
    "procedures": ["Scrape, squeeze to extract juice, then drink"] ,
    "image": "images/abihid.jpg"
  },
  { 
    "id": 39,
    "name": "Tawa tawa", 
    "scientificName": "Euphorbia hirta", 
    "diseases": ["Fever"], 
    "procedures": ["Drink decoction"] ,
    "image": "images/tawatawa.jpg"
  },
  { 
    "id": 40,
    "name": "Malunggay", 
    "scientificName": "Moringa oleifera", 
    "diseases": ["Wound"], 
    "procedures": ["Extract the juice and put directly on the wound"] ,
    "image": "images/malunggay.jpg"
  },
  { 
    "id": 41,
    "name": "Bayabas", 
    "scientificName": "Psidium guajava", 
    "diseases": ["Wound", "Wound", "Stomachache", "Diarrhea"], 
    "procedures": [
      "Boil with water and use to bathe or wash the wound", 
      "Boil in water and use as an antiseptic wash", 
      "Drink decoction", 
      "Boil with water, drink thrice a day"
    ] ,
    "image": "images/bayabas.jpg"
  },
  { 
    "id": 42,
    "name": "Moti moti", 
    "scientificName": "Mikania cordata", 
    "diseases": ["Wound"], 
    "procedures": ["Extract the juice and put directly on the wound"] ,
    "image": "images/moti.jpg"
  },
  { 
    "id": 43,
    "name": "Banog", 
    "scientificName": "Pseudodracontium laciniatum", 
    "diseases": ["Wound"], 
    "procedures": ["Extract the juice and put directly on the wound"] ,
    "image": "images/banog.jpg"
  },
  { 
    "id": 44,
    "name": "Linggagapas", 
    "scientificName": "Erechtites valerianifolius", 
    "diseases": ["Wound"], 
    "procedures": ["Extract the juice and put directly on the wound"] ,
    "image": "images/linggagapas.jpg"
  },
  { 
    "id": 45,
    "name": "Hagonoy", 
    "scientificName": "Chromolaena odorata", 
    "diseases": ["Wound"], 
    "procedures": ["Pound, apply directly"] ,
    "image": "images/hagonoy.jpg"
  },
  { 
    "id": 46,
    "name": "Kataka-taka", 
    "scientificName": "Kalanchoe pinnata (Lam.) Pers.", 
    "diseases": ["Wound"], 
    "procedures": ["Pound and apply directly"] ,
    "image": "images/katakataka.jpeg"
  },
  { 
    "id": 47,
    "name": "Duknay", 
    "scientificName": "Sellaginella oregano and Sellaginella moellendorffii", 
    "diseases": ["Wound"], 
    "procedures": ["Pound and apply the sap directly to fresh wounds or cuts"] ,
    "image": "images/duknay.jpeg"
  },
  { 
    "id": 48,
    "name": "Kanding-kanding", 
    "scientificName": "Verbena officinalis", 
    "diseases": ["Wound", "Ulcers"], 
    "procedures": [
      "Pound until it becomes soft and juicy, apply directly or topically",
      "Pound until it becomes soft and juicy, apply directly or topically"
    ] ,
    "image": "images/kanding-kanding.jpg"
  },
  { 
    "id": 49,
    "name": "Kadabudabo", 
    "scientificName": "Alternanthera sessilis", 
    "diseases": ["Wound"], 
    "procedures": ["Peel off the bark, scrape the stem until soft and juicy, then apply directly to the affected area"] ,
    "image": "images/kadabudabo.jpg"
  },
  { 
    "id": 50,
    "name": "Kahugas", 
    "scientificName": "Psychotria nervosa", 
    "diseases": ["Acid Reflux (Kabuh)"], 
    "procedures": ["Drink decoction"] ,
    "image": "images/kahugas.jpeg"
  },
  { 
    "id": 51,
    "name": "Abukado", 
    "scientificName": "Persea americana", 
    "diseases": ["Stomachache", "Vertigo"], 
    "procedures": [
      "Drink decoction", 
      "Boil with water, drink thrice a day"
    ] ,
    "image": "images/abukado.jpg"
  },
  { 
    "id": 52,
    "name": "Hilbas", 
    "scientificName": "Artemisia vulgaris", 
    "diseases": ["Stomachache"], 
    "procedures": ["Roast partly, squeeze, drink the sap"] ,
    "image": "images/hilbas.jpg"
  },
  { 
    "id": 53,
    "name": "Sunflower", 
    "scientificName": "Helianthus annuus", 
    "diseases": ["Stomachache"], 
    "procedures": ["Heat and place on the stomach"] ,
    "image": "images/sunflower.jpeg"
  },
  { 
    "id": 54,
    "name": "Tuway-tuway or Kadagom", 
    "scientificName": "Bidens pilosa", 
    "diseases": ["Stomachache", "Diarrhea"], 
    "procedures": [
      "Roast partly, squeeze, drink the sap", 
      "Roast partly, squeeze, drink the sap"
    ] ,
    "image": "images/tuway-tuway.jpg"
  },
  { 
    "id": 55,
    "name": "Dunggano", 
    "scientificName": "Pandanus odorifer", 
    "diseases": ["Stomachache"], 
    "procedures": ["Heat and place on the stomach"] ,
    "image": "images/dunggano.jpeg"
  },
  { 
    "id": 56,
    "name": "Salapanti", 
    "scientificName": "-", 
    "diseases": ["Stomachache"], 
    "procedures": ["Heat and place on the stomach"] ,
    "image": "images/logo.jpg"
  },
  { 
    "id": 57,
    "name": "Manumbilan", 
    "scientificName": "-", 
    "diseases": ["Stomachache"], 
    "procedures": ["Drink decoction"] ,
    "image": "images/logo.jpg"
  },
  { 
    "id": 58,
    "name": "Mahogany", 
    "scientificName": "Swietenia macrophylla", 
    "diseases": ["Stomachache"], 
    "procedures": ["Chew and swallow the juice or sap"] ,
    "image": "images/mahogany.png"
  },
  { 
    "id": 59,
    "name": "Tuba-tuba", 
    "scientificName": "Jatropha curcas", 
    "diseases": ["Mild Stroke", "Arthritis"], 
    "procedures": [
      "Roast partly, scrape, squeeze and rub or massage on the body", 
      "Roast partly, scrape, apply directly on joints with a cloth or 'hampol'"
    ]  ,
    "image": "images/physic nut.jpeg"
  },
  { 
    "id": 60,
    "name": "Kapayas", 
    "scientificName": "Carica papaya", 
    "diseases": ["Tonsillitis"], 
    "procedures": ["Toast, apply on the neck wrapped with a piece of cloth or (hampol)"]  ,
    "image": "images/papaya.png"
  },
  { 
    "id": 61,
    "name": "Tongao", 
    "scientificName": "Artemisia vulgaris", 
    "diseases": ["Wound"], 
    "procedures": ["Pound and extract juice and put directly on the wound"]  ,
    "image": "images/tongao.jpeg"
  },
  { 
    "id": 62,
    "name": "Ipil-ipil", 
    "scientificName": "Leucaena leucocephala", 
    "diseases": ["Dysentery", "Expel intestinal parasites or worms"], 
    "procedures": ["Chew and directly eat", "Chew and directly eat"]  ,
    "image": "images/lead tree.jpg"
  },
  { 
    "id": 63,
    "name": "Tabako", 
    "scientificName": "Nicotiana tabacum", 
    "diseases": ["Toothache"], 
    "procedures": ["Chew and keep in the mouth for several hours"]  ,
    "image": "images/tabako.jpg"
  },
  { 
    "id": 64,
    "name": "Bagalbal", 
    "scientificName": "Piper porphyroneuria", 
    "diseases": ["Toothache"], 
    "procedures": ["Chew and keep in the mouth for several hours"]  ,
    "image": "images/bagalbal.jpg"
  },
  { 
    "id": 65,
    "name": "Narra/Tagok", 
    "scientificName": "Pterocarpus indicus", 
    "diseases": ["Swollen Gums"], 
    "procedures": ["Scrape and squeeze the sap, apply directly on gums"]  ,
    "image": "images/narra.jpg"
  },
  { 
    "id": 66,
    "name": "Kogon", 
    "scientificName": "Imperata cylindrica", 
    "diseases": ["Urination"], 
    "procedures": ["Boil with water, drink thrice a day"]  ,
    "image": "images/cogon.webp"
  },
  { 
    "id": 67,
    "name": "Mais", 
    "scientificName": "Zea mays", 
    "diseases": ["Urination"], 
    "procedures": ["Boil with water, drink thrice a day"]  ,
    "image": "images/corn.webp"
  },
  { 
    "id": 68,
    "name": "Antuwanga", 
    "scientificName": "Hibiscus rosasinensis L.", 
    "diseases": ["Bruises"], 
    "procedures": ["Pound until become soft and juicy, apply directly or topically"]  ,
    "image": "images/chinese hibiscus.jpeg"
  },
  { 
    "id": 69,
    "name": "Hagimit", 
    "scientificName": "Ficus minahassae", 
    "diseases": ["Bruises"], 
    "procedures": ["Roast, pound, mix with oil, apply directly"]  ,
    "image": "images/hagimit.webp"
  },
  { 
    "id": 70,
    "name": "Mantawasi", 
    "scientificName": "Costus igneus", 
    "diseases": ["Sore eyes"], 
    "procedures": ["Scrape the stem and squeeze out the sap or juice into the eyes"]  ,
    "image": "images/fiery costus.webp"
  },
  { 
    "id": 71,
    "name": "Hanapol", 
    "scientificName": "Poikilospermum suaveolens", 
    "diseases": ["Sore eyes"], 
    "procedures": ["Cut a portion of the stem to extract the latex or sap, then apply or drop it into the eyes"]  ,
    "image": "images/hanapol.jpg"
  },
  { 
    "id": 72,
    "name": "Lanagon", 
    "scientificName": "Flacourtia rukam", 
    "diseases": ["Ulcers", "Anemia"], 
    "procedures": ["Drink decoction, thrice a day", "Drink decoction, thrice a day"]  ,
    "image": "images/governor_s plum.webp"
  },
  { 
    "id": 73,
    "name": "Sili", 
    "scientificName": "Capsicum frutescens", 
    "diseases": ["Asthma Attack"], 
    "procedures": ["Pound and rub on chest"]  ,
    "image": "images/sili.jpe"
  }
]);

// Sorting plants alphabetically
const sortedPlants = computed(() => {
  return [...plants.value].sort((a, b) => a.name.localeCompare(b.name));
});

// Filter plants based on search query
const filteredPlants = computed(() => {
  if (!sortedPlants.value || sortedPlants.value.length === 0) return [];
  if (!searchQuery.value) return sortedPlants.value;
  return sortedPlants.value.filter((plant) =>
    plant.name.toLowerCase().startsWith(searchQuery.value.toLowerCase())
  );
});

// Highlight matching plants
const isHighlighted = (plant) => {
  return searchQuery.value && plant.name.toLowerCase().startsWith(searchQuery.value.toLowerCase());
};

// Handle plant selection for pop-up
const selectPlant = (plant) => {
  selectedPlant.value = plant;
};
const closeModal = () => {
  selectedPlant.value = null;
};
</script>
