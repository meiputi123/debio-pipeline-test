<style scoped lang="scss">
@import "@/common/styles/variables.scss";

.pop-up-main{
    width: 500px;
    height: 400px;

    display: grid !important;
    grid-template-columns: 50% 50%;
    grid-template-rows: 50% 50%;
    grid-template-areas: 
        "customer" "lab"
        "doctor" "hospital";

    font-family: Raleway;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 150%;
}
</style>

<template lang="pug">
     LandingPagePopUp
        template(v-slot:main): div.pop-up-main
            RoleButton(v-for="role in roles" :key="role.id" :role="role")
</template>

<script>
import LandingPagePopUp from "@/views/LandingPage/LandingPagePopUp.vue"
import RoleButton from "./RoleButton.vue"

export default {
  name: "InputPassword",
  data: () => ({
    roles: [
      "Customer",
      "Lab",
      "Doctor",
      "Hospital"
    ]
  }),
  components: {
    LandingPagePopUp,
    RoleButton
  },
  methods: {
    previous() {
      this.$router.push({name: "landing-page"})
    }
  }
}
</script>
