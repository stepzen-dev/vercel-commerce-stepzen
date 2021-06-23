import { Layout } from '@components/common'
import { Grid, Marquee, Hero } from '@components/ui'
import { ProductCard } from '@components/product'
// import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'

import { getAllProducts } from '../lib/api'

export async function getStaticProps() {
  const products = await getAllProducts()
  // console.log('staticprops index', products)

  return {
    props: {
      products: products,
    },
  }
}

export default function Home({
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log('products right before', products)
  return (
    <>
      {products.slice(0, 2).map((product: any, i: any) => (
        <Hero
          headline={product.title}
          description={product.description}
          hero_boolean={product.hero}
          link={product.agilityId}
          image={product.image ? product.image : product.images[0].src}
        />
      ))}
      <Grid variant="filled">
        {products.slice(0, 3).map((product: any, i: number) => (
          <ProductCard
            key={i}
            product={product}
            imgProps={{
              width: i === 0 ? 1080 : 540,
              height: i === 0 ? 1080 : 540,
            }}
          />
        ))}
      </Grid>
      <Marquee variant="primary">
        {products.slice(0, 3).map((product: any, i: any) => (
          <ProductCard key={i} product={product} variant="slim" />
        ))}
      </Marquee>
    </>
  )
}

Home.Layout = Layout
