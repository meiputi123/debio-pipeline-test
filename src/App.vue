<template lang="pug">
  div#app: v-app
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">
    div(v-if="isLoadingSubstrateApi") Loading...
    NoAccessMobile(v-else-if="isMobileDevice")
    router-view(v-else)
</template>
  
<script>
import { mapState, mapActions } from "vuex"
import NoAccessMobile from "@/views/NoAccessMobile.vue"
import { generalDebounce } from "@/common/lib/utils"

export default {
  name: "App",

  components: { NoAccessMobile },

  data: () => ({
    address: "",
    isMobileDevice: false
  }),

  computed: {
    ...mapState({
      substrateApi: (state) => state.substrate.api,
      isLoadingSubstrateApi: (state) => state.substrate.isLoadingApi,
      web3: (state) => state.metamask.web3
    })
  },

  mounted() {
    const mobileDevices = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Apple Safari|Safari/i
    this.handleChangeDevices(mobileDevices, window.innerWidth)

    const handleResize = generalDebounce(
      () => {
        this.handleChangeDevices(mobileDevices, window.innerWidth)
      },
      150
    )

    window.addEventListener("resize", handleResize)
  },

  methods: {
    ...mapActions({
      initWeb3: "metamask/initWeb3",
      initContracts: "metamask/contracts/initContracts"
    }),

    handleChangeDevices(device, width) {
      if(device.test(navigator.userAgent) && width <= 768) this.isMobileDevice = true
      else this.isMobileDevice = false
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap');
@import "@/common/styles/variables.scss";

* {
  font-family: "Open Sans", sans-serif;
}

::-moz-selection { /* Code for Firefox */
  background: #5640A5;
  color: #FFFFFF;
}

::selection {
  background: #5640A5;
  color: #FFFFFF;
}

@media screen and (min-width: 1904px) {
  .container {
    max-width: 1400px !important;
  }
}
.dg-card {
  border-radius: 10px !important;
  box-shadow: unset !important;
  filter: drop-shadow(0px 7px 20px rgba(0, 0, 0, 0.07));

  &.alert {
    background-color: $color-primary !important;
  }
}
</style>
