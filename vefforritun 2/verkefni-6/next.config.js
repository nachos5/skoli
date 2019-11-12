
/* todo setja upp css og env fyrir api url */


require('dotenv').config();

const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');

module.exports = withCSS(
  withSass({
    cssModules: true,
    cssLoaderOptions: {
      importLoaders: 1,
      localIdentName: "[local]___[hash:base64:5]",
    },
    publicRuntimeConfig: {
      apiUrl: process.env.API_URL,
    },
  })
);
