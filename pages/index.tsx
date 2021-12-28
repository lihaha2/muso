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

const Home: NextPage = () => {
  const [amount, setAmount] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const context = useWeb3React<Web3Provider>()
  const { connector, library, chainId, account, activate, deactivate, active, error } = context
  const matches = useMediaQuery('(max-width:400px)')

  return (
    <div className={styles.container}>
      <Head>
        <title>Fresh Stake – Muso Finance</title>
        <meta name="description" content="Muso Finance" />
        <link rel="icon" href="/logo/MUSO_BRAND_32x32.png" />
      </Head>
      {/* <header className={styles.header}>
        <Link href={'#'}>
          <a>
            <Image width={48} height={48} src={'/logo/MUSO_BRAND.png'} alt='logo' />
          </a>
        </Link>
        <button>{account ? `${account.substring(0, 6)}...` : 'Connect wallet'}</button>
      </header> */}

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
            <h2 className={styles.headBlock_subtitle} style={{paddingTop: '1rem'}} >MUSO DISCOUNT =</h2>
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
              <li onClick={()=>setAmount(500)} >$500<div className={styles.dash}></div>5%</li>
              <li onClick={()=>setAmount(900)} >$900<div className={styles.dash}></div>10%</li>
              <li onClick={()=>setAmount(1600)} >$1600<div className={styles.dash}></div>15%</li>
              <li onClick={()=>setAmount(3000)} >$3000<div className={styles.dash}></div>20%</li>
              <li onClick={()=>setAmount(3000.01)} >$3001.01<div className={styles.dash}></div>25%</li>
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
                  value={'google.com'}
                  size={300}
                  level="Q"
                  renderAs="svg"
                  includeMargin={false}
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
      {!account && <WalletConnect 
        open={modalOpen} 
        setOpen={setModalOpen}
      />}
    </div>
  )
}

export default Home
