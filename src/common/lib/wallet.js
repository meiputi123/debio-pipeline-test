import { setMetamaskWallet } from "./metamask"

const walletHandler = {
  metamask: setMetamaskWallet
}

export async function handleSetWallet(walletName, address){
  return await walletHandler[walletName](address)
}
