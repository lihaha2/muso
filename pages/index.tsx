import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import styles from '../styles/Home.module.css'
import classNames from 'classnames'
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import { getUserBalance, stake } from '../src/contract'
const WalletConnect = dynamic(() => import('../components/walletConnect'))
const Loader = dynamic(() => import('../components/Loader'))
const ErrorModal = dynamic(() => import('../components/ErrorModal'))
const Header = dynamic(() => import('../components/Header'))
const FootBlocks = dynamic(() => import('../components/FootBlocks'))
import {IProps, IStaked, ILoadingProgress} from '../src/types'

const Home: NextPage<IProps> = (props) => {
  const [amount, setAmount] = useState(0)
  const [stakeTime, setStakeTime] = useState(12)
  const [musoCourse, setMusoCourse] = useState(0)
  const [musoBalance, setMusoBalance] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [stakeProcess, setStakeProcess] = useState<ILoadingProgress>({
    val:0,
    message: ''
  })
  const [staked, setStaked] = useState<IStaked>({
    err: false,
    staked: false,
    progress: 0,
    res: false
  })
  const context = useWeb3React()
  const { library, account, deactivate, active } = context

  const { loading, setLoading } = props

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`https://api.pancakeswap.info/api/v2/tokens/0xC08E10b7Eb0736368A0B92EE7a140eC8C63A2dd1`)
        setMusoCourse(parseFloat(res.data.data.price))
      } catch (error) {
        console.log({ ...error })
      }
    })()
  }, [context])
  
  useEffect(() => {
    (async()=>{
      if(staked.progress === 100){
        staked.staked ? console.log('staked', staked) : console.log('stake error', staked);
        const res = await getUserBalance({buyer:account, provider: library});
        !isNaN(res) && setMusoBalance(res)
        setLoading(false)
        setStakeProcess({
          val:0,
          message: ''
        })
        setStaked({
          err: false,
          staked: false,
          progress: 0,
          res: false
        })
      }
    })()
  }, [staked])

  useEffect(() => {
    (async () => {
      if (library && account) {
        const res = await getUserBalance({buyer:account, provider: library});
        (!isNaN(res) || res > 0.00) && setMusoBalance(res)
        // approveContract(account, library)
      }
    })()
  }, [library, account])

  const FormButton = () => {
    const nullValue = amount === 0 || isNaN(amount)
    const noMoneyNoHoney = account ? (musoBalance < (amount / musoCourse)) : false

    const stakeHandle = async() => {
      setLoading(true)
      // setTimeout(() => setLoading(false), 2 * 1000)
      await stake({
        buyer:account, 
        provider:library,
        amount: amount / musoCourse,
        time: stakeTime,
        setStaked,
        setStakeProcess
      })
    }

    const connectHandle = () => setModalOpen(true)

    return <button
      disabled={nullValue || noMoneyNoHoney}
      className={(nullValue || !account || noMoneyNoHoney) ? classNames(styles.button, styles.amount) : classNames(styles.button, styles.amount, styles.button__active)}
      onClick={!account ? connectHandle : stakeHandle}
    >
      {
        (!nullValue && !account) ?
          'Connect wallet' :
          (!nullValue && account && noMoneyNoHoney) ?
            'Insufficient balance' :
            'Enter amount'
      }
    </button>
  }

  return (
    <div className={styles.container}>
      <Header
        musoBalance={musoBalance}
        setAmount={setAmount}
        musoCourse={musoCourse}
        setModalOpen={setModalOpen}
      />
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
                    step="any"
                    lang="en"
                    value={amount}
                    onChange={el => {
                      let val = el.target.value

                      if (val.length >= 11) { return false }

                      if (val.substring(0, 1) === '0' && val.length > 1) {
                        setAmount(parseFloat(val.replace('0', '')))
                        el.target.value = amount.toString()
                      }
                      else {
                        setAmount(parseFloat(val))
                      }
                    }}
                  />
                  <span className={styles.inputCurrency} >$</span>
                </div>
                {
                  musoCourse ? <div className={styles.musoCurrency}>
                    {((!isNaN(amount) ? amount : 0) / musoCourse).toLocaleString()} MUSO
                  </div> : null
                }

              </div>
              <div className={styles.stakingButtons}>
                <h3 className={styles.headBlock_subtitle}>Time (Months)</h3>
                <div className={styles.stakingButtons_body}>
                  <button
                    className={stakeTime === 3 ? classNames(styles.button, styles.nowTime, styles.timeButton) : classNames(styles.button, styles.timeButton)}
                    onClick={() => setStakeTime(3)}
                    disabled={stakeTime === 3}
                  >
                    3
                  </button>
                  <button
                    className={stakeTime === 6 ? classNames(styles.button, styles.nowTime, styles.timeButton) : classNames(styles.button, styles.timeButton)}
                    onClick={() => setStakeTime(6)}
                    disabled={stakeTime === 6}
                  >
                    6
                  </button>
                  <button
                    className={stakeTime === 12 ? classNames(styles.button, styles.nowTime, styles.timeButton) : classNames(styles.button, styles.timeButton)}
                    onClick={() => setStakeTime(12)}
                    disabled={stakeTime === 12}
                  >
                    12
                  </button>
                </div>
              </div>
            </div>
            <h3
              className={styles.headBlock_subtitle}
              style={{ margin: '30px 0 0 0' }}
            >
              MUSO DISCOUNT = {amount > 799.99 ? 20 : amount > 399.99 ? 15 : amount > 199.99 ? 10 : amount > 99.99 ? 5 : 0}%
            </h3>
            <FormButton />
          </div>
          <div className={classNames(styles.headBlock, styles.dashboard)} >
            <h2 className={styles.headBlock_title} >Discount (QR CODE)</h2>
            <ul className={styles.headBlock_list}>
              <li onClick={() => setAmount(100)} >$100<div className={styles.dash}></div>5%</li>
              <li onClick={() => setAmount(200)} >$200<div className={styles.dash}></div>10%</li>
              <li onClick={() => setAmount(400)} >$400<div className={styles.dash}></div>15%</li>
              <li onClick={() => setAmount(800)} >$800<div className={styles.dash}></div>20%</li>
            </ul>
          </div>
        </div>
        <FootBlocks setLoading={setLoading} />
      </main>

      <footer className={styles.footer}>
        <div>
          © 2021 MUSO Finance Ltd. All rights reserved.
        </div>
      </footer>
      <WalletConnect
        open={modalOpen}
        setOpen={setModalOpen}
      />
      <Loader loading={loading} process={stakeProcess} />
      <ErrorModal />
    </div>
  )
}

export default Home