import apiClientRequest from "@/common/lib/api"

export const getEMRCategories = async () => {
  const { data } = await apiClientRequest.get("/emr-category")
  
  return data
}
