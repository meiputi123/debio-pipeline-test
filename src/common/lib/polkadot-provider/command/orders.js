export async function createOrder(api, pair, serviceId, customerBoxPublicKey, serviceFlow, priceIndex, callback = () => {}) {
  const unsub = await api.tx.orders
    .createOrder(serviceId, priceIndex, customerBoxPublicKey, serviceFlow)
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

export async function fulfillOrder(api, pair, orderId) {
  const result = await api.tx.orders
    .fulfillOrder(orderId)
    .signAndSend(pair, { nonce: -1 }, ({ status, events }) => {
      if (status.isInBlock || status.isFinalized) {
        events
          // find/filter for failed events
          .filter(({ event }) =>
            api.events.system.ExtrinsicFailed.is(event)
          )
          // we know that data for system.ExtrinsicFailed is
          // (DispatchError, DispatchInfo)
          .forEach(({ event: { data: [error, info] } }) => {
            info
            if (error.isModule) {
              // for module errors, we have the section indexed, lookup
              const decoded = api.registry.findMetaError(error.asModule)
              const { documentation, method, section } = decoded

              console.log(`${section}.${method}: ${documentation.join(" ")}`)
            } else {
              // Other, CannotLookup, BadOrigin, no extra info
              console.log(error.toString())
            }
          })
      }
    })

  console.log(result)
}

export async function refundOrder(api, pair, orderId) {
  const result = await api.tx.orders
    .refundOrder(orderId)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function setOrderPaid(api, pair, orderId) {
  const result = await api.tx.orders
    .setOrderPaid(orderId)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function cancelOrder(api, pair, orderId) {
  const result = await api.tx.orders
    .cancelOrder(orderId)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}
