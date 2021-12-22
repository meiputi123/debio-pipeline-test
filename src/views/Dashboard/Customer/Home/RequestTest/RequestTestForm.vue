<template lang="pug">
  v-row(class="d-flex justify-center mt-16")
    v-col(cols="5")
      label.request-test-form Country
      v-autocomplete.request-test-form(
        dense
        key="country"
        v-model="country"
        :items="countries"
        item-text="name"
        item-value="iso2"
        placeholder="Select Country"
        @change="onCountryChange"
        autocomplete="off"
        outlined)

      label.request-test-form State/Province
      v-autocomplete.request-test-form(
        dense
        key="state"
        v-model="state"
        :items="states"
        item-text="name"
        item-value="state_code"
        placeholder="Select State/Province"
        :disabled="!country"
        @change="onStateChange"
        autocomplete="off"
        outlined)

      label.request-test-form City
      v-autocomplete.request-test-form(
        dense
        key="city"
        v-model="city"
        :items="cities"
        item-text="name"
        return-object
        placeholder="Select City"
        :disabled="!state"
        @change="onCityChange"
        autocomplete="off"
        outlined)

      label.request-test-form Category
      v-select.request-test-form(
        dense
        :items="categories"
        item-text="service_categories"
        item-value="service_categories"
        menu-props="auto"
        placeholder="Select Category"
        :disabled="!city"
        @change="onCategoryChange"
        autocomplete="off"
        outlined)

      Button.request-test-button(
        :disabled="disable"
        color="secondary" 
        width="100%"
        height="38"
        @click= "onSubmit"
        ) Continue
</template>

<script>
import { mapState, mapMutations } from "vuex"
import { getLocations, getStates, getCities } from "@/common/lib/api"
import { getCategories } from "@/common/lib/api"
import Button from "@/common/components/Button"

export default {
  name: "RequestTestForm",

  components: {
    Button
  },

  data: () => ({
    country: "",
    state: "",
    city: "",
    category: "",
    states: [],
    cities: [],
    categories: [],
    countries: [],
    status: "RequestTest"
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      configApp: (state) => state.auth.configApp
    }),

    disable() {
      const {country, state, city, category} = this
      return !(country && state && city && category)
    }
  },
  
  async mounted() {
    await this.getCountries()
    await this.getServiceCategory()
  },

  methods: {
    ...mapMutations({
      setCategory: "lab/SET_CATEGORY"
    }),

    async getServiceCategory() {
      const data = await getCategories()
      this.categories = data
    },
      
    async getCountries() {
      const { data : { data }} = await getLocations()
      this.countries = data
    },

    async onCountryChange(selectedCountry) {
      const { data : { data }} = await getStates(selectedCountry)
      this.states = data
      this.country = selectedCountry
    },

    async onStateChange(selectedState) {
      const { data : { data }} = await getCities(this.country, selectedState)
      this.cities = data
      this.state = selectedState
    },
    
    async onCityChange(selectedCity) {
      this.city = selectedCity.name
    },

    async onCategoryChange(selectedCategory) {
      this.category = selectedCategory
    },

    async onSubmit() {
      const country = this.country
      const region = this.state
      const city = this.city
      const category = this.category
      const status = this.status
      this.setCategory(category)
      await this.$store.dispatch("lab/setCountryRegionCity", {country, region, city})
      await this.$store.dispatch("lab/getServicesByCategory", {category, status})

      this.$emit("click")
    }
  }
}


</script>


<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .request-test-form
    @include body-text-3-opensans
  
  .request-test-button
    @include button-2

</style>
