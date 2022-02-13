import styles from './Header.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useWeb3React } from '@web3-react/core'
import Logo from '../../public/logo/MUSO_BRAND.png'
import { NextSeo } from 'next-seo'

const icons = [
    {
        rel: 'icon',
        href: 'https://muso.vercel.app/logo/MUSO_BRAND_32x32.png',
    },
    {
        rel: 'apple-touch-icon',
        href: 'https://muso.vercel.app/logo/MUSO_BRAND.png',
        sizes: '65x65'
    }
]

const graphConfig = {
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
}

const Header = ({ musoBalance, setAmount, musoCourse, setModalOpen }) => {

    const context = useWeb3React()
    const { account, deactivate, active } = context

    return (
        <>
            <NextSeo
                title="Stake - Muso Finance"
                description="The bridge between crypto and music"
                canonical="https://muso.finance/"
                openGraph={graphConfig}
                additionalLinkTags={icons}
            />
            <header className={styles.headerContainer}>
                <div className={styles.header}>
                    <Link href={'#'}>
                        <a className={styles.logo}>
                            <Image width={65} height={65} src={Logo} alt='logo' />
                        </a>
                    </Link>
                    <div className={styles.wallet}>
                        {account &&
                            <div className={styles.wallet_info}>
                                {!isNaN(musoBalance) ?
                                    <span
                                        onClick={() => setAmount(parseFloat((musoCourse * 0.95 * musoBalance).toFixed(4)))}
                                        title={`${!isNaN(musoBalance) ? musoBalance + ' MUSO' : ''}`}
                                    >
                                        {musoBalance.toLocaleString()} MUSO
                                    </span>
                                    :
                                    null
                                }
                                <span
                                    title={account}
                                >
                                    {account.substring(0, 5)}...{account.substring(account.length - 2, account.length)}
                                </span>
                            </div>
                        }
                        <button
                            className={styles.wallet_button}
                            onClick={active ? deactivate : () => setModalOpen(true)}
                        >
                            {active ? 'Log Out' : 'Connect wallet'}
                        </button>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header