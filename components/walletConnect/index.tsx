import { useState, useEffect } from 'react'
import {
    injected,
    walletconnect,
    walletlink,
    bsc
} from '../../src/connectors'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useEagerConnect, useInactiveListener } from '../../src/hooks'
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
    open: boolean,
    setOpen: (open: boolean) => void
}

const WalletConnect = ({ open, setOpen }: IWallet) => {

    const context = useWeb3React<Web3Provider>()
    const { connector, activate, error } = context
    const [activatingConnector, setActivatingConnector] = useState<any>()

    useEffect(() => {
        if (!!error || (activatingConnector && activatingConnector === connector)) {
            setActivatingConnector(undefined)
        }
    }, [activatingConnector, connector, error])

    const triedEager = useEagerConnect()

    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    useInactiveListener(!triedEager || !!activatingConnector)

    return (
        <>
            <div
                style={open ? { visibility: 'visible' } : { visibility: 'hidden' }}
                className={styles.modalContainer}
                onClick={() => setOpen(false)}
            >
                <div
                    style={open ? { visibility: 'visible', transform: 'translateY(0)' } : { visibility: 'hidden', transform: 'translateY(-30px)' }}
                    className={styles.modal}
                    onClick={(el) => {
                        el.preventDefault()
                        el.stopPropagation()
                    }}
                >
                    <h2 className={styles.modal_title} >Connect Wallet</h2>
                    {Object.keys(connectorsByName).map(name => {

                        return (
                            <button
                                className={styles.connectButton}
                                disabled={!triedEager || !!activatingConnector || (connectorsByName[name] === connector) || !!error}
                                key={name}
                                onClick={() => {
                                    // deactivate()
                                    // setActivatingConnector(connectorsByName[name])
                                    activate(connectorsByName[name])
                                    setOpen(false)
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