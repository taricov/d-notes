import { createApp } from 'vue'
import '../styles'
import 'vuetify/styles'
// import '@mdi/font/css/materialdesignicons.css'
// import '@fortawesome/fontawesome-free/css/all.css'

// import ElementPlus from 'element-plus'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import App from './Options.vue'
import { setupApp } from '~/logic/common-setup'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  components,
  directives,
})
const app = createApp(App)
setupApp(app)
// set secure, only https works
app.use(vuetify)
// app.use(ElementPlus)
app.mount('#app')
