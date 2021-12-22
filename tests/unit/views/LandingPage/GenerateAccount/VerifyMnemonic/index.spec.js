import { shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import VerifyMnemonic from "@/views/LandingPage/GenerateAccount/VerifyMnemonic"

describe("Verify Mnemonic Component", () => {
  let localVue = null

  beforeEach(() => {
    localVue = require("vue")
    localVue.use(Vuetify)
  })

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {
    const wrapper = shallowMount(VerifyMnemonic, {
      localVue,
      mocks: {
        $route: {
          params: {
            mnemonicCollection: ["a", "b", "c"]
          }
        }
      },
      vuetify: new Vuetify()
    })
      
    expect(wrapper.exists()).toBe(true)
  })
})
