import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { BscConnector } from '@binance-chain/bsc-connector'

const RPC_URLS: { [chainId: number]: string } = {
  56: 'https://bsc-dataseed.binance.org/' as string,
  97: 'https://data-seed-prebsc-1-s1.binance.org:8545/' as string,
  4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161' as string
}

const CHAIN_IDS = [4]

export const bsc = new BscConnector({
  supportedChainIds: CHAIN_IDS // later on 1 ethereum mainnet and 3 ethereum ropsten will be supported
})

export const injected = new InjectedConnector({ supportedChainIds: CHAIN_IDS })

export const walletconnect = new WalletConnectConnector({
  rpc: { 
    // 56: RPC_URLS[56], 
    // 97: RPC_URLS[97], 
    4: RPC_URLS[CHAIN_IDS[0]], 
  },
  qrcode: true
})

export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[97],
  appName: 'MUSO Finance',
  supportedChainIds: [...CHAIN_IDS],
  appLogoUrl: 'https://muso.vercel.app/logo/MUSO_BRAND.png'
})


// export const fortmatic = new FortmaticConnector({ apiKey: process.env.FORTMATIC_API_KEY as string, chainId: 1 })