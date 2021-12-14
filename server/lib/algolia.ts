import algoliasearch from "algoliasearch";

const client = algoliasearch(process.env.ALGOLIA_CLIENT, process.env.ALGOLIA_KEY);
const indexPets = client.initIndex("pets");

export { indexPets };
