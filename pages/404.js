import styles from "../styles/Error.module.css";
import Link from "next/link";
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

const Error = () => {
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
            <span style={{ fontSize: '64px' }}>404</span>
            <span className={styles.subtitle}>Page not found</span>
          </h1>
          <div className={styles.linkList}>
            <Link href={'/'} passHref>
              <a className={classNames(styles.text, styles.stake)}>Try our steak</a>
            </Link>
            <Link href={'https://muso.finance/'} passHref >
              <a target="_blank" className={classNames(styles.text, styles.diamond)} >
                muso.finance
              </a>
            </Link>
            <Link href={'https://t.me/MUSO_English'} passHref >
              <a target="_blank" className={classNames(styles.text, styles.diamond)}>
                MUSO Telegram chat
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default Error;
