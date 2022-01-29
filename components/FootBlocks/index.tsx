import classNames from 'classnames'
import styles from './footBlocks.module.css'
import QRCode from "qrcode.react"
import { useMediaQuery } from '@material-ui/core'

const FootBlocks = ({ setLoading }) => {
    const matches = useMediaQuery('(max-width:400px)')

    return (
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
                            onClick={() => {
                                setLoading(true)
                                setTimeout(() => setLoading(false), 2 * 1000)
                            }}
                        >Unlock</button>
                        <button
                            className={classNames(styles.button, styles.button__active)}
                            onClick={() => {
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
    )
}

export default FootBlocks