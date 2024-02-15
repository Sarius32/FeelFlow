import { request, gql } from 'graphql-request'

const MASTER_URL='https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/cls01y07924ts01utrkrn2mgn/master'
const getSlider = async() => {
    const query = gql`
    query GetSlider {
        sliders {
          id
          name
          image {
            url
          }
        }
      }
      
`
const result = await request(MASTER_URL, query);
return result
}

const getCategories = async() => {
    const query = gql`
    query GetCategory {
        categories {
          id
          name
          icon {
            url
          }
        }
      }
      
      
`
const result = await request(MASTER_URL, query);
return result
}

export default{
    getSlider,
    getCategories
}