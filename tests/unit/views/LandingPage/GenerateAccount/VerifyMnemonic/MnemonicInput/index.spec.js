import { shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import MnemonicInput from "@/views/LandingPage/GenerateAccount/VerifyMnemonic/MnemonicInput"

describe("Mnemonic List", () => {
  let localVue = null

  beforeEach(() => {
    localVue = require("vue")
    localVue.use(Vuetify)
  })

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {
    const wrapper = shallowMount(MnemonicInput, {
      localVue,
      vuetify: new Vuetify()
    })
      
    expect(wrapper.exists()).toBe(true)
  })
})
