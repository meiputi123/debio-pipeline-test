import Vue from "vue"
import Vuex from "vuex"
import auth from "./auth"
import ethereum from "./ethereum"
import metamask from "./metamask"
import testRequest from "./test-request"
import substrate from "./substrate"
import lab from "./lab"
import wallet from "./wallet"
import rating from "./rating"



Vue.use(Vuex)
Vue.config.devtools = true

export default new Vuex.Store({
  modules: {
    auth,
    ethereum,
    metamask,
    testRequest,
    substrate,
    lab,
    wallet,
    rating
  },
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters: {}
})

