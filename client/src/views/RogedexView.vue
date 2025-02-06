<template>
  <div class="rogedex">
    <div class="rogedex__collections">
      <div class="rogedex__collection" v-for="collection in collections" :key="collection.name">
        <h2>{{ collection.name }}</h2>
        <div class="rogedex__cards">
          <div v-for="cardNumber in collection.cardsCount" :key="cardNumber" class="rogedex__card">
            <h3>{{ String(cardNumber).padStart(3, '0') }}</h3>
            <div class="rogedex__card-buttons">
              <button>✗</button>
              <button>✓</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const collections = [
  {
    name: 'Genetic Apex',
    cardsCount: 226,
  },
  {
    name: 'Mystical Island',
    cardsCount: 68,
  },
  { name: 'Space-Time Smackdown', cardsCount: 207 },
]
</script>

<style scoped>
.rogedex__collections {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(28rem, 1fr));
  grid-template-rows: masonry;
  padding: 1rem 0;
}
.rogedex__cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  padding: 1rem 0;
}
.rogedex__card {
  aspect-ratio: 2/3;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 0.2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.5rem;
}
.rogedex__card-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}
</style>
