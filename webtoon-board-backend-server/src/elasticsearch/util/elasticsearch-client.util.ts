import { Client } from "@elastic/elasticsearch";

/**
 * Get elasticsearch client
 * @returns elasticsearch client
 */
function getElasticsearchClient(): Client {
  const client = new Client({
      node: process.env.ELASTICSEARCH_SERVER_URL,
      auth: {
        username: process.env.ELASTICSEARCH_SERVER_USERNAME,
        password: process.env.ELASTICSEARCH_SERVER_PASSWORD
      }
  });

  return client;
}

async function autoCloseElasticsearchClient<T>(action: Function): Promise<T> {
  try {
    const client = getElasticsearchClient();
    const result: T = await action(client);
    await client.close();
    
    return result;
  }catch(error) {
    throw error;
  }
}

export {getElasticsearchClient, autoCloseElasticsearchClient}