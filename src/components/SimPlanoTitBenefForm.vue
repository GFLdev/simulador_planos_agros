<!--@formatter:on-->
<script setup>
import { ref } from 'vue'
import {
  PhBuilding,
  PhScroll,
  PhUser,
  PhCalculator,
  PhMoney,
  PhUserMinus,
  PhUserPlus,
  PhUsers,
  PhUsersFour,
  PhUsersThree,
  PhUserGear
} from '@phosphor-icons/vue'

import Products from '../data/Lista_de_produtos.json'
import Assist from '../data/Valores_de_auxilio.json'
import Price from '../data/Preco_do_produto.json'

const type = ref(0)

const productsList = ref(Products)
const assistList = ref(Assist)
const priceList = ref(Price)

const selInst = ref()
const selPlano = ref()
const selSalGroup = ref()
const selTitAgeGroup = ref()
const benefCount = ref(0)
const selBenefsAgeGroup = ref([])

const req = ref([false, false, false, false])

const grossContrib = ref(-1)
const assistTotal = ref(-1)
const liqContrib = ref(-1)

function resetInst() {
  resetType()
  simAble(0)
  selPlano.value = null
}

function resetType() {
  selSalGroup.value = null
  selTitAgeGroup.value = null
  benefCount.value = 0
  selBenefsAgeGroup.value = []

  req.value = [true, true, false, false]

  grossContrib.value = -1
  assistTotal.value = -1
  liqContrib.value = -1
}

function changeType(val) {
  type.value = val
  resetType()
}

function simAble(index) {
  req.value[index] = true
}

function isAble() {
  return req.value.every((x) => x)
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
  let plano = selPlano.value
  let sal = selSalGroup.value
  let selType = type.value

  let grossTemp = 0
  let assistTemp = 0

  let prodName = productsList.value[selInst.value]
  let prodId = prodName[plano][selType === 0 ? 'tit' : 'agreg']

  // Beneficiários
  for (let key in selBenefsAgeGroup.value) {
    let age = selBenefsAgeGroup.value[key]

    grossTemp += parseFloat(
      priceList.value[prodId][age]?.replace(',', '.')
    )

    if (selType === 0) {
      assistTemp += parseFloat(assistList.value[sal][age]?.replace(',', '.'))
    }
  }

  let age = selTitAgeGroup.value

  // Titular
  grossTemp += parseFloat(
    priceList.value[prodId][age]?.replace(',', '.')
  )

  if (selType === 0) {
    assistTemp += parseFloat(assistList.value[sal][age]?.replace(',', '.'))
  }

  grossContrib.value = grossTemp
  assistTotal.value = assistTemp
  let dif = grossContrib.value - assistTotal.value
  liqContrib.value = dif < 0 ? 0 : dif

  haveSim.value = true
}
</script>

<template>
  <div class="w-full flex flex-col align-center gap-4 my-10 drop-shadow-lg">
    <div class="flex flex-col sm:flex-row gap-4 w-full justify-center pb-4">
      <v-btn
        id="tit_btn"
        variant="outlined"
        @click="changeType(0)"
        class="sm:w-1/2"
        :active="type === 0"
      >
        Plano Titular
      </v-btn>
      <v-btn
        id="agreg_btn"
        variant="outlined"
        @click="changeType(1)"
        class="sm:w-1/2"
        :active="type === 1"
      >
        Plano Agregado
      </v-btn>
    </div>
    <div class="w-full sm:w-96 flex flex-col justify-center">
      <v-select
        :items="Object.keys(productsList)"
        density="comfortable"
        label="Instituição"
        variant="underlined"
        v-model="selInst"
        @update:modelValue="resetInst"
        :prepend-inner-icon="PhBuilding"
      ></v-select>
      <v-select
        :items="selInst ? Object.keys(productsList[selInst]) : []"
        density="comfortable"
        label="Tipo de Plano"
        variant="underlined"
        v-model="selPlano"
        :disabled="!selInst"
        @update:modelValue="simAble(1)"
        :prepend-inner-icon="PhScroll"
      ></v-select>
      <v-select
        :items="Object.keys(assistList)"
        density="comfortable"
        label="Faixa salarial do grupo familiar"
        variant="underlined"
        v-model="selSalGroup"
        :disabled="!selInst"
        @update:modelValue="simAble(2)"
        :prepend-inner-icon="PhMoney"
      ></v-select>
      <v-select
        :items="Object.keys(Object.values(priceList)[0])"
        density="comfortable"
        :label="type === 0 ? 'Faixa etária do titular' : 'Faixa etária do agregado 1'"
        variant="underlined"
        v-model="selTitAgeGroup"
        :disabled="!selInst"
        @update:modelValue="simAble(3)"
        :prepend-inner-icon="PhUserGear"
      ></v-select>
      <v-select
        v-for="index in benefCount"
        :key="index"
        :items="Object.keys(Object.values(priceList)[0])"
        density="comfortable"
        :label="
          type === 0 ? 'Faixa etária do beneficiário ' + index : 'Faixa etária do agregado ' + (index + 1)
        "
        variant="underlined"
        v-model="selBenefsAgeGroup[index]"
        :disabled="!selInst"
        @update:modelValue="simAble(3 + index)"
        :prepend-inner-icon="
          index === 1 ? PhUser : index === 2 ? PhUsers : index === 3 ? PhUsersThree : PhUsersFour
        "
      ></v-select>
    </div>
    <div class="flex flex-col sm:flex-row gap-4 w-full justify-center">
      <v-btn variant="outlined" @click="incrementBenef" :prepend-icon="PhUserPlus" class="sm:w-1/2">
        Adicionar{{ type === 0 ? ' beneficiário' : ' agregado' }}
      </v-btn>
      <v-btn
        variant="outlined"
        @click="decrementBenef"
        :disabled="benefCount === 0"
        :prepend-icon="PhUserMinus"
        class="sm:w-1/2"
      >
        Remover{{ type === 0 ? ' beneficiário' : ' agregado' }}
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
    <v-divider class="w-full px-8 border-black mt-4" :opacity="0.4"></v-divider>
    <div>
      <v-list lines="one" density="comfortable" v-if="haveSim()">
        <v-list-item
          title="Contribuição Bruta do Grupo Familiar"
          :subtitle="'R$ ' + grossContrib.toFixed(2)"
          v-if="type === 0"
        ></v-list-item>
        <v-list-item
          title="Auxílio Suplementar do Grupo Familiar"
          :subtitle="'R$ ' + assistTotal.toFixed(2)"
          v-if="type === 0"
        ></v-list-item>
        <v-list-item
          title="Contribuição Devida do Grupo Familiar"
          :subtitle="'R$ ' + liqContrib.toFixed(2)"
        ></v-list-item>
      </v-list>
      <p v-if="!haveSim()">Selecione todos os campos</p>
    </div>
  </div>
</template>

<style scoped>
.v-btn {
  @apply
  bg-primary
  text-white
  !important;
}
</style>
