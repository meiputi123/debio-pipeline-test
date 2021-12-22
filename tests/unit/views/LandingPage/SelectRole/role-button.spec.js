import { mount } from "@vue/test-utils"
import RoleButton from "@/views/LandingPage/SelectRole/RoleButton"

describe("Select Role Input", () => {
  it("Should render", () => {
    mount(RoleButton, {
      propsData: { role: "Customer" }
    })
  })
})
