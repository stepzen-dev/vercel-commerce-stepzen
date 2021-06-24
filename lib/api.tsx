import { APIConnection } from '../framework/stepzen/schema'

async function fetchAPI(query: any, { variables }: APIConnection = {}) {
    const headers = {
      Authorization: `Apikey ${process.env.NEXT_STEPZEN_API_KEY}`,
      'Content-Type': 'application/json',
    }
  
    const res = await fetch(`${process.env.NEXT_STEPZEN_API_URL}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    })
  
    const json = await res.json()
    if (json.errors) {
      console.error(json.errors)
      throw new Error('Failed to fetch API')
    }
    return json.data
  }
  
  export async function getAllProductsWithId() {
    const data = await fetchAPI(`
      {
        productsRest {
              agilityId
            }
      }
    `)
    return data?.productsRest
  }
  
  export async function getAllProductsWithSlug() {
    const data = await fetchAPI(`
      {
        productsRest {
              slug
            }
      }
    `)
    return data?.productsRest
  }
  
  export async function getProduct(id: any) {
    console.log('this is the id', id)
  
    const mainSlug = id
  
    const data = await fetchAPI(
      `
      query products($id: ID!) {
        productByAgilityId(agilityId: $id) {
            agilityId
            audience
            createdAt
            description
            image
            title
            hero
            type
            productGraphql {
              title
              id
              storefrontId
              handle
              images(first: 5) {
                edges {
                  node {
                    altText
                    height
                    id
                    src
                    width
                  }
                }
              }
              variants(first: 20) {
                edges {
                  node {
                    storefrontId
                    id
                    price
                    title
                  }
                }
              }
              options(first: 10) {
                id
                name
                position
                values
              }
            }
          }
      }
    `,
      {
        variables: {
          id: mainSlug,
        },
      }
    )
  
    console.log('queried data', data)
  
    return data
  }
  
  export async function getProductBySlug(slug: any) {
    console.log('this is the slug', slug)
  
    const mainSlug = slug
  
    const data = await fetchAPI(
      `
      query products($slug: String!) {
        productByAgilitySlug(slug: $slug) {
            agilityId
            audience
            createdAt
            description
            image
            title
            hero
            type
            productGraphql {
              title
              id
              storefrontId
              handle
              images(first: 5) {
                edges {
                  node {
                    altText
                    height
                    id
                    src
                    width
                  }
                }
              }
              variants(first: 20) {
                edges {
                  node {
                    storefrontId
                    id
                    price
                    title
                  }
                }
              }
              options(first: 10) {
                id
                name
                position
                values
              }
            }
          }
      }
    `,
      {
        variables: {
          slug: mainSlug,
        },
      }
    )
  
    // console.log('queried data in slug', data)
  
    return data
  }
  
  export async function getProductDos() {
    const data = await fetchAPI(
      `
        query products {
          productsRest {
              audience
              createdAt
              description
              image
              title
              agilityId
            }
        }
      `
      //   .then((res) => res.json())
      //   .then((res) => {
      //     // console.log(res.data)
      //     // res.data.products.slug = res.data.products.title
      //     data.products.forEach((p) => {
      //       p['slug'] = p.title
      //         .toLowerCase()
      //         .replace(/ /g, '-')
      //         .replace(/[^\w-]+/g, '')
      //     })
      //   })
    )
  
    return data
  }
  
  export async function getAllProducts() {
    const data = await fetchAPI(
      `
        query products {
          productsRest {
              audience
              createdAt
              description
              image
              title
              agilityId
              hero
              type
              slug
            }
        }
      `
    )
  
    return data.productsRest
  }
  
  export async function getTypeFromAllProducts() {
    const data = await fetchAPI(
      `
        query products {
          productsRest {
              audience
              createdAt
              description
              image
              title
              agilityId
              hero
              type
            }
        }
      `
    )
    let moreTypes = []
    for (let i = 0; i < data.productsRest.length; i++) {
      if (data.productsRest[i].type) {
        moreTypes.push(data.productsRest[i].type)
      }
    }
  
    // data.cookwareTypes = moreTypes
    // if (data.cookwareTypes.length > 2) data.cookwareTypes.pop()
  
    moreTypes = [...new Set(moreTypes)]
    return moreTypes
  }