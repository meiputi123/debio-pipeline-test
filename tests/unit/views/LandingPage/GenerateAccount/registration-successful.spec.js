import { shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import RegistrationSuccessful from "@/views/LandingPage/GenerateAccount/RegistrationSuccessful"

describe("Registration Successful Page", () => {
  let localVue = null

  beforeEach(() => {
    localVue = require("vue")
    localVue.use(Vuetify)
  })

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {
    const wrapper = shallowMount(RegistrationSuccessful, {
      localVue,
      vuetify: new Vuetify()
    })
      
    expect(wrapper.exists()).toBe(true)
  })
})
