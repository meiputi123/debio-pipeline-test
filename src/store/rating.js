import apiClientRequest from "@/common/lib/api"

const defaultState = {
  labRate: null,
  serviceRate: null
}

export default {
  namespaced: true,

  state: {
    ...defaultState
  },

  mutations: {
    SET_LAB_RATE(state, rate) {
      state.labRate = rate
    },

    SET_SERVICE_RATE(state, rate) {
      state.serviceRate = rate
    }
  },
  actions: {
    async getLabRate({ commit }, address ) {
      const rate = await apiClientRequest.get(`/rating/lab/${address}`)
      commit("SET_LAB_RATE", rate.data)
      return rate.data
    },

    async getServiceRate({ commit }, address) {
      const rate = await apiClientRequest.get(`/rating/service/${address}`)
      commit("SET_SERVICE_RATE", rate.data)
      return rate.data
    }
  },

  getters: {
    getLabRate(state) {
      return state.labRate
    },

    getServiceRate(state) {
      return state.serviceRate
    }
  }
}
