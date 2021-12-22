import axios from "axios"

// EXPORT API COLLECTIONS HERE
export * from "./categories"
export * from "./debio-balance"
export * from "./emr"
export * from "./gcs"
export * from "./labs"
export * from "./location"
export * from "./orders"
export * from "./rating"
export * from "./service-request"

// AXIOS INSTANCE EXPORT BY DEFAULT
// PLEASE DISCUSS BEFORE YOU WANT TO EDIT THIS SCRIPT
const apiClientRequest = axios.create({
  baseURL: process.env.VUE_APP_BACKEND_API,
  headers: { "Content-Type": "application/json" }
})

export default apiClientRequest
