import { mount } from "@vue/test-utils"
import Recaptcha from "@/common/components/Recaptcha"

describe("Recaptcha", () => {
  it("Should render", () => {
    mount(Recaptcha, {
      propsData: { verify: () => {} }
    })
  })
})
