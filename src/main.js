import '/src/assets/style.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives
})

// VueRouter
import { createMemoryHistory, createRouter } from 'vue-router'
const routes = [{ path: '/', component: App }]
const router = createRouter({
  history: createMemoryHistory(),
  routes
})

// Vue
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(vuetify).use(router).mount('#app')
