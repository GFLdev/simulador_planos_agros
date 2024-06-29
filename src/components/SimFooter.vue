<script setup>
import {
  PhFacebookLogo,
  PhHospital,
  PhInstagramLogo,
  PhYoutubeLogo
} from '@phosphor-icons/vue'
</script>

<template>
  <div
    class="
      w-screen
      py-10
      px-20
      bg-[url('/bg-simulator.jpg')]
      bg-cover
      bg-right
      flex
      flex-row
      flex-wrap
      justify-center
      items-center
      gap-4"
  >
    <PhHospital
      :size="64"
      weight="fill"
      id="footer_icon"
    />
    <div
      class="
        flex
        flex-col
        max-w-xl
        justify-center
        items-center
        gap-4"
    >
      <p
        class="
          text-xl
          sm:text-left"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
        accumsan diam eu dapibus tempor. Nullam egestas porta tellus, in
        posuere erat cursus ut. Duis sed nisi pharetra:
      </p>
      <v-btn
        id="contact_btn"
        href="https://www.agros.org.br/fale-conosco"
        target="_blank"
      >
        Fale Conosco
      </v-btn>
    </div>
  </div>
  <footer
    class="
      w-screen
      bg-gradient-90
      from-secondary
      to-primary
      py-8
      px-16
      flex
      justify-center
      items-center"
  >
    <div
      class="
        w-full
        sm:w-2/3
        flex
        flex-col
        gap-2"
      id="footer_main_container"
    >
      <div
        class="
          grid
          grid-flow-row
          sm:grid-flow-col
          gap-4"
        id="links_container"
      >
        <div id="social_media_container">
          <p>
            Redes Sociais
          </p>
          <div
            class="
              flex
              flex-row
              justify-center
              items-center"
          >
            <a
              href="https://pt-br.facebook.com/agrosprevsaude"
              target="_blank"
              class="w-fit"
            >
              <PhFacebookLogo
                :size="40"
                color="#fff"
              />
            </a>
            <a
              href="https://www.instagram.com/agrosprevsaude"
              target="_blank"
              class="w-fit"
            >
              <PhInstagramLogo
                :size="40"
                color="#fff"
              />
            </a>
            <a
              href="https://www.youtube.com/channel/UChUKP6U9ti4DXmTpBFAYeMw"
              target="_blank"
              class="w-fit"
            >
              <PhYoutubeLogo
                :size="40"
                color="#fff"
              />
            </a>
          </div>
        </div>
        <div id="gov_inst_container">
          <a
            href="https://www.ans.gov.br/"
            target="_blank"
            class="w-fit"
          >
            <v-img
              src="/ans.png"
              width="200"
            ></v-img>
          </a>
          <a
            href="https://www.gov.br/economia/pt-br/orgaos/entidades-vinculadas/autarquias/previc"
            target="_blank"
            class="w-fit"
          >
            <v-img
              src="/previc.png"
              width="200"
            ></v-img>
          </a>
        </div>
      </div>
      <v-divider
        class="
          w-full
          px-8
          border-white
          my-4"
        :opacity="0.2"
      ></v-divider>
      <p
        class="
          text-center
          text-white"
      >
        Copyright © {{ new Date().getFullYear() }} Agros - Todos os direitos
        reservados
      </p>
    </div>
  </footer>
</template>

<style scoped>
#contact_btn {
  @apply
  w-fit
  bg-primary
  text-lg
  text-white
  !important;
}

#footer_icon {
  @apply
  text-primary
  w-64
  h-64
  !important;
}

#social_media_container {
  @apply
  flex
  flex-col
  justify-center
  justify-self-center
  items-center
  !important;
}

#social_media_container > p {
  @apply
  text-white
  text-center
  sm:text-left
  font-bold
  text-xl
  !important;
}

#gov_inst_container {
  @apply
  flex
  flex-col
  gap-4
  justify-self-center
  sm:justify-self-end
  !important;
}
</style>