import { shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import LandingPage from "@/views/LandingPage"

describe("Landing Page", () => {
  let localVue = null

  beforeEach(() => {
    localVue = require("vue")
    localVue.use(Vuetify)
  })

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {
    const wrapper = shallowMount(LandingPage, {
      localVue,
      vuetify: new Vuetify()
    })
      
    expect(wrapper.exists()).toBe(true)
  })
})
