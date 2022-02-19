import classNames from 'classnames'
import { useEffect, useState } from 'react'
import styles from './footBlocks.module.css'

const StakesList = ({ activeStake, setActiveStake, stakes, musoCourse, active }) => {
    const [hoverStake, setHoverStake] = useState(-1)
    
    useEffect(() => {
        if (!active) {
            setActiveStake({
                key: -1,
                stake: {}
            })
            setHoverStake(-1)
        }
    }, [active])

    return (
        <>
            {active && stakes.length > 0 ?
                <div
                    className={styles.footBlock_content__nav}
                    onClick={() => {
                        setHoverStake(-1)
                        setActiveStake({
                            key: -1,
                            stake: {}
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
                                        className={classNames(styles.nav_item__content, hoverStake === key && styles.nav_item__content__hover, activeStake.key === key && styles.nav_item__content__active)}
                                        onMouseOver={() => setHoverStake(key)}
                                        onMouseLeave={() => setHoverStake(-1)}
                                        onClick={(elem) => {
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
                        onClick={() => {
                            setHoverStake(-1)
                            setActiveStake({
                                key: -1,
                                stake: {}
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
                                        className={classNames(styles.nav_item__content, hoverStake === key && styles.nav_item__content__hover, activeStake.key === key && styles.nav_item__content__active)}
                                        onMouseOver={() => setHoverStake(key)}
                                        onMouseLeave={() => setHoverStake(-1)}
                                        onClick={(elem) => {
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
                        onClick={() => {
                            setHoverStake(-1)
                            setActiveStake({
                                key: -1,
                                stake: {}
                            })
                        }}
                    >
                        <p>Unlock Time</p>
                        <div className={styles.nav_item__container}>
                            {

                                stakes.map((el, key) => {
                                    let date = el.unlockTime
                                    let dd = String(date.getDate()).padStart(2, '0')
                                    let mm = String(date.getMonth() + 1).padStart(2, '0')
                                    let yyyy = date.getFullYear()

                                    return <p
                                        key={key}
                                        className={classNames(styles.nav_item__content, hoverStake === key && styles.nav_item__content__hover, activeStake.key === key && styles.nav_item__content__active)}
                                        onMouseOver={() => setHoverStake(key)}
                                        onMouseLeave={() => setHoverStake(-1)}
                                        onClick={(elem) => {
                                            elem.stopPropagation()
                                            setActiveStake({
                                                key: key,
                                                stake: el
                                            })
                                        }}
                                    >
                                        {dd + '.' + mm + '.' + yyyy}
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
        </>
    )
}

export default StakesList