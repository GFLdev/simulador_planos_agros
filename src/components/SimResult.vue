<script setup>
import { ref, toRef } from 'vue'
import {
  PhIdentificationCard,
  PhAt,
  PhPaperPlaneTilt,
  PhX,
  PhSpinner,
  PhEnvelope,
  PhCheckCircle,
  PhXCircle
} from '@phosphor-icons/vue'
import { formatEmail, formatPrice } from '@/middleware/formatEmail.js'

const props = defineProps({
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
  },
  inst: {
    type: String,
    required: true
  },
  plano: {
    type: String,
    required: true
  },
  salGroup: {
    type: String,
    required: true
  },
  titAgeGroup: {
    type: String,
    required: true
  },
  benefsAgeGroup: {
    type: Array,
    required: true
  },
  agregsAgeGroup: {
    type: Array,
    required: true
  }
})

const name = ref()
const email = ref()

const dialog = ref(false)
const loading = ref(false)

const statusCode = ref()
const statusText = ref()

function openDialog() {
  statusCode.value = null
  statusText.value = null

  dialog.value = true
}

function closeDialog() {
  dialog.value = false
}

async function sendEmailHandler() {
  loading.value = true
  const emailBody = formatEmail(
    name.value,
    toRef(props.inst).value,
    toRef(props.plano).value,
    toRef(props.salGroup).value,
    toRef(props.titAgeGroup).value,
    toRef(props.benefsAgeGroup).value,
    toRef(props.agregsAgeGroup).value,
    toRef(props.grossContrib).value,
    toRef(props.assistTotal).value,
    toRef(props.liqPrevAgregContrib).value,
    toRef(props.agregsContrib).value,
    toRef(props.liqContrib).value
  )

  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      emailToId: email.value,
      emailToName: name.value,
      emailSubject: 'Simulador do Plano de Saúde - Agros',
      emailBody: emailBody
    })
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/send-email`, requestOptions).finally(
    () => (loading.value = false)
  )

  const data = await res.json()

  statusCode.value = data.code
  statusText.value = data.message
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
    </div>
<!--    <div class="flex justify-center items-center my-4">-->
<!--      <v-btn @click="openDialog" id="open_dialog_btn"> Receba essa simulação por e-mail</v-btn>-->
<!--      <v-dialog-->
<!--        v-model="dialog"-->
<!--        width="auto"-->
<!--        :onclose="closeDialog"-->
<!--        @keydown.enter="!!email && !!name && !loading ? sendEmailHandler : null"-->
<!--      >-->
<!--        <v-card id="send_email_popup">-->
<!--          <v-card-title>-->
<!--            <div class="flex flex-row justify-center gap-2">-->
<!--              <span class="w-fit block" v-if="!statusCode">-->
<!--                <PhEnvelope class="text-3xl" />-->
<!--              </span>-->
<!--              <span class="w-fit block" v-else-if="statusCode >= 200 && statusCode < 300">-->
<!--                <PhCheckCircle class="text-3xl" />-->
<!--              </span>-->
<!--              <span class="w-fit block" v-else>-->
<!--                <PhXCircle class="text-3xl" />-->
<!--              </span>-->
<!--              <h1>-->
<!--                {{-->
<!--                  !statusCode-->
<!--                    ? 'Preencha os campos para o envio do email'-->
<!--                    : statusCode >= 200 && statusCode < 300-->
<!--                      ? 'Sucesso'-->
<!--                      : 'Erro'-->
<!--                }}-->
<!--              </h1>-->
<!--            </div>-->
<!--          </v-card-title>-->
<!--          <div v-if="statusCode >= 200 && statusCode < 300">-->
<!--            <p>Email enviado com sucesso para {{ email }}</p>-->
<!--          </div>-->
<!--          <div v-else-if="statusCode">-->
<!--            <p>{{ statusText }}</p>-->
<!--          </div>-->
<!--          <div v-else>-->
<!--            <v-text-field-->
<!--              label="Nome"-->
<!--              density="comfortable"-->
<!--              variant="underlined"-->
<!--              :prepend-inner-icon="PhIdentificationCard"-->
<!--              :v-if="!statusCode"-->
<!--              v-model="name"-->
<!--            ></v-text-field>-->
<!--            <v-text-field-->
<!--              label="Email"-->
<!--              density="comfortable"-->
<!--              variant="underlined"-->
<!--              :v-if="!statusCode"-->
<!--              :prepend-inner-icon="PhAt"-->
<!--              v-model="email"-->
<!--              type="email"-->
<!--            ></v-text-field>-->
<!--          </div>-->
<!--          <template v-slot:actions>-->
<!--            <div id="email_btn_container">-->
<!--              <v-btn-->
<!--                :text="loading ? 'Enviando' : 'Enviar'"-->
<!--                id="send_email_btn"-->
<!--                :disabled="!email || !name || loading || !!statusCode"-->
<!--                :prepend-icon="loading ? PhSpinner : PhPaperPlaneTilt"-->
<!--                @click="sendEmailHandler"-->
<!--              ></v-btn>-->
<!--              <v-btn-->
<!--                text="Fechar"-->
<!--                id="close_dialog_btn"-->
<!--                :prepend-icon="PhX"-->
<!--                @click="closeDialog"-->
<!--              ></v-btn>-->
<!--            </div>-->
<!--          </template>-->
<!--        </v-card>-->
<!--      </v-dialog>-->
<!--    </div>-->
  </v-list>
</template>

<style scoped>
#email_btn_container {
  @apply mt-4
  w-full
  flex
  flex-row
  justify-center
  !important;
}

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

#send_email_popup {
  @apply text-gray-dark
  px-8
  py-4
  !important;
}

#send_email_btn {
  @apply bg-primary
  text-white
  !important;
}

#close_dialog_btn {
  @apply bg-red
  text-white
  !important;
}

#open_dialog_btn {
  @apply bg-green
  !important;
}
</style>
