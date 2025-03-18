<template>
  <div class="container1">
    <!-- Back Button -->
    <div class="back-button">
      <button @click="goBack">Back to search</button>
    </div>

    <div class="main-content">
      <!-- Left Section: User Input -->
      <div class="left-panel">
        <h2>USER'S INPUT:</h2>
        <p class="disease-name"> > <span >{{ selectedDisease }}</span> < </p>

        <table class="plant-table">
          <thead>
            <tr>
              <th>Ethno-medicinal Plants</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="plant in filteredPlants" 
              :key="plant.id" 
              @click="selectPlant(plant)" 
              :class="{ active: selectedPlant && selectedPlant.id === plant.id }"
            >
              <td>{{ plant.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Right Section: Plant Recommendation -->
      <div class="right-panel">
        <h2>PLANT RECOMMENDATION</h2>

        <div class="plant-info">
          <div class="plant-image">
            <img :src="selectedPlant?.image" :alt="selectedPlant?.name" class="plant-img" />
          </div>

          <div class="plant-details">
            <p><strong>Local Name:</strong> {{ selectedPlant?.name || '---' }}</p>
            <p><strong>Common Name:</strong> {{ selectedPlant?.commonName || '---' }}</p>
            <p><strong>Scientific Name:</strong> {{ selectedPlant?.scientificName || '---' }}</p>
          </div>
        </div>

        <div class="procedures">
          <h3>PROCEDURES</h3>
          <template v-if="selectedPlant">
            <table v-if="selectedPlant?.preparation && selectedPlant?.mode" class="plant-table">
              <thead>
                <tr>
                  <th>Preparation</th>
                  <th>Mode</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(prep, index) in selectedPlant.preparation" :key="index">
                  <td>{{ prep }}</td>
                  <td>
                    <span v-if="Array.isArray(selectedPlant.mode)">
                      {{ selectedPlant.mode[index] || selectedPlant.mode[selectedPlant.mode.length - 1] }}
                    </span>
                    <span v-else>
                      {{ selectedPlant.mode }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p>Rule Number: {{ selectedPlant?.rule || '---' }}</p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// List of diseases and plants
const diseases = ref([
{
  id: 1,
  name: "High Blood Pressure",
  plants: [
    { id: 1, rule: 1, name: "Salumayag", commonName: "-", scientificName: "Agathis philippinensis", preparation: ["Decoction"], mode: ["Oral"], image: "/images/salumayag.jpg", frequency: "30" },
    { id: 2, rule: 2, name: "Alingatong", commonName: "Stinging Nettle", scientificName: "Urtica dioica L.", preparation: ["Decoction"], mode: ["Oral"], image: "/images/alinggatong.jpg", frequency: "28" },
    { id: 3, rule: 3, name: "Saging", commonName: "Banana", scientificName: "Musa paradisiaca Linn", preparation: ["Decoction"], mode: ["Ophthalmic"], image: "/images/saging.jpg", frequency: "19" },
    { id: 4, rule: 4, name: "Butterfly Pea", commonName: "Butterfly Pea", scientificName: "Clitoria ternatea", preparation: ["Soak in lukewarm water"], mode: ["Oral"], image: "/images/butterflypea.jpg", frequency: "15" },
    { id: 5, rule: 5, name: "Sayote", commonName: "Chayote", scientificName: "Sechium edule", preparation: ["Decoction"], mode: ["Oral"], image: "/images/sayote.jpeg", frequency: "25" },
    { id: 6, rule: 6, name: "Betel Nut Palm", commonName: "Betel Nut Palm", scientificName: "Areca catechu", preparation: ["Decoction"], mode: ["Oral"], image: "/images/betel nut.jpg", frequency: "12" },
    { id: 7, rule: 7, name: "Ahos", commonName: "Garlic", scientificName: "Allium sativum L.", preparation: ["Chew and eaten raw"], mode: ["Oral (Chew)"], image: "/images/ahos.jpeg", frequency: "27" },
    { id: 8, rule: 8, name: "Gabon/Pahid", commonName: "-", scientificName: "Blumea balsamifera", preparation: ["Roast partly and massage the leaves onto the body", "Squeeze, rub and massage the leaves onto the body"], mode: ["Transdermal", "Transdermal"], image: "/images/gabon.jpg", frequency: "24" },
    { id: 10, rule: 9, name: "Tanglad", commonName: "Lemongrass", scientificName: "Cymbopogon citratus", preparation: ["Boil with water, drink thrice a day"], mode: ["Oral"], image: "/images/tanglad.jpg", frequency: "23" },
    { id: 11, rule: 10, name: "Kalawag", commonName: "Turmeric", scientificName: "Curcuma longa", preparation: ["Boil with water, drink thrice a day"], mode: ["Oral"], image: "/images/kalawag.jpg", frequency: "24" },
    { id: 12, rule: 11, name: "Limon", commonName: "Mandarin Orange", scientificName: "Citrus reticulata", preparation: ["Boil with water, drink thrice a day"], mode: ["Oral"], image: "/images/limon.gif", frequency: "19" },
    { id: 13, rule: 12, name: "Salumayag", commonName: "Almaciga", scientificName: "Almaciga recin", preparation: ["Decoction"], mode: ["Oral"], image: "/images/salumayag.jpg", frequency: "22" },
    { id: 14, rule: 13, name: "Panyawan", commonName: "Wormwood", scientificName: "Artemisia absinthium", preparation: ["Extract the juice and drink", "Soak it in water and drink"], mode: ["Oral", "Oral"], image: "/images/panyawan.jpg", frequency: "26" },
    { id: 16, rule: 14, name: "Atis", commonName: "Sugar Apple", scientificName: "Annona squamosa L.", preparation: ["Boil with water, drink thrice a day"], mode: ["Oral"], image: "/images/atis.webp", frequency: "18" }
  		]
  },
{
  id: 2,
  name: "Heart problems",
  plants: [
	{ id: 17, rule: 15, name: "Alingatong", commonName: "Stinging Nettle", scientificName: "Urtica dioica", preparation: ["Decoction"], mode: ["Oral"], image: "/images/alinggatong.jpg", frequency: "29" },
	{ id: 18, rule: 16, name: "Orchids", commonName: "Orchids", scientificName: "Orchidaceae family", preparation: ["Soak in water"], mode: ["Oral"], image: "/images/orchids.jpg", frequency: "20" },
	{ id: 19, rule: 17, name: "Blue ternate (Blue pea)", commonName: "Blue ternate (Blue pea)", scientificName: "Clitoria ternatea", preparation: ["Soak in lukewarm water"], mode: ["Oral"], image: "/images/blue ternate.jpEg", frequency: "25" }
		]
},
{
  id: 3,
  name: "Cough",
  plants: [
  { 
    id: 20, 
    rule: 18, 
    name: "Kalabo", 
    commonName: "Oregano", 
    scientificName: "Coleus amboinicus", 
    preparation: [
      "Boil in water then inhale steam",
      "Soak in lukewarm water then drink",
      "Roast or heat, squeeze to extract juice, then drink",
      "Roast partly and squeeze, drink the sap or juice thrice a day"
    ], 
    mode: ["Inhalation, Oral", "Inhalation, Oral", "Inhalation, Oral", "Oral"] , image: "/images/kalabo.jpeg", frequency: "28"
  },
  { 
    id: 21, 
    rule: 19, 
    name: "Mayana", 
    commonName: "Coleus", 
    scientificName: "Plectranthus scutellarioides", 
    preparation: [
      "Decoction",
      "Roast, extract juice with liniment oil and apply to the whole body"
    ], 
    mode: ["Oral", "Transdermal"] , image: "/images/mayana.jpg", frequency: "25"
  },
  { 
    id: 22, 
    rule: 20, 
    name: "Gabon", 
    commonName: "Sambong", 
    scientificName: "Blumea balsamifera", 
    preparation: [
      "Soak in water",
      "Boil with water, drink thrice a day"
    ], 
    mode: ["Oral", "Oral"] , image: "/images/gabon.jpg", frequency: "30"
  },
  { 
    id: 23, 
    rule: 21, 
    name: "Sili", 
    commonName: "Bell pepper", 
    scientificName: "Capsicum annuum", 
    preparation: [
      "Roast, extract juice with liniment oil and apply to the whole body"
    ], 
    mode: ["Transdermal"] , image: "/images/sili.jpe", frequency: "20"
  },
  { 
    id: 24, 
    rule: 22, 
    name: "Buyo", 
    commonName: "Betel pepper", 
    scientificName: "Piper siriboa L.", 
    preparation: [
      "Place on back"
    ], 
    mode: ["Transdermal"] , image: "/images/buyo.jpeg", frequency: "18"
  },
  { 
    id: 25, 
    rule: 23, 
    name: "Angelica", 
    commonName: "Angelica", 
    scientificName: "Angelica archangelica", 
    preparation: [
      "Place on the back",
      "Heat or roast, then inhale"
    ], 
    mode: ["Transdermal", "Inhalation"] , image: "/images/angelica.jpeg", frequency: "3"
  },
  { 
    id: 26, 
    rule: 24, 
    name: "Kisol", 
    commonName: "Surprise lily", 
    scientificName: "Lycoris squamigera", 
    preparation: [
      "Soak in lukewarm water"
    ], 
    mode: ["Oral"] , image: "/images/kisol.jpg", frequency: "5"
  },
  { 
    id: 27, 
    rule: 25, 
    name: "Yahong yahong", 
    commonName: "Pennywort", 
    scientificName: "Centella asiatica", 
    preparation: [
      "Roast, extract juice with liniment oil and apply to the whole body"
    ], 
    mode: ["Transdermal"] , image: "/images/yahong yahong.jpg", frequency: "5"
  },
  { 
    id: 28, 
    rule: 26, 
    name: "Atay-atay", 
    commonName: "Caricature plant", 
    scientificName: "Graptophyllum pictum", 
    preparation: [
      "Roast, extract juice with liniment oil and apply to the whole body"
    ], 
    mode: ["Transdermal"] , image: "/images/atay.jpeg", frequency: "6"
  },
  { 
    id: 29, 
    rule: 27, 
    name: "Herba buena", 
    commonName: "Peppermint", 
    scientificName: "Mentha x piperita", 
    preparation: [
      "Roast, extract juice with liniment oil and apply to the whole body"
    ], 
    mode: ["Transdermal"] , image: "/images/herba buena.webp", frequency: "7"
  },
  { 
    id: 30, 
    rule: 28, 
    name: "Bangat", 
    commonName: "Goose grass", 
    scientificName: "Eleusine indica", 
    preparation: ["Heat then inhale steam"], 
    mode: ["Inhalation"] , image: "/images/bangat.jpeg", frequency: "8"
  },
  { 
    id: 31, 
    rule: 29, 
    name: "Ganda", 
    commonName: "Chives", 
    scientificName: "Allium schoenoprasum", 
    preparation: ["Roast, extract juice with liniment oil and apply to the whole body"], 
    mode: ["Transdermal"] , image: "/images/ganda.jpeg", frequency: "4"
  },
  { 
    id: 32, 
    rule: 30, 
    name: "Dahon atsuete", 
    commonName: "Annatto", 
    scientificName: "Bixa orellana", 
    preparation: ["Place on the back"], 
    mode: ["Transdermal"] , image: "/images/dahon atsuete.jpg", frequency: "4"
  },
  { 
    id: 33, 
    rule: 31, 
    name: "Lemonsito", 
    commonName: "Lime Berry", 
    scientificName: "Triphasia trifolia", 
    preparation: ["Roast then extract juice and place on the head"], 
    mode: ["Transdermal"] , image: "/images/lemonsito.jpeg", frequency: "14"
  },
  { 
    id: 34, 
    rule: 32, 
    name: "Lagundi", 
    commonName: "Chaste Tree", 
    scientificName: "Vitex agnus-castus", 
    preparation: ["Extract"], 
    mode: ["Oral"] , image: "/images/lagundi.jpg", frequency: "23"
  },
  { 
    id: 35, 
    rule: 33, 
    name: "Pisaw-pisaw", 
    commonName: "Lilac Tasselflower", 
    scientificName: "Emilia sonchifolia", 
    preparation: ["Roast, extract juice, then drink"], 
    mode: ["Oral"] , image: "/images/pisaw.gif", frequency: "4"
  },
  { 
    id: 36, 
    rule: 34, 
    name: "Dila-sa-iro", 
    commonName: "Tobacco weed", 
    scientificName: "Pseudoelephantopus spicatus (Juss.) Rohr.", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/dila-sa-iro.jpg", frequency: "2"
  },
  { 
    id: 37, 
    rule: 35, 
    name: "Luy-a", 
    commonName: "Ginger", 
    scientificName: "Zingiber officinale Roscoe", 
    preparation: ["Pound and press to extract the sap, then drink it"], 
    mode: ["Oral"] , image: "/images/luy-a.jpeg", frequency: "19"
  },
  { 
    id: 38, 
    rule: 36, 
    name: "Limon", 
    commonName: "Chinese orange", 
    scientificName: "Citrus microcarpa", 
    preparation: ["Partially roast, then squeeze and drink the juice"], 
    mode: ["Oral"] , image: "/images/limon.gif", frequency: "15"
  }
]
},
{
  id: 4,
  name: "Tuberculosis",
  plants: [
  { 
    id: 39, 
    rule: 37, 
    name: "Anonang", 
    commonName: "Glue Berry", 
    scientificName: "Cordia dichotoma", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/anonang.jpeg", frequency: "28"
  },
  { 
    id: 40, 
    rule: 38, 
    name: "Sedocaw", 
    commonName: "Sappanwood", 
    scientificName: "Caesalpinia sappan", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/sedocaw.jpeg", frequency: "25"
  }
]
},
{
  id: 5,
  name: "Fever",
  plants: [
  { 
    id: 41, 
    rule: 39, 
    name: "Abaka", 
    commonName: "Abaca", 
    scientificName: "Musa textilis", 
    preparation: ["Place on the forehead and back"], 
    mode: ["Transdermal"] , image: "/images/abaka.jpg", frequency: "29"
  },
  { 
    id: 42, 
    rule: 40, 
    name: "Saging", 
    commonName: "Banana", 
    scientificName: "Musa paradisiaca Linn", 
    preparation: ["Place on the forehead and back"], 
    mode: ["Transdermal"] , image: "/images/saging.jpg", frequency: "20"
  },
  { 
    id: 43, 
    rule: 41, 
    name: "Tae sa talapan", 
    commonName: "Texas Yellowstar", 
    scientificName: "Lindheimera texana", 
    preparation: ["Pound, put in forehead with a piece of cloth or (hampol)"], 
    mode: ["Transdermal"], image: "/images/tae sa talapan.jpg", frequency: "25"
  },
  { 
    id: 44, 
    rule: 42, 
    name: "Agutay", 
    commonName: "Wild Banana", 
    scientificName: "Musa acuminata", 
    preparation: ["Place on the forehead and back"], 
    mode: ["Transdermal"] , image: "/images/agutay.jpg", frequency: "28"
  },
  { 
    id: 45, 
    rule: 43, 
    name: "Ugapong", 
    commonName: "Philippine Fig", 
    scientificName: "Ficus pseudopalma", 
    preparation: ["Place on the forehead and back"], 
    mode: ["Transdermal"] , image: "/images/ugapong.jpg", frequency: "20"
  },
  { 
    id: 46, 
    rule: 44, 
    name: "Abihid", 
    commonName: "Hog Plum", 
    scientificName: "Spondias mombin", 
    preparation: ["Scrape, squeeze to extract juice, then drink"], 
    mode: ["Oral"] , image: "/images/abihid.jpg", frequency: "19"
  },
  { 
    id: 47, 
    rule: 45, 
    name: "Tawa-tawa", 
    commonName: "Asthma Weed", 
    scientificName: "Euphorbia hirta", 
    preparation: ["Drink decoction"], 
    mode: ["Oral"] , image: "/images/tawatawa.jpg", frequency: "27"
  },
  { 
    id: 48, 
    rule: 46, 
    name: "Gabon/Pahid", 
    commonName: "Camphor Plant", 
    scientificName: "Blumea balsamifera", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/gabon.jpg", frequency: "27"
  }
]
},
{
  id: 6,
  name: "Wound",
  plants: [
  { 
    id: 49, 
    rule: 47, 
    name: "Abaka", 
    commonName: "Abaca", 
    scientificName: "Musa textilis", 
    preparation: ["Extract the juice and put directly on the wound"], 
    mode: ["Topical"] , image: "/images/abaka.jpg", frequency: "29"
  },
  { 
    id: 50, 
    rule: 48, 
    name: "Malunggay", 
    commonName: "Malunggay", 
    scientificName: "Moringa oleifera", 
    preparation: ["Extract the juice and put directly on the wound"], 
    mode: ["Topical"] , image: "/images/malunggay.jpg", frequency: "20"
  },
  { 
    id: 51, 
    rule: 49, 
    name: "Bayabas", 
    commonName: "Guava", 
    scientificName: "Psidium guajava", 
    preparation: ["Boil with water and use to bathe or wash the wound"], 
    mode: ["Topical"] , image: "/images/bayabas.jpg", frequency: "23"
  },
  { 
    id: 52, 
    rule: 50, 
    name: "Moti moti", 
    commonName: "Heartleaf Hempvine", 
    scientificName: "Mikania cordata", 
    preparation: ["Extract the juice and put directly on the wound"], 
    mode: ["Topical"] , image: "/images/moti.jpg", frequency: "17"
  },
  { 
    id: 53, 
    rule: 51, 
    name: "Banog", 
    commonName: "False Elephant's Foot", 
    scientificName: "Pseuderanthemum laciniatum", 
    preparation: ["Extract the juice and put directly on the wound"], 
    mode: ["Topical"] , image: "/images/banog.jpg", frequency: "19"
  },
  { 
    id: 54, 
    rule: 52, 
    name: "Linggagapas", 
    commonName: "Tropical Burnweed", 
    scientificName: "Erechtites valerianifolius", 
    preparation: ["Extract the juice and put directly on the wound"], 
    mode: ["Topical"] , image: "/images/linggagapas.jpg", frequency: "15"
  },
  { 
    id: 55, 
    rule: 53, 
    name: "Tongao", 
    commonName: "Mugwort", 
    scientificName: "Artemisia vulgaris", 
    preparation: ["Pound and extract juice and put directly on the wound"], 
    mode: ["Topical"] , image: "/images/tongao.jpeg", frequency: "14"
  },
  { 
    id: 56, 
    rule: 54, 
    name: "Hagonoy", 
    commonName: "Slam Weed", 
    scientificName: "Chromolaena odorata", 
    preparation: ["Pound, apply directly"], 
    mode: ["Topical"] , image: "/images/hagonoy.jpg", frequency: "19"
  },
  { 
    id: 57, 
    rule: 55, 
    name: "Kataka-taka/Dang-gaw", 
    commonName: "Miracle Leaf", 
    scientificName: "Kalanchoe pinnata", 
    preparation: ["Pound and apply directly"], 
    mode: ["Topical"] , image: "/images/katakataka.jpeg", frequency: "12"
  },
  { 
    id: 58, 
    rule: 56, 
    name: "Mayana", 
    commonName: "Mayana", 
    scientificName: "Coleus blumei", 
    preparation: ["Pound until become soft and juicy, apply directly or topically"], 
    mode: ["Topical"] , image: "/images/mayana.jpg", frequency: "21"
  },
  { 
    id: 59, 
    rule: 57, 
    name: "Duknay", 
    commonName: "Spikemoss", 
    scientificName: "Selaginella", 
    preparation: ["Pound and apply the sap directly to fresh wounds or cuts"], 
    mode: ["Topical"] , image: "/images/duknay.jpeg", frequency: "11"
  },
  { 
    id: 60, 
    rule: 58, 
    name: "Kanding-kanding/Kabirobiro", 
    commonName: "Wild Vervain", 
    scientificName: "Verbena officinalis", 
    preparation: ["Pound until become soft and juicy, apply directly or topically"], 
    mode: ["Topical"] , image: "/images/kanding-kanding.jpg", frequency: "5"
  },
  { 
    id: 61, 
    rule: 59, 
    name: "Kadabudabo", 
    commonName: "Dwarf Copperleaf", 
    scientificName: "Alternanthera sessilis", 
    preparation: ["Peel off the bark, scrape the stem until soft and juicy, then apply directly to the affected area"], 
    mode: ["Topical"] , image: "/images/kadabudabo.jpg", frequency: "4"
  },
  { 
    id: 62, 
    rule: 60, 
    name: "Bayabas", 
    commonName: "Guava", 
    scientificName: "Psidium guajava", 
    preparation: ["Boil in water and use as an antiseptic"], 
    mode: ["Topical"] , image: "/images/bayabas.jpg", frequency: "30"
  },
  { 
    id: 63, 
    rule: 61, 
    name: "Saging", 
    commonName: "Banana", 
    scientificName: "Musa paradisiaca Linn", 
    preparation: ["Pound until become soft and juicy, squeeze the juice over the wound and apply bandage"], 
    mode: ["Topical"] , image: "/images/saging.jpg", frequency: "22"
  },
]
},
{
  id: 7,
  name: "Acid reflux (kabuhi)",
  plants: [
  { 
    id: 64, 
    rule: 62, 
    name: "Kahugas",   
    commonName: "Soap Bush", 
    scientificName: "Psychotria nervosa", 
    preparation: ["Drink decoction"], 
    mode: ["Oral"] , image: "/images/kahugas.jpeg", frequency: "22"
  },
  { 
    id: 65, 
    rule: 63, 
    name: "Lagundi",   
    commonName: "Chaste Tree", 
    scientificName: "Vitex agnus-castus", 
    preparation: ["Drink decoction, thrice a day"], 
    mode: ["Oral"] , image: "/images/lagundi.jpg", frequency: "30"
  },
  ]
},
{
  id: 8,
  name: "Headache",
  plants: [
  { 
    id: 66, 
    rule: 64, 
    name: "Balete",   
    commonName: "Balete", 
    scientificName: "Ficus genus", 
    preparation: ["Place on the forehead and back"], 
    mode: ["Transdermal"] , image: "/images/logo.jpg", frequency: "29"
  },
  { 
    id: 67, 
    rule: 65, 
    name: "Tae sa talapan",   
    commonName: "Texas Yellowstar", 
    scientificName: "Lindheimera texana", 
    preparation: ["pound, put in forhead with a piece of cloth or (hampol)"], 
    mode: ["Transdermal"] , image: "/images/tae sa talapan.jpg", frequency: "28"
  },
  ]
},
{
  id: 9,
  name: "Stomachache",
  plants: [
  { 
    id: 68, 
    rule: 66, 
    name: "Abukado", 
    commonName: "Avocado", 
    scientificName: "Persea americana", 
    preparation: ["Drink decoction"], 
    mode: ["Oral"] , image: "/images/abukado.jpg", frequency: "25"
  },
  { 
    id: 69, 
    rule: 67, 
    name: "Bayabas", 
    commonName: "Guava", 
    scientificName: "Psidium guajava", 
    preparation: ["Drink decoction"], 
    mode: ["Oral"] , image: "/images/bayabas.jpg", frequency: "26"
  },
  { 
    id: 70, 
    rule: 68, 
    name: "Hilbas", 
    commonName: "Mugwort", 
    scientificName: "Artemisia vulgaris", 
    preparation: ["Roast partly, squeeze, drink the sap"], 
    mode: ["Oral"] , image: "/images/hilbas.jpg", frequency: "23"
  },
  { 
    id: 71, 
    rule: 69, 
    name: "Sunflower", 
    commonName: "Sunflower", 
    scientificName: "Helianthus annuus", 
    preparation: ["Heat and place on the stomach"], 
    mode: ["Transdermal"] , image: "/images/sunflower.jpeg", frequency: "20"
  },
  { 
    id: 72, 
    rule: 70, 
    name: "Tuway-tuway or Kadagom", 
    commonName: "Beggar ticks", 
    scientificName: "Bidens pilosa", 
    preparation: ["Roast partly, squeeze, drink the sap"], 
    mode: ["Oral"] , image: "/images/tuway-tuway.jpg", frequency: "17"
  },
  { 
    id: 73, 
    rule: 71, 
    name: "Dunggano", 
    commonName: "Pandan/Screwpine", 
    scientificName: "Pandanus odorifer", 
    preparation: ["Heat and place on the stomach"], 
    mode: ["Transdermal"] , image: "/images/dunggano.jpeg", frequency: "21"
  },
  { 
    id: 74, 
    rule: 72, 
    name: "Salapanti", 
    commonName: "-", 
    scientificName: "-", 
    preparation: ["Heat and place on the stomach"], 
    mode: ["Transdermal"] , image: "/images/logo.jpg", frequency: "22"
  },
  { 
    id: 75, 
    rule: 73, 
    name: "Manumbilan", 
    commonName: "-", 
    scientificName: "-", 
    preparation: ["Drink decoction"], 
    mode: ["Oral"] , image: "/images/logo.jpg", frequency: "15"
  },
  { 
    id: 76, 
    rule: 74, 
    name: "Mahogany", 
    commonName: "Mahogany", 
    scientificName: "Swietenia mahogani Jacq.", 
    preparation: ["Chew and swallow the juice or sap"], 
    mode: ["Oral"] , image: "/images/logo.jpg", frequency: "21"
  },
  { 
    id: 77, 
    rule: 75, 
    name: "Panyawan/Kamangyawan", 
    commonName: "Heart-leaved Moonseed", 
    scientificName: "Tinospora reticulata", 
    preparation: ["Boil with water, drink once a day"], 
    mode: ["Oral"] , image: "/images/panyawan.jpg", frequency: "29"
  }
  ]
},
{
  id: 10,
  name: "Rheumatoid",
  plants: [
  { 
    id: 78, 
    rule: 76, 
    name: "Bangat", 
    commonName: "Goose grass", 
    scientificName: "Eleusine indica", 
    preparation: ["Drink decoction"], 
    mode: ["Oral"] , image: "/images/bangat.jpeg", frequency: "26"
  },
  { 
    id: 79, 
    rule: 77, 
    name: "Atis", 
    commonName: "Sugar Apple", 
    scientificName: "Annona squamosa L.", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/atis.webp", frequency: "26"
  },
  { 
    id: 80, 
    rule: 78, 
    name: "Tuba-tuba plant", 
    commonName: "Physic Nut", 
    scientificName: "Jatropha curcas", 
    preparation: ["Roast partly, scrape, apply directly on joints with a cloth or (hampol)"], 
    mode: ["Transdermal"] , image: "/images/physic nut.jpeg", frequency: "21"
  },
  { 
    id: 81, 
    rule: 79, 
    name: "Kalawag/Dulaw", 
    commonName: "Turmeric", 
    scientificName: "Curcuma longa L.", 
    preparation: ["Pound and extract juice and apply directly to affected area"], 
    mode: ["Transdermal"] , image: "/images/kalawag.jpg", frequency: "19"
  }
  ]
},
{
  id: 11,
  name: "Diarrhea",
  plants: [
  { 
    id: 82, 
    rule: 80, 
    name: "Abaka", 
    commonName: "Abaca", 
    scientificName: "Musa textilis", 
    preparation: ["Extract juice then drink"], 
    mode: ["Oral"] , image: "/images/abaka.jpg", frequency: "27"
  },
  { 
    id: 83, 
    rule: 81, 
    name: "Manaba", 
    commonName: "Crape myrtle", 
    scientificName: "Lagerstroemia indica", 
    preparation: ["Drink decoction"], 
    mode: ["Oral"] , image: "/images/logo.jpg", frequency: "23"
  },
  { 
    id: 84, 
    rule: 82, 
    name: "Kaymito", 
    commonName: "Star apple", 
    scientificName: "Chrysophyllum cainito", 
    preparation: ["Dry, heat or boil then drink"], 
    mode: ["Oral"] , image: "/images/logo.jpg", frequency: "24"
  },
  { 
    id: 85, 
    rule: 83, 
    name: "Mangga", 
    commonName: "Mango", 
    scientificName: "Mangifera indica L.", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/logo.jpg", frequency: "20"
  },
  { 
    id: 86, 
    rule: 84, 
    name: "Abana", 
    commonName: "Soursop", 
    scientificName: "Annona muricata L.", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/logo.jpg", frequency: "25"
  },
  { 
    id: 87, 
    rule: 85, 
    name: "Atis", 
    commonName: "Sugar Apple", 
    scientificName: "Annona squamosa L.", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/atis.webp", frequency: "19"
  },
  { 
    id: 88, 
    rule: 86, 
    name: "Kalatsutsi", 
    commonName: "White Frangipani", 
    scientificName: "Plumeria obtusa L.", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/logo.jpg", frequency: "24"
  },
  { 
    id: 89, 
    rule: 87, 
    name: "Saging tundan", 
    commonName: "Latundan banana", 
    scientificName: "Musa x paradisiaca", 
    preparation: ["Scrape and mix with porridge"], 
    mode: ["Oral"] , image: "/images/latundan saging.jpg", frequency: "27"
  },
  { 
    id: 90, 
    rule: 88, 
    name: "Tuway-tuway or Kadagom", 
    commonName: "Beggar ticks", 
    scientificName: "Bidens pilosa", 
    preparation: ["Roast partly, squeeze, drink the sap"], 
    mode: ["Oral"] , image: "/images/tuway-tuway.jpg", frequency: "21"
  },
  { 
    id: 91, 
    rule: 89, 
    name: "Durian", 
    commonName: "Durian", 
    scientificName: "Durio zibethinus Murr.", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/logo.jpg", frequency: "20"
  },
  { 
    id: 92, 
    rule: 90, 
    name: "Abukado", 
    commonName: "Avocado", 
    scientificName: "Persea americana Gaertn.", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/abukado.jpg", frequency: "26"
  },
  { 
    id: 93, 
    rule: 91, 
    name: "Mansanitas with Makopa", 
    commonName: "-", 
    scientificName: "Muntingia calabura L.", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/logo.jpg", frequency: "16"
  },
  { 
    id: 94, 
    rule: 92, 
    name: "Kalawag", 
    commonName: "Turmeric", 
    scientificName: "-", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/kalawag.jpg", frequency: "20"
  },
  { 
    id: 95, 
    rule: 93, 
    name: "Nangka", 
    commonName: "Jack Fruit", 
    scientificName: "-", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/logo.jpg", frequency: "18"
  },
  { 
    id: 96, 
    rule: 94, 
    name: "Makopa/Tubal", 
    commonName: "Malay Apple", 
    scientificName: "-", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/malay apple.jpeg", frequency: "13"
  },
  { 
    id: 97, 
    rule: 95, 
    name: "Bayabas", 
    commonName: "Guava", 
    scientificName: "Psidium guajava L.", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/bayabas.jpg", frequency: "28"
  },
  { 
    id: 98, 
    rule: 96, 
    name: "Jack Fruit", 
    commonName: "-", 
    scientificName: "Artocarpus heterophyllus", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/logo.jpg", frequency: "17"
  }
]
},
{
  id: 12,
  name: "Relapse (bughat)",
  plants: [
  { 
    id: 99, 
    rule: 97, 
    name: "Kalingag", 
    commonName: "Kalingag tree", 
    scientificName: "-", 
    preparation: ["Drink decoction"], 
    mode: ["Oral"] , image: "/images/logo.jpg", frequency: "30"
  },
  { 
    id: 100, 
    rule: 98, 
    name: "Salumayag", 
    commonName: "Almaciga", 
    scientificName: "-", 
    preparation: ["Drink decoction"], 
    mode: ["Oral"] , image: "/images/salumayag.jpg", frequency: "29"
  },
  { 
    id: 101, 
    rule: 99, 
    name: "Kahugas", 
    commonName: "-", 
    scientificName: "-", 
    preparation: ["Drink decoction"], 
    mode: ["Oral"] , image: "/images/kahugas.jpeg", frequency: "23"
  },
  { 
    id: 102, 
    rule: 100, 
    name: "Karagum", 
    commonName: "Beggar ticks", 
    scientificName: "-", 
    preparation: ["Drink decoction"], 
    mode: ["Oral"] , image: "/images/logo.jpg", frequency: "19"
  },
  { 
    id: 103, 
    rule: 101, 
    name: "Abaka", 
    commonName: "Abaca", 
    scientificName: "Musa textilis", 
    preparation: ["Drink decoction"], 
    mode: ["Oral"] , image: "/images/abaka.jpg", frequency: "20"
  },
  { 
    id: 104, 
    rule: 102, 
    name: "Bila-bila/Bangat", 
    commonName: "-", 
    scientificName: "Eleusine indica (L.) Gaertn", 
    preparation: ["Drink decoction. Boil with water, use as first bath for baby and mother"], 
    mode: ["Oral"] , image: "/images/bangat.jpeg", frequency: "18"
  },
  { 
    id: 105, 
    rule: 103, 
    name: "Banog", 
    commonName: "False elephant's foot", 
    scientificName: "-", 
    preparation: ["Drink decoction"], 
    mode: ["Oral"] , image: "/images/banog.jpg", frequency: "17"
  },
  { 
    id: 106, 
    rule: 104, 
    name: "Kalatsutsi", 
    commonName: "Frangipani", 
    scientificName: "Plumeria obtuse L.", 
    preparation: ["Roast partly, put in chest and back with a piece of cloth or (hampol)"], 
    mode: ["Topical"] , image: "/images/logo.jpg", frequency: "28"
  },
  { 
    id: 107, 
    rule: 105, 
    name: "Lanagon", 
    commonName: "Indian Cherry", 
    scientificName: "Flacourtia indica", 
    preparation: ["Drink decoction, thrice a day"], 
    mode: ["Oral"] , image: "/images/governor_s plum.webp", frequency: "16"
  },
  { 
    id: 108, 
    rule: 106, 
    name: "Pugahan", 
    commonName: "Fishtail Plum", 
    scientificName: "Flacourtia jangomas", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/logo.jpg", frequency: "15"
  },
  { 
    id: 109, 
    rule: 107, 
    name: "Hagimit", 
    commonName: "Mindanao Fig", 
    scientificName: "Ficus minahassae", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/logo.jpg", frequency: "13"
  },
  { 
    id: 110, 
    rule: 108, 
    name: "Salin-ubod/Matamsi", 
    commonName: "Weeping Fig", 
    scientificName: "Ficus Benjamina", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/logo.jpg", frequency: "15"
  }
]
},
{
  id: 13,
  name: "Irregular Menstruation or Bleeding in Women",
  plants: [
  { 
    id: 111, 
    rule: 109, 
    name: "Nilo", 
    commonName: "Mindanao Voacanga", 
    scientificName: "Voacanga mindanaensis Merr.", 
    preparation: ["Drink decoction, thrice a day"], 
    mode: ["Oral"] , image: "/images/logo.jpg", frequency: "28"
  },
  { 
    id: 112, 
    rule: 110, 
    name: "Lanagon", 
    commonName: "Governor's Plum", 
    scientificName: "Flacourtia rukam", 
    preparation: ["Drink decoction, thrice a day"], 
    mode: ["Oral"] , image: "/images/governor_s plum.webp", frequency: "30"
  }
  ]
},
{
  id: 14,
  name: "Toothache",
  plants: [
  { 
    id: 113, 
    rule: 111, 
    name: "Bet-on", 
    commonName: "Spilanthes", 
    scientificName: "Acmella oleracea", 
    preparation: ["Chew, put in decaying tooth"], 
    mode: ["Topical"] , image: "/images/logo.jpg", frequency: "30"
  },
  { 
    id: 114, 
    rule: 112, 
    name: "Tanglad", 
    commonName: "Lemon Grass", 
    scientificName: "Cymbopogon citratus", 
    preparation: ["Crush or boil with water, put on decaying tooth"], 
    mode: ["Topical"] , image: "/images/tanglad.jpg", frequency: "27"
  },
  { 
    id: 115, 
    rule: 113, 
    name: "Panyawan/Kamangi", 
    commonName: "Heart-Leaved Moonseed", 
    scientificName: "Tinospora reticulata", 
    preparation: ["Latex or sap, squeeze over tooth"], 
    mode: ["Topical"] , image: "/images/panyawan.jpg", frequency: "30"
  },
  { 
    id: 116, 
    rule: 114, 
    name: "Tabako", 
    commonName: "Tobacco", 
    scientificName: "Solanum vespertilionum", 
    preparation: ["Chew and keep in the mouth for several hours"], 
    mode: ["Topical"] , image: "/images/logo.jpg", frequency: "25"
  },
  { 
    id: 117, 
    rule: 115, 
    name: "Bagalbal", 
    commonName: "-", 
    scientificName: "Piper porphyrophenuria", 
    preparation: ["Cut into small pieces, chew, and use as lozenges"], 
    mode: ["Topical"] , image: "/images/bagalbal.jpg", frequency: "30"
  }
  ]
},
{
  id: 15,
  name: "Mild stroke",
  plants: [
  { 
    id: 118, 
    rule: 116, 
    name: "Gabon/Pahid", 
    commonName: "-", 
    scientificName: "Blumea balsamifera", 
    preparation: ["Roast partly, squeeze, rub or massage the leaves into the body"], 
    mode: ["Transdermal"] , image: "/images/gabon.jpg", frequency: "30"
  },
  { 
    id: 119, 
    rule: 117, 
    name: "Tuba-tuba plant", 
    commonName: "Physic Nut", 
    scientificName: "Jatropha curcas", 
    preparation: ["Roast partly. Scrape, squeeze and rub or massage on the body"], 
    mode: ["Transdermal"] , image: "/images/physic nut.jpeg", frequency: "28"
  }
  ]
},
{
  id: 16,
  name: "Edema",
  plants: [
  { 
    id: 120, 
    rule: 118, 
    name: "Gabon/Pahid", 
    commonName: "-", 
    scientificName: "Blumea balsamifera", 
    preparation: ["Roast partly, squeeze, rub or massage the leaves into the body"], 
    mode: ["Transdermal"] , image: "/images/gabon.jpg", frequency: "30"
  }
  ]
},
{
  id: 17,
  name: "Tonsilitis",
  plants: [
  { 
    id: 121, 
    rule: 119, 
    name: "Kapayas", 
    commonName: "Papaya", 
    scientificName: "Carica papaya L.", 
    preparation: ["Roast, apply on the neck wrapped with a piece of cloth or (hampol)"], 
    mode: ["Topical"] , image: "/images/papaya.png", frequency: "30"
  },
  ]
},
{
  id: 18,
  name: "Flatulence (panuhot)",
  plants: [
  { 
    id: 122, 
    rule: 120, 
    name: "Tuba-tuba plant", 
    commonName: "Physic Nut", 
    scientificName: "Jatropha curcas", 
    preparation: ["Roast partly. Scrape, squeeze and rub or massage on the body"], 
    mode: ["Transdermal"] , image: "/images/physic nut.jpeg", frequency: "29"
  },
  { 
    id: 123, 
    rule: 121, 
    name: "Kalawag", 
    commonName: "Turmeric", 
    scientificName: "Curcuma longa", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/kalawag.jpg", frequency: "30"
  },
  { 
    id: 124, 
    rule: 122, 
    name: "Makupa/Tubal", 
    commonName: "Malay Apple", 
    scientificName: "Syzygium malaccense", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/malay apple.jpg", frequency: "21"
  }
  ]
},
{
  id: 19,
  name: "Arthritis",
  plants: [
  { 
    id: 125, 
    rule: 123, 
    name: "Tuba-tuba plant", 
    commonName: "Physic Nut", 
    scientificName: "Jatropha curcas", 
    preparation: ["Roast partly. Scrape, apply directly on joints with a cloth or (hampol)"], 
    mode: ["Topical"] , image: "/images/physic nut.jpeg", frequency: "22"
  },
  { 
    id: 126, 
    rule: 124, 
    name: "Kalawag", 
    commonName: "Turmeric", 
    scientificName: "Curcuma longa", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/kalawag.jpg", frequency: "30"
  }
  ]
},
{
  id: 20,
  name: "Swollen Gums",
  plants: [
  { 
    id: 127, 
    rule: 125, 
    name: "Narra/Tagok", 
    commonName: "Narra", 
    scientificName: "Pterocarpus indicus Willd.", 
    preparation: ["Scrape and squeeze the sap, apply directly on gums"], 
    mode: ["Topical"] , image: "/images/narra.jpg", frequency: "30"
  }
  ]
},
{
  id: 21,
  name: "Urination",
  plants: [
  { 
    id: 128, 
    rule: 126, 
    name: "Kogon", 
    commonName: "Cogon", 
    scientificName: "Imperata cylindrica", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/cogon.webp", frequency: "30"
  },
  { 
    id: 129, 
    rule: 127, 
    name: "Mais", 
    commonName: "Corn", 
    scientificName: "Zea mays L.", 
    preparation: ["Boil with water, drink twice a day"], 
    mode: ["Oral"] , image: "/images/corn.webp", frequency: "22"
  }
  ]
},
{
  id: 22,
  name: "Sinusitis",
  plants: [
  { 
    id: 130, 
    rule: 128, 
    name: "Mayana", 
    commonName: "-", 
    scientificName: "Coleus blumei", 
    preparation: ["Roast partly and apply/put over the forehead while still hot"], 
    mode: ["Topical"] , image: "/images/mayana.jpg", frequency: "30"
  }
  ]
},
{
  id: 23,
  name: "Vertigo",
  plants: [
  { 
    id: 131, 
    rule: 129, 
    name: "Abukado", 
    commonName: "Avocado", 
    scientificName: "Persea americana Gaertn.", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/abukado.jpg", frequency: "30"
  }
  ]
},
{
  id: 24,
  name: "Bruises",
  plants: [
  { 
    id: 132, 
    rule: 130, 
    name: "Antuwanga", 
    commonName: "Chinese Hibiscus", 
    scientificName: "Hibiscus rosa-sinensis L.", 
    preparation: ["Pound until become soft and juicy, apply directly or topically"], 
    mode: ["Topical"] , image: "/images/chinese hibiscus.jpeg", frequency: "24"
  },
  { 
    id: 133, 
    rule: 131, 
    name: "Mayana", 
    commonName: "-", 
    scientificName: "Coleus blumei", 
    preparation: ["Pound until become soft and juicy, apply directly or topically"], 
    mode: ["Topical"] , image: "/images/mayana.jpg", frequency: "27"
  },
  { 
    id: 134, 
    rule: 132, 
    name: "Hagimit", 
    commonName: "-", 
    scientificName: "Ficus minahassae", 
    preparation: ["Roast, pound, mix with oil, apply directly"], 
    mode: ["Topical"] , image: "/images/logo.jpg", frequency: "23"
  }
  ]
},
{
  id: 25,
  name: "Sore throat",
  plants: [
  { 
    id: 135, 
    rule: 133, 
    name: "Luy-a", 
    commonName: "Ginger", 
    scientificName: "Zingiber officinale", 
    preparation: ["Cut into small pieces and use as lozenges (candy), keeping them in the mouth for several hours"], 
    mode: ["Oral"] , image: "/images/luy-a.jpeg", frequency: "30"
  }  
  ]
},{
  id: 26,
  name: "Sore eyes",
  plants: [
  { 
    id: 136, 
    rule: 134, 
    name: "Mantawasi", 
    commonName: "Fiery Costus", 
    scientificName: "Costus igneus", 
    preparation: ["Scrape the stem and squeeze out the sap or juice into the eyes"], 
    mode: ["Ophthalmic"] , image: "/images/fiery costus.webp", frequency: "30"
  },
  { 
    id: 137, 
    rule: 135, 
    name: "Hanapol", 
    commonName: "-", 
    scientificName: "Poikilospermum suaveolens", 
    preparation: ["Cut a portion of the stem to extract the latex or sap, then apply or drop it into the eyes"], 
    mode: ["Ophthalmic"] , image: "/images/hanapol.jpg", frequency: "22"
  }
  ]
},
{
  id: 27,
  name: "Abdominal Pain",
  plants: [
  { 
    id: 138, 
    rule: 136, 
    name: "Kalawag", 
    commonName: "Turmeric", 
    scientificName: "Curcuma longa", 
    preparation: ["Boil with water, drink thrice a day"], 
    mode: ["Oral"] , image: "/images/kalawag.jpg", frequency: "30"
  }
  ]
},
{
  id: 28,
  name: "Ulcers",
  plants: [
  { 
    id: 139, 
    rule: 137, 
    name: "Kanding-kanding/Kabirobiro", 
    commonName: "Blue Vervain", 
    scientificName: "Stachytarpheta jamaicensis", 
    preparation: ["Pound until become soft and juicy, apply directly or topically"], 
    mode: ["Topical"] , image: "/images/kanding-kanding.jpg", frequency: "30"
  },
  { 
    id: 140, 
    rule: 138, 
    name: "Lanagon", 
    commonName: "Governor's Plum", 
    scientificName: "Flacourtia rukam", 
    preparation: ["Drink decoction, thrice a day"], 
    mode: ["Oral"] , image: "/images/governor_s plum.webp", frequency: "25"
  }
  ]
},
{
  id: 29,
  name: "Asthmatic Attack",
  plants: [
  { 
    id: 141, 
    rule: 139, 
    name: "Sili/Katumbal", 
    commonName: "Red Pepper", 
    scientificName: "Capsicum frutescens", 
    preparation: ["Pound and rub on chest"], 
    mode: ["Topical"] , image: "/images/sili.jpe", frequency: "30"
  }
  ]
},
{
  id: 30,
  name: "Anemia",
  plants: [
  { 
    id: 142, 
    rule: 140, 
    name: "Lanagon", 
    commonName: "Governor's Plum", 
    scientificName: "Flacourtia rukam", 
    preparation: ["Drink decoction, thrice a day"], 
    mode: ["Oral"] , image: "/images/governor_s plum.webp", frequency: "30"
  }
  ]
},
{
  id: 31,
  name: "Dysentery",
  plants: [
  { 
    id: 143, 
    rule: 141, 
    name: "Ipil-ipil", 
    commonName: "Lead Tree", 
    scientificName: "Leucaena leucocephala", 
    preparation: ["Chew and directly eaten"], 
    mode: ["Oral"] , image: "/images/lead tree.jpg", frequency: "30"
  }
  ]
},{
  id: 32,
  name: "Expel intestinal parasites or worms",
  plants: [
  { 
    id: 143, 
    rule: 141, 
    name: "Ipil-ipil", 
    commonName: "Lead Tree", 
    scientificName: "Leucaena leucocephala", 
    preparation: ["Chew and directly eaten"], 
    mode: ["Oral"] , image: "/images/lead tree.jpg", frequency: "30"
  }
  ]
}
]);

const selectedDisease = ref("");
const selectedPlant = ref(null);

// Get the disease name from the URL
onMounted(() => {
  selectedDisease.value = route.params.diseaseName;
});

//sort and filter plants
const filteredPlants = computed(() => {
  const disease = diseases.value.find(d => d.name.toLowerCase() === selectedDisease.value.toLowerCase());
  return disease ? [...disease.plants].sort((a, b) => b.frequency - a.frequency) : [];
});

// Function to select a plant
const selectPlant = (plant) => {
  selectedPlant.value = plant;
};

// Back to search page
const goBack = () => {
  router.push("/");
};
</script>
