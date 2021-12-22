export async function getCreateOrderFee(api, pair, address, indexPrice, publicKey) {
  const info = await api.tx.orders
    .createOrder(address, indexPrice, publicKey, "RequestTest")
    .paymentInfo(pair)
  return info
}

export async function getCreateRequestFee(api, pair, country, region, city, category) {
  const info = await api.tx.serviceRequest
    .createRequest(country, region, city, category, 1)
    .paymentInfo(pair)
  return info
}
