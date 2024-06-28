<script setup>
import SimPlanoTitBenefForm from '@/components/SimPlanoTitBenefForm.vue'
</script>

<template>
  <header></header>

  <main>
    <SimPlanoTitBenefForm :inst="inst" />
  </main>

  <footer></footer>
</template>

<script>
export default {
  data() {
    return {
      inst: [
        'Agros/UFV'
      ]
    }
  }
}
</script>

<style scoped></style>
