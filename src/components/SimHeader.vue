<script setup>
import { PhMathOperations } from '@phosphor-icons/vue'
</script>

<template>
  <header
    class="w-screen bg-gradient-90 from-secondary to-primary py-8 px-16 flex flex-row justify-center"
  >
    <div>
      <a href="https://www.agros.org.br/" target="_blank">
        <v-img src="/logo.svg" class="w-[200px] sm:w-[300px]"></v-img>
      </a>
    </div>
  </header>
  <div class="py-8 sm:py-16 bg-[url('/bg-header.jpg')] w-screen h-fit bg-cover bg-right">
    <h2
      class="text-2xl sm:text-[2rem] font-bold flex flex-row justify-center items-center"
      id="header_h2"
    >
      <PhMathOperations class="w-[3rem] h-[3rem] sm:w-[4rem] sm:h-[4rem]" weight="fill" /> Simulador
      Plano de Saúde
    </h2>
  </div>
</template>

<style scoped>
#header_h2 {
  @apply text-primary;
}
</style>
