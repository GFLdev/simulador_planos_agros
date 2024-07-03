<!--@formatter:on-->
<script setup>
import { ref } from 'vue'
import {
  PhBuilding,
  PhScroll,
  PhUser,
  PhCalculator,
  PhMoney,
  PhMinus,
  PhPlus,
  PhUsers,
  PhUsersFour,
  PhUsersThree,
  PhUserGear,
  PhNumberOne,
  PhNumberTwo,
  PhNumberThree
} from '@phosphor-icons/vue'

import Products from '../data/Lista_de_produtos.json'
import Assist from '../data/Valores_de_auxilio.json'
import Price from '../data/Preco_do_produto.json'
import SimResult from '@/components/SimResult.vue'

const type = ref(true)

const productsList = ref(Products)
const assistList = ref(Assist)
const priceList = ref(Price)

const selInst = ref()
const selPlano = ref()
const selSalGroup = ref()
const selTitAgeGroup = ref()
const depCount = ref(0)
const selBenefsAgeGroup = ref([])
const agregCount = ref(0)
const selAgregsAgeGroup = ref([])

const req = ref([false, false, false, false])

const grossContrib = ref(-1)
const assistTotal = ref(-1)
const liqPrevAgregContrib = ref(-1)
const agregsContrib = ref([])
const liqContrib = ref(-1)

function resetInst() {
  resetType()
  simAble(0)
  selPlano.value = null
}

