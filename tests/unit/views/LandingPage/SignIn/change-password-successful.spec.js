import { shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import ChangePasswordSuccessful from "@/views/LandingPage/SignIn/ChangePasswordSuccessful"

describe("Change Password Successful Page", () => {
  let localVue = null

  beforeEach(() => {
    localVue = require("vue")
    localVue.use(Vuetify)
  })

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {
    const wrapper = shallowMount(ChangePasswordSuccessful, {
      localVue,
      vuetify: new Vuetify()
    })
      
    expect(wrapper.exists()).toBe(true)
  })
})
