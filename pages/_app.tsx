import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useState, useEffect } from 'react'
import Router from "next/router"

const getLibrary = (provider: any): Web3Provider => {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const App = ({ Component, pageProps }: AppProps) => {
  const [loading, setLoading] = useState(true)

  Router.events.off("routeChangeStart", () => {
    setLoading(true)
  });

  Router.events.off("routeChangeComplete", () => {
    setLoading(false)
  })

  Router.events.off("routeChangeError", () => {
    setLoading(false)
  })

  useEffect(() => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1 * 1000)
  }, [])

  return <Web3ReactProvider getLibrary={getLibrary}>
    <Component {...pageProps} loading={loading} setLoading={setLoading} />
  </Web3ReactProvider>
}

export default App
