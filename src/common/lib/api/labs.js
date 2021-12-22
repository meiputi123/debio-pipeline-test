import apiClientRequest from "@/common/lib/api"
import store from "@/store/index"

/**
 * 
 * @param {String} country
 * @param {String} region
 * @param {String} city
 * @param {String} category
 * @param {Boolean} isRequestService
 * 
 */

export async function getServicesByCategory(category, flow) {
  const { country, region, city} = store.getters["lab/getCountryRegionCity"]

  const params = {
    country,
    region,
    city,
    category,
    service_flow: flow
  }

  const services = await apiClientRequest.get("/labs", { params })

  return services
}
