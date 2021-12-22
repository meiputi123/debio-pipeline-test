import { getServicesByCategory } from "@/common/lib/api"

const defaultState = {
  services: [],
  country: null,
  city: null,
  category: null,
  stakingData: null,
  stakingId: ""
}

export default {
  namespaced: true,

  state: {
    ...defaultState
  },

  mutations: {
    SET_COUNTRY(state, country) {
      state.country = country
    },

    SET_REGION(state, region) {
      state.region = region
    },

    SET_CITY(state, city) {
      state.city = city
    },

    SET_CATEGORY(state, category) {
      state.category = category
    },

    SET_SERVICES(state, services) {
      state.services = services
    },

    SET_STAKING_SERVICE(state, stakingService) {
      state.stakingData = stakingService
    },

    SET_STAKING_ID(state, stakingId) {
      state.stakingId = stakingId
    }
  },
  actions: {
    async setCountryRegionCity ({commit}, data) {
      commit("SET_COUNTRY", data.country)
      commit("SET_REGION", data.region)
      commit("SET_CITY", data.city)
    },

    async getServicesByCategory({ commit }, datas) {
      const { category, status } = datas
      const { data : data } = await getServicesByCategory (category, status)


      commit("SET_SERVICES", data.result)
      commit("SET_CATEGORY", category)
    }
  },

  getters: {
    getCountryRegionCity(state) {
      const { country, region, city } = state
      return { country, region, city}
    },

    getCategory(state) {
      return state.category
    },

    getIsRequestService(state) {
      return state.isRequestService
    },

    getServices(state) {
      return state.services
    }
  }
}
