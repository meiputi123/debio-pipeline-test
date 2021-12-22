import { shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import MnemonicList from "@/views/LandingPage/GenerateAccount/GenerateMnemonic/MnemonicList.vue"

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
    const wrapper = shallowMount(MnemonicList, {
      propsData: { mnemonicCollection: ["a", "b", "c"] },
      localVue,
      vuetify: new Vuetify()
    })
      
    expect(wrapper.exists()).toBe(true)
  })
})
