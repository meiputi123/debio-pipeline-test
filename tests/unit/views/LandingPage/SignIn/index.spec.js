import { shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import SignIn from "@/views/LandingPage/SignIn"

describe("Sign In Page", () => {
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
    const wrapper = shallowMount(SignIn, {
      localVue,
      vuetify: new Vuetify(),
      store: new Vuex.Store()
    })
      
    expect(wrapper.exists()).toBe(true)
  })
})
