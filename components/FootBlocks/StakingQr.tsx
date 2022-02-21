import styles from './footBlocks.module.css'
import QRCode from "qrcode.react"
import { signMessage } from '../../src/contract'
import axios from 'axios'
import { memo } from 'react'

const StakingQr = ({inProcess, setInProcess, discountObj, setDiscountObj, library, account}) => {
    const signHandle = async () => {
        try {
            if (!inProcess) {
                setInProcess(true)
                let res = await signMessage({
                    provider: library,
                    buyer: account,
                    message: `Muso Discount ${discountObj.discountPercent}%`
                })
                setDiscountObj({
                    ...discountObj,
                    discount: res
                })
                axios.interceptors.response.use(
                    response => response,
                    error => {
                        return Promise.reject(error)
                    }
                )
                await axios.post('https://staking.muso.finance/api/addPromo',{
                    promo: res,
                    wallet: account,
                    discount: discountObj.discountPercent+'%'
                })
                setInProcess(false)
            }
        } catch (error) {
            setInProcess(false)
        }
    }

    return (
        <div className={styles.QRContainer}>
            {account && !!discountObj.discount ?
                <QRCode
                    value={discountObj.discount}
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
                : account && !discountObj.discount && discountObj.discountPercent > 0 ?
                    <div
                        className={styles.willQR}
                        style={{ cursor: inProcess ? 'default' : 'pointer', userSelect: 'none' }}
                        onClick={signHandle}
                    >
                        Click to generate QR code with <b>{discountObj.discountPercent}%</b> discount.
                    </div>
                    : account && !discountObj.discount && discountObj.discountPercent === 0 ?
                        <div className={styles.willQR} style={{ userSelect: 'none' }} >
                            Stake more MUSO to get discount tier.
                        </div>
                        :
                        <div className={styles.willQR} style={{ userSelect: 'none' }} >
                            Here will be your QR code after the Staking.
                        </div>
            }
        </div>
    )
}

export default memo(StakingQr)