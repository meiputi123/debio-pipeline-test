<script>
import { mapState } from "vuex"
export default {
  name: "RoleButton",

  props: {
    color: { type: String, default: "#FA587B" },
    fill: Boolean,
    role: String
  },

  computed: {
    ...mapState({
      configApp: (state) => state.auth.configApp
    }),

    fillColor() {
      return this.fill ? "currentColor" : "transparent"
    },

    computeStyle() {
      return { color: this.color }
    },

    computeRoleLowerCase(){
      return this.role.toLowerCase()
    },

    computeRoleCapitalCase(){
      return `${this.computeRoleLowerCase.charAt(0).toUpperCase()}${this.computeRoleLowerCase.slice(1)}`
    }
  },

  methods: {
    async dashboard(){
      if (this.computeRoleLowerCase === "customer") {
        this.$router.push(`/${this.computeRoleLowerCase}`)
        return
      } 
      window.open(`${this.configApp.labDashboardUrl}/${this.computeRoleLowerCase}`)
    }
  }
}
</script>

<template lang="pug">
  //- TODO: Change to SVG later
  div.svg-container
    div.role-svg(v-on:click='dashboard')
      img(v-if='computeRoleLowerCase == "customer"' src="@/assets/customer-icon.png")
      img(v-else-if='computeRoleLowerCase == "lab"' src="@/assets/lab-icon.png")
      img(v-else-if='computeRoleLowerCase == "doctor"' src="@/assets/doctor-icon.png")
      img(v-else src="@/assets/hospital-icon.png")
    div {{ computeRoleCapitalCase }}
</template>

<style scoped lang='scss'>
.svg-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.role-svg {
  width: 110px;
  height: 110px;

  background: #FFFFFF;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 50%;

  padding: 5px;
  margin-bottom: 10px;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  & > svg {
    display: block;
  }

  & + div {
    margin: 5px;
    text-align: center;
    cursor: pointer;
  }
}
</style>
