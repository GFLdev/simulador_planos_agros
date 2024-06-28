<script setup>
import SimPlanoTitBenefForm from '@/components/SimPlanoTitBenefForm.vue'
import Header from "@/components/SimHeader.vue";
import Footer from "@/components/SimFooter.vue";
</script>

<template>
  <Header></Header>

  <main>
    <SimPlanoTitBenefForm :inst="inst"/>
  </main>

  <Footer></Footer>
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
