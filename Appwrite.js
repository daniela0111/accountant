import { Client, Storage, Databases, ID } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
  .setProject('67a39d4d001c684cead2'); // Replace with your project ID

const storage = new Storage(client);
const databases = new Databases(client);

export { client, storage, databases, ID };