<script setup>
defineProps({
  grossContrib: {
    type: Number,
    required: true
  },
  assistTotal: {
    type: Number,
    required: true
  },
  liqPrevAgregContrib: {
    type: Number,
    required: true
  },
  agregsContrib: {
    type: Array,
    required: true
  },
  liqContrib: {
    type: Number,
    required: true
  }
})

function formatPrice(price) {
  return price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}
</script>

<template>
  <v-list lines="one" density="comfortable" elevation="5" class="px-8 py-4">
    <v-list-item>
      <span><span class="calc_id">(A)</span> Valor da contribuição bruta do grupo familiar</span>
      <br />
      <span class="result_values_label">{{ formatPrice(grossContrib) }}</span>
    </v-list-item>
    <v-list-item>
      <span><span class="calc_id">(B)</span> Auxílio-saúde do grupo familiar</span>
      <br />
      <span class="result_values_label">{{ formatPrice(assistTotal) }}</span>
    </v-list-item>
    <v-list-item>
      <span><span class="calc_id">(C)</span> Valor a ser pago pelo grupo familiar</span>
      <br />
      <span class="result_values_label">{{ formatPrice(liqPrevAgregContrib) }}</span>
    </v-list-item>
    <div v-if="agregsContrib.length > 0">
      <v-list-item v-for="index in agregsContrib.length" :key="index">
        <span>
          <span class="calc_id"> (D{{ agregsContrib.length > 1 ? '.' + index : '' }}) </span> Valor
          da contribuição a ser pago pelo agregado {{ index }}
        </span>
        <br />
        <span class="result_values_label">{{ formatPrice(agregsContrib[index - 1]) }}</span>
      </v-list-item>
      <v-list-item>
        <span><span class="calc_id">(E)</span> Valor total a ser pago</span>
        <br />
        <span class="result_values_label">{{ formatPrice(liqContrib) }}</span>
      </v-list-item>
      <div class="flex justify-center items-center my-4">
        <!--        <v-btn>-->
        <!--          Receba essa simulação por e-mail-->
        <!--        </v-btn>-->
      </div>
    </div>
  </v-list>
</template>

<style scoped>
.calc_id {
  @apply text-primary
  font-bold
  !important;
}

.v-btn {
  @apply bg-primary
  text-white
  !important;
}

.v-list {
  @apply text-center
  !important;
}

.result_values_label {
  @apply block
  text-primary
  font-bold
  !important;
}
</style>
