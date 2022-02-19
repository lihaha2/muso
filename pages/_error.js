import Link from "next/link"
import { NextSeo } from "next-seo";
import classNames from "classnames";

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
// Wooops, error</span> – We are very sorry 😔. Try reloading the page. If the error persists, please <Link href={'https://t.me/MUSO_English'}><a>contact us</a></Link>.
function Error({ statusCode }) {
    console.log('status: ', statusCode)
    return (
        <>
            <NextSeo
                title="404 – Muso Finance"
                description="The bridge between crypto and music"
                canonical="https://muso.finance/"
                additionalLinkTags={icons}
            />
            <div className={styles.errorWrapper}>
                <div className={styles.error}>
                    <h1 className={styles.title}>
                        <span style={{ fontSize: '64px' }}>Error</span>
                        <span className={styles.errorText}>
                            We are very sorry 😔. Try reloading the page. If the error persists, please <Link href={'https://t.me/MUSO_English'}><a style={{textDecoration: 'underline'}}>contact us</a></Link>.
                        </span>
                    </h1>
                    <div className={styles.linkList}>
                        <Link href={'/'}>
                            <a className={classNames(styles.text, styles.stake)}>Try our steak</a>
                        </Link>
                        <Link href={'https://muso.finance/'} >
                            <a target="_blank" className={classNames(styles.text, styles.diamond)} >
                                muso.finance
                            </a>
                        </Link>
                        <Link href={'https://t.me/MUSO_English'} >
                            <a target="_blank" className={classNames(styles.text, styles.diamond)}>
                                MUSO Telegram chat
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

Error.getInitialProps = ({ res, err }) => {
    return {
        statusCode: res ? res.statusCode : err ? err.statusCode : 404
    }
}

export default Error