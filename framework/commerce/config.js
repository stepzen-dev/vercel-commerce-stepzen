/**
 * This file is expected to be used in next.config.js only
 */

const path = require('path')
const fs = require('fs')
const merge = require('deepmerge')
const prettier = require('prettier')

const PROVIDERS = [
  'bigcommerce',
  'saleor',
  'shopify',
  'swell',
  'vendure',
  'local',
]

function getProviderName() {
  return (
    process.env.COMMERCE_PROVIDER ||
    (process.env.BIGCOMMERCE_STOREFRONT_API_URL
      ? 'bigcommerce'
      : process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
      ? 'shopify'
      : process.env.NEXT_PUBLIC_SWELL_STORE_ID
      ? 'swell'
      : 'local')
  )
}

function withCommerceConfig(nextConfig = {}) {
  const commerce = nextConfig.commerce || {}
  const name = commerce.provider || getProviderName()

  if (!name) {
    throw new Error(
      `The commerce provider is missing, please add a valid provider name or its environment variables`
    )
  }
  if (!PROVIDERS.includes(name)) {
    throw new Error(
      `The commerce provider "${name}" can't be found, please use one of "${PROVIDERS.join(
        ', '
      )}"`
    )
  }

  const commerceNextConfig = require(path.join('../', name, 'next.config'))
  const config = merge(nextConfig, commerceNextConfig)

  config.env = config.env || {}

  Object.entries(config.commerce.features).forEach(([k, v]) => {
    if (v) config.env[`COMMERCE_${k.toUpperCase()}_ENABLED`] = true
  })

  // Update paths in `tsconfig.json` to point to the selected provider
  if (config.commerce.updateTSConfig !== false) {
    const staticTsconfigPath = path.join(process.cwd(), 'tsconfig.json')
    const tsconfig = require('../../tsconfig.js')

    fs.writeFileSync(
      staticTsconfigPath,
      prettier.format(JSON.stringify(tsconfig), { parser: 'json' })
    )
  }

  return config
}

module.exports = { withCommerceConfig, getProviderName }
