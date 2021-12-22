import { shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import ForgotPassword from "@/views/LandingPage/SignIn/ForgotPassword"

describe("Forgot Password Successful Page", () => {
  let localVue = null

  beforeEach(() => {
    localVue = require("vue")
    localVue.use(Vuetify)
  })

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {
    const wrapper = shallowMount(ForgotPassword, {
      localVue,
      vuetify: new Vuetify()
    })
      
    expect(wrapper.exists()).toBe(true)
  })
})
