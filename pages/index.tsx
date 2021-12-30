import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import {useState, useEffect} from 'react'
import QRCode from "qrcode.react"
import classNames from 'classnames'
import WalletConnect from '../components/walletConnect'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useMediaQuery } from '@material-ui/core'
import { NextSeo } from 'next-seo'

const Home: NextPage = () => {
  const [amount, setAmount] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const context = useWeb3React<Web3Provider>()
  const { connector, library, chainId, account, activate, deactivate, active, error } = context
  const matches = useMediaQuery('(max-width:400px)')

  // useEffect(()=>console.log('context',context),[context])

  return (
    <div className={styles.container}>
      <Head>
        <title>Stake – Muso Finance</title>
        <meta name="description" content="Muso Finance" />
        <link rel="icon" href="/logo/MUSO_BRAND_32x32.png" />
      </Head>
      <NextSeo
        title="Stake - Muso Finance"
        description=""
        canonical="https://muso.finance/"
        openGraph={{
          title: "Stake MUSO",
          description: "",
          url: `https://muso.finance`,
          type: "website",
          images: [
            {
              url: `https://muso.vercel.app/logo/MUSO_BRAND.png`,
              alt: "Logo"
            }
          ],
          site_name: 'Muso Stake'
        }}
      />
      <header className={styles.header}>
        <Link href={'#'}>
          <a className={styles.logo}>
            <Image width={65} height={65} src={'/logo/MUSO_BRAND.png'} alt='logo' />
          </a>
        </Link>
        <div className={styles.wallet}>
          {account && <div className={styles.wallet_info} title={account}>{account.substring(0, 6)}...</div>}
          <button 
            className={styles.wallet_button}
            onClick={ account ? deactivate : ()=> setModalOpen(true) }
          >
            {account ? 'Log Out' : 'Connect wallet'}
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.headBlocks} >
          <div className={classNames(styles.headBlock, styles.stake)} >
            <h2 className={styles.headBlock_title} >New Stake</h2>
            <h3 className={styles.headBlock_subtitle}>Numerical</h3>
            <input
              className={styles.headBlock_input} 
              type="number" 
              min="0" 
              max="9999999"
              placeholder='Enter staked amount' 
              minLength={1}
              value={amount} 
              onChange={ el => {
                let val = el.target.value
                if(val.substring(0, 1) === '0' && val.length > 1){
                  setAmount(parseFloat(val.replace('0', '')))
                  el.target.value = amount.toString()
                }
                else{
                  setAmount(parseFloat(val))
                }
              }} 
            />
            <h2 
              className={styles.headBlock_subtitle} 
              style={{paddingTop: '1rem'}} 
            >
              MUSO DISCOUNT = {amount > 799.99 ? 20 : amount > 399.99 ? 15 : amount > 199.99 ? 10 : amount > 99.99 ? 5 : 0}%
            </h2>
            <button
              disabled={amount === 0 || isNaN(amount)} 
              className={ (amount === 0 || isNaN(amount)) ? classNames(styles.button, styles.amount) : classNames(styles.button, styles.amount, styles.button__active)} 
            >
              Enter amount
            </button>
          </div>
          <div className={classNames(styles.headBlock, styles.dashboard)} >
            <h2 className={styles.headBlock_title} >Discount (QR CODE)</h2>
            <ul className={styles.headBlock_list}>
              <li onClick={()=>setAmount(100)} >$100<div className={styles.dash}></div>5%</li>
              <li onClick={()=>setAmount(200)} >$200<div className={styles.dash}></div>10%</li>
              <li onClick={()=>setAmount(400)} >$400<div className={styles.dash}></div>15%</li>
              <li onClick={()=>setAmount(800)} >$800<div className={styles.dash}></div>20%</li>
            </ul>
          </div>
        </div>
        <div className={styles.footBlocks}>
          <div className={styles.footBlock} >
            <div className={styles.footBlock_content}>
              <div className={styles.footBlock_content__nav}>
                <div className={styles.nav_item}>
                  <p>Amount Staked</p>
                </div>
                <div className={styles.nav_item}>
                  <p>Time Staked</p>
                </div>
                <div className={styles.nav_item}>
                  <p>Unlock Time</p>
                </div>
              </div>
              <div className={styles.footBlock_content__buttons}>
                <button className={classNames(styles.button, styles.button__active)} >Unlock</button>
                <button className={classNames(styles.button, styles.button__active)} >Re-stake</button>
              </div>
            </div>
            {!matches && 
              <div className={styles.QRContainer}>
                <QRCode
                  value={'https://muso.finance/'}
                  size={300}
                  level="Q"
                  renderAs="svg"
                  includeMargin={false}
                  imageSettings={
                    {
                      src:'/logo/MUSO_BRAND_WHITE.png',
                      width: 64,
                      height: 64
                    }
                  }
                />
              </div>
            }
          </div>
          {matches && 
              <div className={styles.QRContainer}>
                <QRCode
                  value={'google.com'}
                  size={300}
                  level="Q"
                  renderAs="svg"
                  includeMargin={false}
                />
              </div>
            }
        </div>
      </main>
      
      <footer className={styles.footer}>
        <div>
          © 2021 MUSO Finance Ltd. All rights reserved.
        </div>
      </footer>
      {
        <WalletConnect 
          open={modalOpen} 
          setOpen={setModalOpen}
        />
      }
    </div>
  )
}

export default Home
