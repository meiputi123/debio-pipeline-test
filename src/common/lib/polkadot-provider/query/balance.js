export async function queryBalance(api, addr) {
  // eslint-disable-next-line no-unused-vars
  const { nonce, data: balance } = await api.query.system.account(
    addr
  )
  const formatedBalance = balance.free.toHuman().replaceAll(",", "")
  return formatedBalance
}
