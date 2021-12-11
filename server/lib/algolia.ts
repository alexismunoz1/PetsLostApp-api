// For the default version
import algoliasearch from "algoliasearch";

// For the search only version
// import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch(process.env.ALGOLIA_CLIENT, process.env.ALGOLIA_KEY);
const index = client.initIndex("products");
export { index };
