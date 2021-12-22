import Customer from "@/views/Dashboard/Customer"
import Vuetify from "vuetify"
import { shallowMount } from "@vue/test-utils"
import VueRouter from "vue-router"

describe("Dashboard Customer", () => {
  let localVue = null

  beforeEach(() => {
    localVue = require("vue")
    localVue.use(VueRouter)
    localVue.use(Vuetify)
  })

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {
    const wrapper = shallowMount(Customer, {
      localVue,
      router: new VueRouter(),
      vuetify: new Vuetify()
    })
      
    expect(wrapper.exists()).toBe(true)
  })
})
