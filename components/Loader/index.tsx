import classNames from "classnames"
import styles from "./Preloader.module.css"
import Image from 'next/image'
import Logo from '../../public/logo/MUSO_BRAND.png'

interface ILoader {
    loading: boolean,
    className?: any
}

const Loader = ({loading, className}:ILoader)=>(
    <div style={loading ? {display: 'flex', overflow: 'hidden'} : {display: 'none'}} className={classNames(styles.preloaderWrapper, className)}>
        <div className={styles.preloader}>
        </div>
        <div className={styles.logo}>
            <Image width={64} height={64} src={Logo} alt="loading" />
        </div>
    </div>
    
)

export default Loader