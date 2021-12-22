import apiClientRequest from "@/common/lib/api"

export async function getServiceRequestByCustomer(customerId) {
  const serviceRequests = await apiClientRequest.get(`/service-requests/customer/${customerId}`)
  return serviceRequests
}
