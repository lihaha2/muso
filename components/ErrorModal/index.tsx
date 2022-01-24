import styles from './Error.module.css'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector'
import { NoBscProviderError, UserRejectedRequestError as UserRejectedRequestErrorBSC } from '@binance-chain/bsc-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import {useState, useEffect} from 'react'

const ErrorModal = ()=>{
    const context = useWeb3React<Web3Provider>()
    const { deactivate, error } = context
    const [message, setMessage] = useState(null)

    const getErrorMessage = (error)=> {

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
        }else if (error?.code as number === -32002){
            return 'Please continue your authorization on browser extension.'
        } else {
        console.error(error)
            return `${error.message}`
        }
    }

    useEffect(() => {
        !!error ? setMessage(getErrorMessage(error)) : setMessage(null)
    }, [error])

    return message ?
        <div className={styles.container} onClick={deactivate} >
            <div className={styles.modal} >
                <div className={styles.modalMessage} >{message}</div>
            </div>
        </div>
        : null
}

export default ErrorModal