import { shallowMount, createLocalVue } from "@vue/test-utils"
import Layout from "@/views/LandingPage/Layout"
import VueRouter from "vue-router"

describe("Landing Page Layout", () => {
  let wrapper
  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = new VueRouter()
    wrapper = shallowMount(Layout, {
      localVue,
      router
    })
  })

  it("Should render", () => {
    expect(wrapper.exists()).toBe(true)
  })
})
