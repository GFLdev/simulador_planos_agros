<script setup>
import SimuladorPlanosForm from '@/components/SimuladorPlanosForm.vue'
</script>

<template>
  <header></header>

  <main class="bg-black">
    <SimuladorPlanosForm :inst="inst" />
  </main>

  <footer></footer>
</template>

<script>
import AgrosUFVIcon from './components/inst_icons/agrosufv.png'

export default {
  data() {
    return {
      inst: {
        'Agros/UFV': {
          'image': AgrosUFVIcon
        }
      }
    }
  }
}
</script>

<style scoped></style>
