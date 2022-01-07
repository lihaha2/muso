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
import Loader from '../components/Loader'
import axios from 'axios'

interface IProps {
  loading: boolean,
  setLoading: (loading:boolean)=> void
}

const Home: NextPage<IProps> = (props) => {
  const [amount, setAmount] = useState(0)
  const [stakeTime, setStakeTime] = useState(12)
  const [musoCourse, setMusoCourse] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const context = useWeb3React<Web3Provider>()
  const { connector, library, chainId, account, activate, deactivate, active, error } = context
  const matches = useMediaQuery('(max-width:400px)')
  const {loading, setLoading} = props

  useEffect(() => {
    (async()=>{
      try {
        const res = await axios.get(`https://api.pancakeswap.info/api/v2/tokens/0xC08E10b7Eb0736368A0B92EE7a140eC8C63A2dd1`)

      console.log()
      setMusoCourse(parseFloat(res.data.data.price))
      } catch (error) {
        console.log({...error})
      }
    })()
  }, [])

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
            <div className={styles.stakingBody}>
              <div className={styles.form}>
                <h3 className={styles.headBlock_subtitle}>Amount</h3>
                <div className={styles.inputGroup}>
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

                      if(val.length >= 9999999) {
                        return false
                      }

                      if(val.substring(0, 1) === '0' && val.length > 1){
                        setAmount(parseFloat(val.replace('0', '')))
                        el.target.value = amount.toString()
                      }
                      else{
                        setAmount(parseFloat(val))
                      }
                    }} 
                  />
                  <span className={styles.inputCurrency} >$</span>
                </div>
                {
                  musoCourse ? <div className={styles.musoCurrency}>
                    {(( !isNaN(amount) ? amount : 0 ) / musoCourse).toFixed(2)} MUSO
                  </div> : null
                }
                
              </div>
              <div className={styles.stakingButtons}>
                <h3 className={styles.headBlock_subtitle}>Time (Months)</h3>
                <div className={styles.stakingButtons_body}>
                  <button
                    className={stakeTime === 3 ? classNames(styles.button, styles.nowTime, styles.timeButton) : classNames(styles.button, styles.timeButton)} 
                    onClick={()=>setStakeTime(3)}
                    disabled={stakeTime === 3}
                  >
                    3
                  </button>
                  <button
                    className={stakeTime === 6 ? classNames(styles.button, styles.nowTime, styles.timeButton) : classNames(styles.button, styles.timeButton)} 
                    onClick={()=>setStakeTime(6)}
                    disabled={stakeTime === 6}
                  >
                    6
                  </button>
                  <button
                    className={stakeTime === 12 ? classNames(styles.button, styles.nowTime, styles.timeButton) : classNames(styles.button, styles.timeButton)} 
                    onClick={()=>setStakeTime(12)}
                    disabled={stakeTime === 12}
                  >
                    12
                  </button>
                </div>
              </div>
            </div>
            <h2 
              className={styles.headBlock_subtitle} 
              style={{margin: '30px 0 0 0'}} 
            >
              MUSO DISCOUNT = {amount > 799.99 ? 20 : amount > 399.99 ? 15 : amount > 199.99 ? 10 : amount > 99.99 ? 5 : 0}%
            </h2>
            <button
              disabled={amount === 0 || isNaN(amount)} 
              className={ (amount === 0 || isNaN(amount)) ? classNames(styles.button, styles.amount) : classNames(styles.button, styles.amount, styles.button__active)} 
              onClick={()=>{
                setLoading(true)
                setTimeout(() => setLoading(false), 2 * 1000)
              }}
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
                  <p className={styles.nav_item__content}>
                    {/* $100 */}
                     – 
                  </p>
                </div>
                <div className={styles.nav_item}>
                  <p>Time Staked</p>
                  <p className={styles.nav_item__content}>
                    {/* 3 month */}
                     – 
                  </p>
                </div>
                <div className={styles.nav_item}>
                  <p>Unlock Time</p>
                  <p className={styles.nav_item__content}>
                    {/* 30.03.2022 */}
                    – 
                  </p>
                </div>
              </div>
              <div className={styles.footBlock_content__buttons}>
                <button 
                  className={classNames(styles.button, styles.button__active)} 
                  onClick={()=>{
                    setLoading(true)
                    setTimeout(() => setLoading(false), 2 * 1000)
                  }}
                >Unlock</button>
                <button 
                  className={classNames(styles.button, styles.button__active)} 
                  onClick={()=>{
                    setLoading(true)
                    setTimeout(() => setLoading(false), 2 * 1000)
                  }}
                >Re-stake</button>
              </div>
            </div>
            {!matches && 
              <div className={styles.QRContainer}>
                {/* <QRCode
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
                /> */}
                <div className={styles.willQR}>
                  Here will be your QR code after the Staking .
                </div>
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
      {
        <Loader loading={loading} />
      }
    </div>
  )
}

export default Home