/*
 These examples walk you through key management operations.

 See clientInitalization.js for quick instructions on starting the Typesense server.
*/
require("@babel/register");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Typesense = require("../../../lib/Typesense");

const masterApiKey = "xyz";

const typesense = new Typesense.Client({
  nodes: [
    {
      host: "localhost",
      port: "8108",
      protocol: "http",
    },
  ],
  apiKey: masterApiKey,
});

async function runExample() {
  await deleteDataFromPreviousRuns();
  try {
    let result;

    // create a collection
    await typesense.collections().create({
      name: "products",
      fields: [
        { name: "name", type: "string" },
        { name: "description", type: "string" },
        { name: "price", type: "float" },
      ],
    });

    // create a collection to store search suggestions
    await typesense.collections().create({
      name: "products_top_queries",
      fields: [
        { name: "q", type: "string" },
        { name: "count", type: "int32" },
      ],
    });

    // Create a rule to capture top queries
    result = await typesense.analytics.rules().create({
      name: "search_suggestions",
      type: "popular_queries",
      params: {
        source: { collections: ["products"] },
        destination: { collection: "products_top_queries" },
      },
      limit: 100,
    });
    console.dir(result);

    // Retrieve all rules
    result = await typesense.analytics.rules().retrieve();
    console.dir(result);

    // Delete rule
    result = await typesense.analytics.rules("search_suggestions").delete();
    console.dir(result);
  } catch (error) {
    console.log(error);
  } finally {
    // Cleanup
    await typesense.collections("products").delete();
    await typesense.collections("products_top_queries").delete();
  }
}

async function deleteDataFromPreviousRuns() {
  try {
    // Delete if the collections / rules already exists from a previous example run
    await typesense.collections("products").delete();
  } catch (error) {
    // do nothing
  }

  try {
    // Delete if the collections already exists from a previous example run
    await typesense.collections("products_top_queries").delete();
  } catch (error) {
    // do nothing
  }

  try {
    // Delete if the rules already exists from a previous example run
    await typesense.analytics.rules("search_suggestions").delete();
  } catch (error) {
    // do nothing
  }
}

runExample();