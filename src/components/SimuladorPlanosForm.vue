<script setup>
import {ref, toRefs} from 'vue'

const props = defineProps({
  products: {
    type: Object,
    required: true
  },
  aux: {
    type: Object,
    required: true
  }
})

const {products, aux} = toRefs(props);

const ageGroup = Object.keys(aux.value[Object.keys(aux.value)[0]])

const plano = ref('')
const salGroup = ref('')
const titAgeGroup = ref('')
const benefCount = ref(0)
const benefsAgeGroup = ref([])

const req = ref([false, false, false])

const grossContrib = ref(-1)
const auxTotal = ref(-1)
const liqContrib = ref(-1)

function incrementBenef() {
  benefCount.value++
  benefsAgeGroup.value.push()
  req.value.push(false)
}

function decrementBenef() {
  if (benefCount.value > 0) {
    benefCount.value--
    benefsAgeGroup.value.pop()
    req.value.pop()
  }
}

function planoChange() {
  req.value[0] = true
}

function salGroupChange() {
  req.value[1] = true
}

function titAgeChange() {
  req.value[2] = true
}

function benefsAgeChange(index) {
  req.value[2 + index] = true
}

function simulate() {
  // Titular
  grossContrib.value = products.value[plano.value][titAgeGroup.value]
  auxTotal.value = aux.value[salGroup.value][titAgeGroup.value]

  // Beneficiários
  for (let key in benefsAgeGroup.value) {
    let val = benefsAgeGroup.value[key]
    grossContrib.value += products.value[plano.value][val]
    auxTotal.value += aux.value[salGroup.value][val]
  }

  let dif = grossContrib.value - auxTotal.value
  liqContrib.value = dif < 0 ? 0 : dif
}
</script>

<template>
  <div class="w-fit flex flex-col align-center gap-4">
    <div class="w-96 flex flex-col justify-center">
      <v-select
          :items="Object.keys(props.products)"
          density="comfortable"
          label="Tipo de plano"
          variant="underlined"
          v-model="plano"
          @update:modelValue="planoChange"
      ></v-select>
      <v-select
          :items="Object.keys(props.aux)"
          density="comfortable"
          label="Faixa salarial do grupo familiar"
          variant="underlined"
          v-model="salGroup"
          @update:modelValue="salGroupChange"
      ></v-select>
      <v-select
          :items="ageGroup"
          density="comfortable"
          label="Faixa etária do titular"
          variant="underlined"
          v-model="titAgeGroup"
          @update:modelValue="titAgeChange"
      ></v-select>
      <v-select
          v-for="index in benefCount"
          :key="index"
          :items="ageGroup"
          density="comfortable"
          :label="'Faixa etária do beneficiário ' + index"
          variant="underlined"
          v-model="benefsAgeGroup[index]"
          @update:modelValue="benefsAgeChange(index)"
      ></v-select>
    </div>
    <div class="flex gap-4 w-fit justify-center">
      <v-btn
          variant="outlined"
          @click="incrementBenef"
      >
        Adicionar beneficiário
      </v-btn>
      <v-btn
          variant="outlined"
          @click="decrementBenef"
          :disabled="benefCount === 0"
      >
        Remover beneficiário
      </v-btn>
    </div>
    <div class="w-fit">
      <v-btn
          variant="outlined"
          @click="simulate"
          :disabled="!req.every(x => x)"
      >
        Simular
      </v-btn>
    </div>
    <div
        v-if="grossContrib > -1 && auxTotal > -1 && liqContrib > -1"
    >
      <p>Contribuição Bruta do Grupo Familiar: R$ {{ grossContrib.toFixed(2) }}</p>
      <p>Auxílio Suplementar do Grupo Familiar: R$ {{ auxTotal.toFixed(2) }}</p>
      <p>Contribuição Devida: R$ {{ liqContrib.toFixed(2) }}</p>
    </div>
  </div>
</template>

<style scoped>

</style>