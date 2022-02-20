import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { injected } from './connectors'

declare let window: any

const chains = {
  4: {
    chainId: "0x4",
    rpcUrls: ["https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    chainName: "Rinkeby",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18
    },
    blockExplorerUrls: ["https://rinkeby.etherscan.io"]
  },
  56: {
    chainId: "0x38",
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    chainName: "Binance Smart Chain",
    nativeCurrency: {
      name: "BSC",
      symbol: "BNB",
      decimals: 18
    },
    blockExplorerUrls: ["https://bscscan.com"]
  },
  97: {
    chainId: "0x61",
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    chainName: "BSC Testnet",
    nativeCurrency: {
      name: "BSC",
      symbol: "BNB",
      decimals: 18
    },
    blockExplorerUrls: ["https://explorer.binance.org/smart-testnet"]
  }
}

export function useEagerConnect() {
  const { activate, active } = useWeb3React()

  const [tried, setTried] = useState(false)

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch((err) => {
          console.log('tryed err', {err})
          setTried(true)
          if (err.name === "UnsupportedChainIdError" && window?.ethereum) {
            window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [chains[4]]
            })
          }
        })
      } else {
        setTried(true)
      }
    })
  }, []) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  return tried
}

export function useInactiveListener(suppress: boolean = false) {
  const { active, error, activate, deactivate } = useWeb3React()

  useEffect((): any => {
    const { ethereum } = window as any
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event")
        activate(injected)
      }
      const handleChainChanged = (chainId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", chainId)
        activate(injected)
      }
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Handling 'accountsChanged' event with payload", accounts)
        if (accounts.length > 0) {
          activate(injected)
        }
      }
      const handleNetworkChanged = (networkId: string | number) => {
        console.log('networkId', networkId)
        console.log("Handling 'networkChanged' event with payload", networkId)
        activate(injected)
      }
      const handleDisconnect = (error) => {
        console.log("Handling 'disconnect' event with payload", error)
        deactivate()
      }

      ethereum.on('connect', handleConnect)
      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)
      ethereum.on('networkChanged', handleNetworkChanged)
      ethereum.on('disconnect', handleDisconnect)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect)
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
          ethereum.removeListener('networkChanged', handleNetworkChanged)
          ethereum.removeListener('disconnect', handleDisconnect)
        }
      }
    }
  }, [active, error, suppress, activate])
}
