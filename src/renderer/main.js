import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import { Titlebar, Color } from 'custom-electron-titlebar'
import { ipcRenderer } from 'electron'

import VModal from 'vue-js-modal'
import ConnectModal from '@/components/ConnectModal.vue'
import PreferencesModal from '@/components/PreferencesModal.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

library.add(fas, far, fab)

Vue.use(VModal, { dynamic: true })
Vue.component('fa-icon', FontAwesomeIcon)

router.replace('/loading')

/* eslint-disable no-new */
const app = new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

new Titlebar({
  backgroundColor: Color.fromHex('#000000'),
  overflow: 'hidden'
})

ipcRenderer.on('button', (_, message) => {
  switch (message.event) {
  case 'STATE': {
    store.dispatch('boards/SET_BUTTON_STATE', {
      row: message.data.row,
      column: message.data.column,
      state: message.data.state
    })
    break
  }
  }
})

ipcRenderer.on('application', (_, message) => {
  switch (message.event) {
  case 'CONNECT_PHONE': {
    app.$modal.show(ConnectModal, {}, {
      scrollable: true,
      styles: 'background-color: #212121;',
      height: 'auto'
    })
    break
  }
  case 'OPEN_PREFERENCES': {
    app.$modal.show(PreferencesModal, {}, {
      scrollable: true,
      styles: 'background-color: #212121;',
      height: 'auto'
    })
    break
  }
  }
})