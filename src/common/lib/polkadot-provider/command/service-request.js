import store from "@/store"

export async function generateRequestId (api, pair, country, region, city, category) {
  const result = await api.tx.serviceRequest
    .generateRequestId(country, region, city, category)
    .signAndSend(pair, { nonce: -1})
    // return request id 
  return result.toHuman()
}

export async function createRequest(api, pair, country, region, city, category, price) {
  const web3 = store.getters["metamask/getWeb3"]
  const amount = web3.utils.toWei(String(price), "ether")
  const result = await api.tx.serviceRequest
    .createRequest(country, region, city, category, amount)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function unstakeRequest (api, pair, requestId, callback = () => {}) {
  const unsub = await api.tx.serviceRequest
    .unstake(requestId)
    // .signAndSend(pair, { nonce: -1})
    .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
      if(status.isFinalized) {
        const eventList = events.filter(({ event }) =>
          api.events.system.ExtrinsicSuccess.is(event)
        )
        if(eventList.length > 0){
          callback()
          unsub()
        }
      }
    })
}

export async function retrieveUnstakedAmount (api, pair, requestId) {
  const result = await api.tx.serviceRequest
    .retrieveUnstakedAmount(requestId)
    .signAndSend(pair, { nonce: -1})
  return result.toHuman()
}

export async function claimRequest(api, pair, requestId, serviceId, testingPrice, qcPrice) {
  const result = await api.tx.serviceRequest
    .claimRequest(requestId, serviceId, testingPrice, qcPrice)
    .signAndSend(pair, { nonce: -1})
  return result.toHuman()
}

export async function processRequest(api, pair, labId, requestId, orderId, dnaSampleTrackingId, additionalStakingAmount) {
  const result = await api.tx.serviceRequest
    .processRequest(labId, requestId, orderId, dnaSampleTrackingId, additionalStakingAmount)
    .signAndSend(pair, { nonce: -1})
  return result.toHuman()
}

export async function finalizeRequest(api, pair, requestId, testResultSuccess) {
  const result = await api.tx.serviceRequest
    .finalizeRequest(requestId, testResultSuccess)
    .signAndSend(pair, { nonce: -1})
  return result.toHuman()
}
