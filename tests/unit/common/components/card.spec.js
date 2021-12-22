import { mount, RouterLinkStub } from "@vue/test-utils"
import Card from "@/common/components/Card"
import Icon from "@/common/components/Icon"

describe("Common Card", () => {
  it("Should render", () => {
    mount(Card)
  })

  it("Should render tiny card as router-link", () => {
    const tinyCard = true
    const to = "/"
    const container = mount(Card, {
      propsData: { tinyCard, to },
      stubs: {
        RouterLink: RouterLinkStub
      }
    })

    expect(container.findComponent(RouterLinkStub).props().to).toBe("/")
  })

  it("Should render tiny card with default title and subtitle value", () => {
    const tinyCard = true
    const container = mount(Card, {
      propsData: { tinyCard }
    })

    expect(container.text()).toContain("Card Title")
    expect(container.text()).toContain("Card Subtitle")
  })

  it("Should render tiny card with custom title and subtitle value", () => {
    const tinyCard = true
    const title = "Custom title"
    const subTitle = "Custom subtitle"

    const container = mount(Card, {
      propsData: { tinyCard, title, subTitle }
    })

    expect(container.text()).toContain(title)
    expect(container.text()).toContain(subTitle)
  })

  it("Should render tiny card with icon", () => {
    const tinyCard = true
    const withIcon = true
    const container = mount(Card, {
      propsData: { withIcon, tinyCard },
      stubs: {
        UiDebioIcon: Icon
      }
    })

    expect(container.findComponent(Icon).exists()).toBe(true)
  })
})
