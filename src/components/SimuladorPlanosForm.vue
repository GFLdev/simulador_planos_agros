<script setup>
import {ref, toRefs} from 'vue'
import {
  PhBuilding, PhScroll, PhUser,
  PhCalculator, PhMoney, PhUserMinus,
  PhUserPlus, PhUsers, PhUsersFour,
  PhUsersThree, PhUserGear
} from "@phosphor-icons/vue"

const props = defineProps({
  products: {
    type: Object,
    required: true
  },
  aux: {
    type: Object,
    required: true
  },
  inst: {
    type: Object,
    required: true
  }
})

const {products, aux, inst} = toRefs(props);

const instList = Object.keys(inst.value)
const prodsList = Object.keys(products.value)
const salGroupList = Object.keys(aux.value)
const ageGroupList = Object.keys(aux.value[Object.keys(aux.value)[0]])

const selInst = ref()
const selPlano = ref()
const selSalGroup = ref()
const selTitAgeGroup = ref()
const benefCount = ref(0)
const selBenefsAgeGroup = ref([])

const req = ref([false, false, false, false])

const grossContrib = ref(-1)
const auxTotal = ref(-1)
const liqContrib = ref(-1)

function simAble(index) {
  req.value[index] = true
}

function isAble() {
  return req.value.every(x => x)
}

function haveSim() {
  return grossContrib.value !== -1
}

function incrementBenef() {
  benefCount.value++
  selBenefsAgeGroup.value.push()
  req.value.push(false)
}

function decrementBenef() {
  if (benefCount.value > 0) {
    benefCount.value--
    selBenefsAgeGroup.value.pop()
    req.value.pop()
  }
}

function simulate() {
  // Titular
  grossContrib.value = products.value[selPlano.value][selTitAgeGroup.value]
  auxTotal.value = aux.value[selSalGroup.value][selTitAgeGroup.value]

  // Beneficiários
  for (let key in selBenefsAgeGroup.value) {
    let val = selBenefsAgeGroup.value[key]
    grossContrib.value += products.value[selPlano.value][val]
    auxTotal.value += aux.value[selSalGroup.value][val]
  }

  let dif = grossContrib.value - auxTotal.value
  liqContrib.value = dif < 0 ? 0 : dif

  haveSim.value = true
}
</script>

<template>
  <div class="w-full flex flex-col align-center gap-4">
    <div class="w-full sm:w-96 flex flex-col justify-center">
      <v-select
          :items="instList"
          density="comfortable"
          label="Instituição"
          variant="underlined"
          v-model="selInst"
          @update:modelValue="simAble(0)"
          :prepend-inner-icon="selInst ? null : PhBuilding"
      ></v-select>
      <v-select
          :items="prodsList"
          density="comfortable"
          label="Tipo de Plano"
          variant="underlined"
          v-model="selPlano"
          @update:modelValue="simAble(1)"
          :prepend-inner-icon="PhScroll"
      ></v-select>
      <v-select
          :items="salGroupList"
          density="comfortable"
          label="Faixa salarial do grupo familiar"
          variant="underlined"
          v-model="selSalGroup"
          @update:modelValue="simAble(2)"
          :prepend-inner-icon="PhMoney"
      ></v-select>
      <v-select
          :items="ageGroupList"
          density="comfortable"
          label="Faixa etária do titular"
          variant="underlined"
          v-model="selTitAgeGroup"
          @update:modelValue="simAble(3)"
          :prepend-inner-icon="PhUserGear"
      ></v-select>
      <v-select
          v-for="index in benefCount"
          :key="index"
          :items="ageGroupList"
          density="comfortable"
          :label="'Faixa etária do beneficiário ' + index"
          variant="underlined"
          v-model="selBenefsAgeGroup[index]"
          @update:modelValue="simAble(3 + index)"
          :prepend-inner-icon="
            index === 1 ? PhUser :
            index === 2 ? PhUsers :
            index === 3 ? PhUsersThree :
            PhUsersFour"
      ></v-select>
    </div>
    <div
        class="
          flex
          flex-col
          sm:flex-row
          gap-4
          w-fit
          justify-center"
    >
      <v-btn
          variant="outlined"
          @click="incrementBenef"
          :prepend-icon="PhUserPlus"
      >
        Adicionar beneficiário
      </v-btn>
      <v-btn
          variant="outlined"
          @click="decrementBenef"
          :disabled="benefCount === 0"
          :prepend-icon="PhUserMinus"
      >
        Remover beneficiário
      </v-btn>
    </div>
    <div class="w-fit">
      <v-btn
          variant="outlined"
          @click="simulate"
          :disabled="!isAble()"
          :prepend-icon="PhCalculator"
      >
        Simular
      </v-btn>
    </div>
    <v-divider
        class="
          w-full
          px-8
          border-black
          mt-4"
        :opacity="0.4"
    ></v-divider>
    <div>
      <v-list
          lines="one"
          density="comfortable"
          v-if="isAble() && haveSim()"
      >
        <v-list-item
            title="Contribuição Bruta do Grupo Familiar"
            :subtitle="'R$ ' + grossContrib.toFixed(2)"
        ></v-list-item>
        <v-list-item
            title="Auxílio Suplementar do Grupo Familiar"
            :subtitle="'R$ ' + auxTotal.toFixed(2)"
        ></v-list-item>
        <v-list-item
            title="Contribuição Devida do Grupo Familiar"
            :subtitle="'R$ ' + liqContrib.toFixed(2)"
        ></v-list-item>
      </v-list>
      <p v-if="!haveSim() || !isAble()">Selecione todos os campos</p>
    </div>
  </div>
</template>

<style scoped>

</style>