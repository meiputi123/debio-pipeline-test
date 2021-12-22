import apiClientRequest from "@/common/lib/api"

const defaultState = {
  resultMsg: null
}

export default {
  namespaced: true,
  state: { ...defaultState },
  mutations: {
    SET_RESULT(state, resultMsg) {
      state.resultMsg = resultMsg
    }
  },
  actions: {
    async walletBinding({commit}, data) {
      
      const debioApiKey = process.env.VUE_APP_DEBIO_API_KEY
      const result = await apiClientRequest.post("/substrate/wallet-binding", data, {
        headers: { "debio-api-key" : debioApiKey },
        auth: {
          username: process.env.VUE_APP_USERNAME,
          password: process.env.VUE_APP_PASSWORD
        }
      })
      commit("SET_RESULT", result.data)
    }
  }
}