function resetType() {
  selSalGroup.value = null
  selTitAgeGroup.value = null
  depCount.value = 0
  agregCount.value = 0
  selBenefsAgeGroup.value = []
  selAgregsAgeGroup.value = []

  req.value = [true, true, false, false]

  grossContrib.value = -1
  assistTotal.value = -1
  liqPrevAgregContrib.value = -1
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

function increment(type) {
  if (type) {
    depCount.value++
    selBenefsAgeGroup.value.push()
    req.value.push(false)
  } else {
    agregCount.value++
    selAgregsAgeGroup.value.push()
    req.value.push(false)
  }
}

function decrement(type) {
  if (type) {
    if (depCount.value > 0) {
      depCount.value--
      selBenefsAgeGroup.value.pop()
      req.value.pop()
    }
  } else {
    if (agregCount.value > 0) {
      agregCount.value--
      selAgregsAgeGroup.value.pop()
      req.value.pop()
    }
  }
}

function simulate() {
  let plano = selPlano.value
  let sal = selSalGroup.value

  let grossTemp = 0
  let assistTemp = 0
  let agregSum = agregCount.value === 0 ? NaN : 0
  let agregsContribTemp = []

  let prodName = productsList.value[selInst.value]
  let prodId = prodName[plano]

  // Titular
  {
    let age = selTitAgeGroup.value
    let price = priceList.value[prodId['tit']][age]

    grossTemp += price
    assistTemp += assistList.value[sal][age]
  }

  // Dependentes
  for (let key in selBenefsAgeGroup.value) {
    let age = selBenefsAgeGroup.value[key]
    let price = priceList.value[prodId['tit']][age]

    grossTemp += price
    assistTemp += assistList.value[sal][age]
  }

  // Agregados
  for (let key in selAgregsAgeGroup.value) {
    let age = selAgregsAgeGroup.value[key]
    let price = priceList.value[prodId['agreg']][age]

    agregsContribTemp.push(price)
    agregSum += parseFloat(price)
  }
  agregsContrib.value = agregsContribTemp

  grossContrib.value = grossTemp
  assistTotal.value = assistTemp
  let dif = grossContrib.value - assistTotal.value
  liqPrevAgregContrib.value = dif < 0 ? 0 : dif
  liqContrib.value = isNaN(agregSum)
    ? liqPrevAgregContrib.value
    : liqPrevAgregContrib.value + agregSum

  haveSim.value = true
}
</script>

<template>
  <div class="w-full flex flex-col align-center gap-4 px-6 py-12 drop-shadow-lg">
    <div class="flex flex-col lg:flex-row gap-8 justify-center items-center">
      <v-list
        lines="two"
        class="content-center py-4 px-8 w-full max-w-[32rem]"
        id="sim_about_list"
        elevation="5"
      >
        <h2>
          A contribuição ao plano de saúde do Agros é calculada com base na idade do titular e a de
          seus dependentes inscritos no plano:
        </h2>
        <v-list-item :prepend-icon="PhNumberOne">
          O titular e os dependentes diretos (cônjuges e filhos de até 21 anos, ou até 24, se forem
          estudantes universitários) recebem um auxílio-saúde do governo, que varia de acordo com o
          salário do titular e a idade dele e dos dependentes.
        </v-list-item>
        <v-list-item :prepend-icon="PhNumberTwo">
          <b>
            O valor do auxílio-saúde é subtraído do valor de contribuição do titular e dos
            dependentes diretos </b
          >. Em alguns casos, dependendo do salário do titular e das idades dos Dependentes, o valor
          devido ao plano pode ser igual a zero.
        </v-list-item>
        <v-list-item :prepend-icon="PhNumberThree">
          Os demais dependentes são chamados de "agregados" (filhos acima de 21 anos ou de 24 anos,
          netos e bisnetos) e não têm direito ao auxílio-saúde suplementar, por isso, para eles a
          contribuição devida é igual ao valor da tabela.
        </v-list-item>
      </v-list>
      <div id="form_container">
        <div id="fill_all_container">
          <p>Preencha todos os dados abaixo para fazer sua simulação</p>
        </div>
        <div class="w-full flex flex-col justify-center gap-4">
          <div>
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
              label="Faixa salarial do titular"
              variant="underlined"
              v-model="selSalGroup"
              :disabled="!selInst"
              @update:modelValue="simAble(2)"
              :prepend-inner-icon="PhMoney"
            ></v-select>
            <v-select
              :items="Object.keys(Object.values(priceList)[0])"
              density="comfortable"
              :label="type ? 'Faixa etária do titular' : 'Faixa etária do agregado 1'"
              variant="underlined"
              v-model="selTitAgeGroup"
              :disabled="!selInst"
              @update:modelValue="simAble(3)"
              :prepend-inner-icon="PhUserGear"
            ></v-select>
          </div>
          <div class="flex flex-col md:flex-row gap-8">
            <div id="dep_container">
              <h2>Dependente(s)</h2>
              <v-select
                v-for="index in depCount"
                :key="index"
                :items="Object.keys(Object.values(priceList)[0])"
                density="comfortable"
                :label="'Faixa etária do dependente ' + index"
                variant="underlined"
                v-model="selBenefsAgeGroup[index]"
                :disabled="!selInst"
                @update:modelValue="simAble(3 + index)"
                :prepend-inner-icon="
                  index === 1
                    ? PhUser
                    : index === 2
                      ? PhUsers
                      : index === 3
                        ? PhUsersThree
                        : PhUsersFour
                "
              ></v-select>
              <div class="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <v-btn
                  variant="outlined"
                  @click="increment(true)"
                  :disabled="!selInst"
                  :prepend-icon="PhPlus"
                  class="sm:w-1/2"
                >
                  Dependente
                </v-btn>
                <v-btn
                  variant="outlined"
                  @click="decrement(true)"
                  :disabled="depCount === 0 || !selInst"
                  :prepend-icon="PhMinus"
                  class="sm:w-1/2"
                >
                  Dependente
                </v-btn>
              </div>
            </div>
            <div id="agreg_container">
              <h2>Agregado(s)</h2>
              <v-select
                v-for="index in agregCount"
                :key="index"
                :items="Object.keys(Object.values(priceList)[0])"
                density="comfortable"
                :label="'Faixa etária do agregado ' + index"
                variant="underlined"
                v-model="selAgregsAgeGroup[index]"
                :disabled="!selInst"
                @update:modelValue="simAble(3 + index + depCount)"
                :prepend-inner-icon="
                  index === 1
                    ? PhUser
                    : index === 2
                      ? PhUsers
                      : index === 3
                        ? PhUsersThree
                        : PhUsersFour
                "
              ></v-select>
              <div class="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <v-btn
                  variant="outlined"
                  @click="increment(false)"
                  :disabled="!selInst"
                  :prepend-icon="PhPlus"
                  class="sm:w-1/2"
                >
                  Agregado
                </v-btn>
                <v-btn
                  variant="outlined"
                  @click="decrement(false)"
                  :disabled="agregCount === 0 || !selInst"
                  :prepend-icon="PhMinus"
                  class="sm:w-1/2"
                >
                  Agregado
                </v-btn>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full mt-4 flex justify-center">
          <v-btn
            class="w-fit"
            variant="outlined"
            @click="simulate"
            :disabled="!isAble()"
            :prepend-icon="PhCalculator"
          >
            Simular
          </v-btn>
        </div>
      </div>
    </div>
    <v-divider
      v-if="haveSim && grossContrib !== -1"
      class="w-full px-8 border-black mt-4 max-w-[80rem]"
      :opacity="0.4"
    ></v-divider>
    <SimResult
      v-if="haveSim && grossContrib !== -1"
      :liqContrib="liqContrib"
      :agregsContrib="agregsContrib"
      :liqPrevAgregContrib="liqPrevAgregContrib"
      :assistTotal="assistTotal"
      :grossContrib="grossContrib"
    />
    <v-list id="warning_label" elevation="5">
      <v-list-item-title>Importante</v-list-item-title>
      <v-list-item>
        Os valores obtidos nesta simulação resultam de projeções e têm caráter apenas ilustrativo,
        não gerando qualquer direito ou obrigação do Agros quanto ao seu recebimento.
      </v-list-item>
    </v-list>
  </div>
</template>

<style scoped>
.v-btn {
  @apply bg-primary
  text-white
  !important;
}

#sim_about_list {
  @apply text-secondary
  !important;
}

#sim_about_list > .v-list-item {
  @apply text-sm
  text-gray-dark
  !important;
}

#sim_about_list > h2 {
  @apply text-gray-dark
  font-bold
  !important;
}

#fill_all_container {
  @apply text-center
  font-bold
  text-lg
  text-gray-dark
  mb-4
  !important;
}

#dep_container > h2,
#agreg_container > h2 {
  @apply text-center
  mb-4
  text-gray-dark
  text-lg
  font-bold
  !important;
}

.v-select {
  @apply w-full
  !important;
}

.v-list {
  @apply rounded-lg
  !important;
}

#warning_label {
  @apply content-center
  py-4
  px-8
  w-fit
  text-gray-dark
  mt-4
  !important;
}

#warning_label > .v-list-item-title {
  @apply font-bold
  text-center
  text-xl
  mb-4
  !important;
}

#calc_list {
  @apply !important;
}
</style>
