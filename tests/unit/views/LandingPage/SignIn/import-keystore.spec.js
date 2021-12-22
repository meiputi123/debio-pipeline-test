import { shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import ImportKeystore from "@/views/LandingPage/SignIn/ImportKeystore"

describe("Import Keystore Page", () => {
  let localVue = null

  beforeEach(() => {
    localVue = require("vue")
    localVue.use(Vuetify)
  })

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {
    const wrapper = shallowMount(ImportKeystore, {
      localVue,
      vuetify: new Vuetify()
    })
      
    expect(wrapper.exists()).toBe(true)
  })
})
