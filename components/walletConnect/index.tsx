import {useState, useEffect} from 'react'
import {
    injected,
    walletconnect,
    walletlink,
    fortmatic,
    portis,
    bsc
} from '../../src/connectors'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useEagerConnect, useInactiveListener } from '../../src/hooks'
import { NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector'
import styles from './Connect.module.css'
import Image from 'next/image'

enum ConnectorNames {
    Injected = 'Injected',
    Binance = 'Binance',
    // WalletConnect = 'WalletConnect',
    WalletLink = 'WalletLink',
    Fortmatic = 'Fortmatic',
    Portis = 'Portis'
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
    [ConnectorNames.Injected]: injected,
    [ConnectorNames.Binance]: bsc,
    // [ConnectorNames.WalletConnect]: walletconnect,
    [ConnectorNames.WalletLink]: walletlink,
    [ConnectorNames.Fortmatic]: fortmatic,
    [ConnectorNames.Portis]: portis
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
      if (activatingConnector && activatingConnector === connector) {
        setActivatingConnector(undefined)
      }
    }, [activatingConnector, connector])
    const triedEager = useEagerConnect()

    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    useInactiveListener(!triedEager || !!activatingConnector)

    function getErrorMessage(error: Error) {
        if (error instanceof NoEthereumProviderError) {
        return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
        } else if (error instanceof UnsupportedChainIdError) {
        return "You're connected to an unsupported network."
        } else if (
        error instanceof UserRejectedRequestErrorInjected ||
        error instanceof UserRejectedRequestErrorWalletConnect ||
        error instanceof UserRejectedRequestErrorFrame
        ) {
        return 'Please authorize this website to access your Ethereum account.'
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
                    const currentConnector = connectorsByName[name]
                    // const activating = currentConnector === activatingConnector
                    const connected = currentConnector === connector
                    const disabled = !triedEager || !!activatingConnector || connected || !!error
                    return (
                        <button
                            className={styles.connectButton}
                            disabled={disabled}
                            key={name}
                            onClick={() => {
                                setActivatingConnector(currentConnector)
                                activate(connectorsByName[name], (err)=>{
                                    console.log('conn error', err)
                                    deactivate()
                                    setActivatingConnector(undefined)
                                }, false)
                                setOpen(false)
                            }}
                        >
                            <Image width={200} height={35} src={`/wallets/${name}.svg`} alt={name} />
                        </button>
                    )
                })}
            </div>
            {/* <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {(active || error) && (
                    <button
                        style={{
                            height: '3rem',
                            marginTop: '2rem',
                            borderRadius: '1rem',
                            borderColor: 'red',
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            deactivate()
                        }}
                    >
                        Deactivate
                    </button>
                )}

                {!!error && <h4 style={{ marginTop: '1rem', marginBottom: '0' }}>{getErrorMessage(error)}</h4>}
            </div> */}
        </div>
        </>
    )
}

export default WalletConnect