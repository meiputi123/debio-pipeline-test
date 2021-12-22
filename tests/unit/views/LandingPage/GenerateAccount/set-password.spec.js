import { shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import SetPassword from "@/views/LandingPage/GenerateAccount/SetPassword"

describe("Mnemonic List", () => {
  let localVue = null

  beforeEach(() => {
    localVue = require("vue")
    localVue.use(Vuex)
    localVue.use(Vuetify)
  })

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {
    const wrapper = shallowMount(SetPassword, {
      localVue,
      vuetify: new Vuetify(),
      store: new Vuex.Store({
        state: {
          substrate: {
            isLoadingWallet: false
          }
        }
      })
    })
      
    expect(wrapper.exists()).toBe(true)
  })
})
