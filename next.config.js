const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env?.ANALYZE === 'false',
})

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  reactStrictMode: true,
})
