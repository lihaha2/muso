import classNames from "classnames"
import styles from "./Preloader.module.css"
import Image from 'next/image'
import Logo from '../../public/logo/MUSO_BRAND.png'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import CircularProgress from '@mui/material/CircularProgress';
import { ILoader } from '../../src/types'


const Loader = ({ loading, className, process }: ILoader) => (
    <div style={(loading || process?.val > 0) ? { display: 'flex', overflow: 'hidden' } : { display: 'none' }} className={classNames(styles.preloaderWrapper, className)}>

        {(!!process && process?.val > 0) ? (
            <>
                <Box sx={{ m: 1, position: 'fixed', display: 'flex', justifyContent: 'center', alignItems: 'center', width: 150, height: 150 }}>
                    <Fab
                        aria-label="save"
                        style={{ color: 'transparent', background: 'transparent' }}
                    >
                        <div className={styles.logo}>
                            <Image width={64} height={64} src={Logo} alt="loading" priority />
                        </div>
                    </Fab>
                    <CircularProgress
                        variant="determinate"
                        disableShrink
                        thickness={2}
                        value={process.val}
                        size={150}
                        sx={{
                            color: '#FC1452',
                            position: 'absolute',
                            zIndex: 1,
                            boxShadow: '0px 0px 40px 0px rgb(252 50 50 / 52%)',
                            borderRadius: '50%',
                        }}
                    />
                </Box>
                <div style={{margin: '200px 0 0 0'}}>{process.message}</div>
            </>
        ) : (
            <>
                <div className={styles.preloader} />
                <div className={styles.logo}>
                    <Image width={64} height={64} src={Logo} alt="loading" priority />
                </div>
            </>
        )}
    </div>


)

export default Loader