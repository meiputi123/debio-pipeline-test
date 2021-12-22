import { shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import GenerateAccount from "@/views/LandingPage/GenerateAccount"

describe("Generate Account Page", () => {
  let localVue = null

  beforeEach(() => {
    localVue = require("vue")
    localVue.use(Vuetify)
  })

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {
    const wrapper = shallowMount(GenerateAccount, {
      localVue,
      vuetify: new Vuetify()
    })
      
    expect(wrapper.exists()).toBe(true)
  })
})
