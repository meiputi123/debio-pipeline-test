import { shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import MnemonicKeypad from "@/views/LandingPage/GenerateAccount/VerifyMnemonic/MnemonicInput/MnemonicKeypad.vue"

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
    const wrapper = shallowMount(MnemonicKeypad, {
      propsData: { mnemonicCollection: ["a", "b", "c"] },
      localVue,
      vuetify: new Vuetify()
    })
      
    expect(wrapper.exists()).toBe(true)
  })
})
