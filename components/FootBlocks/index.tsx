import classNames from 'classnames'
import styles from './footBlocks.module.css'
import QRCode from "qrcode.react"
import { useMediaQuery } from '@material-ui/core'
import { useWeb3React } from '@web3-react/core'
import { getUserStakes, reStake, getReward } from '../../src/contract'
import { useEffect, useState } from 'react'
const FootBlocks = (props) => {
    const { setLoading, musoCourse, stakeProcess, staked, setStaked, setStakeProcess } = props
    const matches = useMediaQuery('(max-width:400px)')
    const context = useWeb3React()
    const { library, account, deactivate, active } = context
    const [stakes, setStakes] = useState([])
    const [hoverStake, setHoverStake] = useState(-1)
    const [activeStake, setActiveStake] = useState<any>({
        key: -1,
        stake:{}
    })
    useEffect(() => {
        (async () => {
            if (account || (stakeProcess.val === 99)) {
                const res = await getUserStakes(account, library)
                console.log(res.filter(el => el.amount > 0))
                setStakes(res.filter(el => el.amount > 0))
            }
        })()
    }, [account, stakeProcess])

    const getRewardHandle = async() => {
        const {time, key} = activeStake.stake 
        await getReward({
            buyer:account, 
            provider:library,
            key,
            time,
            setStaked,
            setStakeProcess
        })
    }
    
    const reStakeHandle = async() => {
        const {time, key} = activeStake.stake 
        await reStake({
            buyer:account, 
            provider:library,
            key: key,
            time: time,
            setStaked,
            setStakeProcess
        })
    }
    return (
        <div className={styles.footBlocks}>
            <div className={styles.footBlock} >
                <div className={styles.footBlock_content}>
                    {
                        account && stakes.length > 0 ?
                            <div 
                                className={styles.footBlock_content__nav}
                                onClick={()=>{
                                    setHoverStake(-1)
                                    setActiveStake({
                                        key: -1,
                                        stake:{}
                                    })
                                }}
                            >
                                <div className={styles.nav_item}>
                                    <p>Amount Staked</p>
                                    <div 
                                        className={styles.nav_item__container} 
                                    >
                                        {
                                            stakes.map((el, key) => (
                                                <p 
                                                    key={key} 
                                                    className={ classNames(styles.nav_item__content, hoverStake === key && styles.nav_item__content__hover, activeStake.key === key && styles.nav_item__content__active)}
                                                    onMouseOver={()=>setHoverStake(key)}
                                                    onMouseLeave={()=>setHoverStake(-1)}
                                                    onClick={(elem)=>{
                                                        elem.stopPropagation()
                                                        setActiveStake({
                                                            key: key,
                                                            stake: el
                                                        })
                                                    }}
                                                >
                                                    ${+(el.amount * musoCourse).toFixed(6)}
                                                </p>
                                            ))
                                        }
                                    </div>

                                </div>
                                <div 
                                    className={styles.nav_item} 
                                    onClick={()=>{
                                        setHoverStake(-1)
                                        setActiveStake({
                                            key: -1,
                                            stake:{}
                                        })
                                    }}
                                >
                                    <p>Time Staked</p>
                                    <div 
                                        className={styles.nav_item__container} 
                                    >
                                        {
                                            stakes.map((el, key) => (
                                                <p 
                                                    key={key} 
                                                    className={ classNames(styles.nav_item__content, hoverStake === key && styles.nav_item__content__hover, activeStake.key === key && styles.nav_item__content__active)}
                                                    onMouseOver={()=>setHoverStake(key)}
                                                    onMouseLeave={()=>setHoverStake(-1)}
                                                    onClick={(elem)=>{
                                                        elem.stopPropagation()
                                                        setActiveStake({
                                                            key: key,
                                                            stake: el
                                                        })
                                                    }}
                                                >
                                                    {el.time} months
                                                </p>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div 
                                    className={styles.nav_item} 
                                    onClick={()=>{
                                        setHoverStake(-1)
                                        setActiveStake({
                                            key: -1,
                                            stake:{}
                                        })
                                    }}
                                >
                                    <p>Unlock Time</p>
                                    <div 
                                        className={styles.nav_item__container} 
                                    >
                                        {

                                            stakes.map((el, key) => {
                                                let date = el.unlockTime
                                                let dd = String(date.getDate()).padStart(2, '0')
                                                let mm = String(date.getMonth() + 1).padStart(2, '0')
                                                let yyyy = date.getFullYear()


                                                return <p 
                                                    key={key} 
                                                    className={ classNames(styles.nav_item__content, hoverStake === key && styles.nav_item__content__hover, activeStake.key === key && styles.nav_item__content__active)}
                                                    onMouseOver={()=>setHoverStake(key)}
                                                    onMouseLeave={()=>setHoverStake(-1)}
                                                    onClick={(elem)=>{
                                                        elem.stopPropagation()
                                                        setActiveStake({
                                                            key: key,
                                                            stake: el
                                                        })
                                                    }}
                                                >
                                                    {dd + '.' + mm + '.' + yyyy }
                                                </p>
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            : <div className={styles.footBlock_content__nav}>
                                <div className={styles.nav_item}>
                                    <p>Amount Staked</p>
                                    <p className={styles.nav_item__content__disabled}>
                                        {/* $100 */}
                                        –
                                    </p>

                                </div>
                                <div className={styles.nav_item}>
                                    <p>Time Staked</p>
                                    <p className={styles.nav_item__content__disabled}>
                                        {/* 3 month */}
                                        –
                                    </p>
                                </div>
                                <div className={styles.nav_item}>
                                    <p>Unlock Time</p>
                                    <p className={styles.nav_item__content__disabled}>
                                        {/* 30.03.2022 */}
                                        –
                                    </p>
                                </div>
                            </div>
                    }
                    <div className={styles.footBlock_content__buttons}>
                        <button
                            className={classNames(styles.button, activeStake.key !== -1 && styles.button__active)}
                            disabled={activeStake.key == -1}
                            onClick={getRewardHandle}
                        >Unlock</button>
                        <button
                            className={classNames(styles.button, activeStake.key !== -1 && styles.button__active)}
                            disabled={activeStake.key == -1}
                            onClick={reStakeHandle}
                        >Re-stake</button>
                    </div>
                </div>
                {!matches &&
                    <div className={styles.QRContainer}>
                        {
                            account ?
                                <QRCode
                                    value={'https://muso.finance/'}
                                    size={300}
                                    level="Q"
                                    renderAs="svg"
                                    includeMargin={false}
                                    imageSettings={
                                        {
                                            src: '/logo/MUSO_BRAND_WHITE.png',
                                            width: 64,
                                            height: 64
                                        }
                                    }
                                />
                                :
                                <div className={styles.willQR}>
                                    Here will be your QR code after the Staking .
                                </div>
                        }
                    </div>
                }
            </div>
            {matches &&
                <div className={styles.QRContainer}>
                    {
                        account ?
                            <QRCode
                                value={'https://muso.finance/'}
                                size={300}
                                level="Q"
                                renderAs="svg"
                                includeMargin={false}
                                imageSettings={
                                    {
                                        src: '/logo/MUSO_BRAND_WHITE.png',
                                        width: 64,
                                        height: 64
                                    }
                                }
                            />
                            :
                            <div className={styles.willQR}>
                                Here will be your QR code after the Staking .
                            </div>
                    }
                </div>
            }
        </div>
    )
}

export default FootBlocks