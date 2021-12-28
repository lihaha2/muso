import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { FortmaticConnector } from '@web3-react/fortmatic-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { BscConnector } from '@binance-chain/bsc-connector'

export const bsc = new BscConnector({
  supportedChainIds: [1, 3, 56, 97] // later on 1 ethereum mainnet and 3 ethereum ropsten will be supported
})

const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.RPC_URL_1 as string,
  4: process.env.RPC_URL_4 as string
}

const CHAIN_IDS = [1, 3, 4, 5, 42]

export const injected = new InjectedConnector({ supportedChainIds: CHAIN_IDS })

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  qrcode: true
})

export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[1],
  appName: 'MUSO Finance',
  supportedChainIds: CHAIN_IDS
})

export const fortmatic = new FortmaticConnector({ apiKey: process.env.FORTMATIC_API_KEY as string, chainId: 4 })

export const portis = new PortisConnector({ dAppId: process.env.PORTIS_DAPP_ID as string, networks: [1, 100] })