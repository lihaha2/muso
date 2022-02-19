import classNames from 'classnames'
import styles from './footBlocks.module.css'
import { useMediaQuery } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { getUserStakes, reStake, getReward, signMessage } from '../../src/contract'
import { useEffect, useState } from 'react'
import axios from 'axios'
import dynamic from 'next/dynamic'
const StakesList = dynamic(() => import('./StakesList'))
const StakingQr = dynamic(() => import('./StakingQr'))

const calculateDiscount = amount => amount > 799.99 ? 20 : amount > 399.99 ? 15 : amount > 199.99 ? 10 : amount > 99.99 ? 5 : 0

const FootBlocks = (props) => {
    const { musoCourse, stakeProcess, setStaked, setStakeProcess, setRewardError } = props
    const matches = useMediaQuery('(max-width:400px)')
    const context = useWeb3React()
    const { library, account, active } = context
    const [stakes, setStakes] = useState([])
    const [activeStake, setActiveStake] = useState<any>({
        key: -1,
        stake: {}
    })
    const [inProcess, setInProcess] = useState(false)
    const [discountObj, setDiscountObj] = useState({
        discountPercent: 0,
        discount: null
    })

    useEffect(() => {
        (async () => {
            if (account || (stakeProcess.val === 99)) {
                const res = await getUserStakes(account, library)
                setStakes(res.filter(el => el.amount > 0))
            }
        })()
    }, [account, stakeProcess])

    useEffect(() => {
        if (!active) {
            setDiscountObj({
                discountPercent: 0,
                discount: null
            })
        }
        if (active) {
            (async () => {
                try {
                    let res = await axios.post('http://65.21.242.70:7010/api/findPromo', {
                        wallet: account
                    })
                    const { promo, discount } = res.data.message
                    setDiscountObj({
                        discountPercent: parseFloat(discount.split('%')[0]),
                        discount: promo + ''
                    })
                } catch (error) {
                    setDiscountObj({
                        discountPercent: 0,
                        discount: null
                    })
                }
            })()
        }
    }, [active, account])

    const getRewardHandle = async () => {
        const { time, key } = activeStake.stake
        await getReward({
            buyer: account,
            provider: library,
            key,
            time,
            setStaked,
            setStakeProcess,
            setRewardError
        })
    }

    const reStakeHandle = async () => {
        const { time, key } = activeStake.stake
        await reStake({
            buyer: account,
            provider: library,
            key: key,
            time: time,
            setStaked,
            setStakeProcess
        })
    }

    useEffect(() => {
        if (stakes.length > 0) {
            const musoSum = stakes.map(el => el.amount).reduce((prev, curr) => prev + curr)
            const sumInDollars = musoSum * musoCourse
            calculateDiscount(sumInDollars) > discountObj.discountPercent &&
                setDiscountObj({
                    ...discountObj,
                    discount: null,
                    discountPercent: calculateDiscount(sumInDollars)
                })
        }
    }, [stakes])

    return (
        <div className={styles.footBlocks}>
            <div className={styles.footBlock} >
                <div className={styles.footBlock_content}>
                    <StakesList
                        {...{
                            stakes,
                            activeStake,
                            setActiveStake,
                            musoCourse,
                            active
                        }}
                    />
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
                    <StakingQr
                        {...{
                            inProcess,
                            setInProcess,
                            discountObj,
                            setDiscountObj,
                            library,
                            account
                        }}
                    />
                }
            </div>
            {matches &&
                <StakingQr
                    {...{
                        inProcess,
                        setInProcess,
                        discountObj,
                        setDiscountObj,
                        library,
                        account
                    }}
                />
            }
        </div>
    )
}

export default FootBlocks