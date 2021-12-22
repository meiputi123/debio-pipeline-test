<style scoped lang="scss">
.pop-up-main{
    justify-content: space-between;
    height: 100%;

    p {
        height: 27px;
    }
    .v-btn {
        margin-bottom: 58px;
    }
}
</style>

<template lang="pug">
     LandingPagePopUp(:previous='previous')
        template(v-slot:header) Import Keystore
        template(v-slot:main): div.pop-up-main
            div
                p Choose your JSON Keystore File
                v-file-input(label='Select File' truncate-length='15' @change='setKeystoreFileInputListener')
            div
                v-btn.white--text(elevation='0' color='primary' @click='changePassword') Continue
</template>

<script>
import LandingPagePopUp from "@/views/LandingPage/LandingPagePopUp.vue"

export default {
  name: "SelectFile",

  data: () => ({
    keystore: "",
    password: ""
  }),

  components: {
    LandingPagePopUp
  },

  methods: {
    previous() {
      this.$router.push({name: "forgot-password"})
    },

    changePassword() {
      this.$router.push({name: "change-password"})
    },

    setKeystoreFileInputListener(files) {
      const file = files[0]
      this.fileName = file.name

      const fr = new FileReader()
      fr.onload = async function () {
        // TODO: Validate if valid keystore
        this.keystore = fr.result
      }
      fr.readAsText(file)
    }
  }
}
</script>
