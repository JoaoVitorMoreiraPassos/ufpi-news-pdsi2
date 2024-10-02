const { sys } = require('typescript');

/** @type {import('next').NextConfig} */
const nextConfig = {};
// const host = "http://localhost:8000/";
// const host = "http://10.180.42.72:8000/";
// get host from env REACT_APP_API_URL
const host = process.env.REACT_APP_API_URL;
module.exports = {
    env: {
        BASE_URL: host,
        API_URL: host + 'api/v1/',
        API_URLv2: host + 'api/v2/',
        API_VERSION: 'v1',
        API_KEY: '1234567890'
    },
    reactStrictMode: true,
    images: {
        domains: ["ufpinews.pythonanywhere.com", 'via.placeholder.com', 'localhost'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'via.placeholder.com'
            },
            {
                protocol: 'http',
                hostname: 'localhost'
            },
            {
                protocol: 'http',
                hostname: '192.168.1.12'
            },
            {
                protocol: "http",
                hostname: "*"
            },
            {
                protocol: "https",
                hostname: "ufpinews.pythonanywhere.com"
            }
        ]
    }
};
