import Vue from "vue"
import Vuetify from "vuetify"
import SkinIcon from "../components/icons/SkinIcon"

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    values: {
      "dgi-skin": {
        component: SkinIcon
      }
    }
  },
  theme: {
    themes: {
      light: {
        primary: "#C400A5",
        secondary: "#5640A5"
      },
      dark: {
        primary: "#C400A5",
        secondary: "#5640A5"
      }
    }
  }
})
