import {useState, useEffect} from 'react'
import {
    injected,
    walletconnect,
    walletlink,
    bsc
} from '../../src/connectors'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useEagerConnect, useInactiveListener } from '../../src/hooks'
import { NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector'
import { NoBscProviderError, UserRejectedRequestError as UserRejectedRequestErrorBSC } from '@binance-chain/bsc-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import styles from './Connect.module.css'
import Image from 'next/image'

enum ConnectorNames {
    Injected = 'Injected',
    Binance = 'Binance',
    WalletConnect = 'WalletConnect',
    WalletLink = 'WalletLink'
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
    [ConnectorNames.Injected]: injected,
    [ConnectorNames.Binance]: bsc,
    [ConnectorNames.WalletConnect]: walletconnect,
    [ConnectorNames.WalletLink]: walletlink
}

interface IWallet {
    open:boolean, 
    setOpen: (open:boolean)=> void
}

const WalletConnect = ({open, setOpen}:IWallet) => {

    const context = useWeb3React<Web3Provider>()
    const { connector, library, chainId, account, activate, deactivate, active, error } = context
    const [activatingConnector, setActivatingConnector] = useState<any>()

    useEffect(() => {
      if (!!error || (activatingConnector && activatingConnector === connector)) {
        setActivatingConnector(undefined)
      }
    }, [activatingConnector, connector, error])
    
    useEffect(() => {
      if (!!error) {
        console.log('error')
      }
    }, [error])

    const triedEager = useEagerConnect()

    useEffect(() => {
        const int = setInterval(()=>{
            console.log(!triedEager || !!activatingConnector  || !!error)
        },1000)

        return clearInterval(int)
    }, [])

    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    useInactiveListener(!triedEager || !!activatingConnector)

    function getErrorMessage(error: Error) {
        if (error instanceof NoEthereumProviderError) {
        return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
        } else if (error instanceof NoBscProviderError) {
            return 'No BSC extension detected, install Binance Wallet on desktop or visit from a dApp browser on mobile.'
        } else if (error instanceof UnsupportedChainIdError) {
        return "You're connected to an unsupported network."
        } else if (
        error instanceof UserRejectedRequestErrorInjected ||
        error instanceof UserRejectedRequestErrorWalletConnect ||
        error instanceof UserRejectedRequestErrorBSC
        ) {
        return 'Please authorize this website to access your account.'
        } else {
        console.error(error)
        return 'An unknown error occurred. Check the console for more details.'
        }
    }

    return (
        <>
        <div 
            style={{display: open ? 'flex' : 'none'}} 
            className={styles.modalContainer} 
            onClick={()=>setOpen(false)}
        >
            <div 
                className={styles.modal}
                onClick={(el)=>{
                    el.preventDefault()
                    el.stopPropagation()
                }}
            >
                <h2 className={styles.modal_title} >Connect Wallet</h2>
                {Object.keys(connectorsByName).map(name => {
                    
                    return (
                        <button
                            className={styles.connectButton}
                            // disabled={!triedEager || !!activatingConnector || (connectorsByName[name] === connector) || !!error}
                            key={name}
                            onClick={() => {
                                // deactivate()
                                setActivatingConnector(connectorsByName[name])
                                activate(connectorsByName[name])
                                setOpen(false)
                                console.log('awezvz',{triedEager, activatingConnector, error})
                            }}
                        >
                            <Image width={200} height={35} src={`/wallets/${name}.svg`} alt={name} />
                        </button>
                    )
                })}
            </div>
        </div>
        </>
    )
}

export default WalletConnect