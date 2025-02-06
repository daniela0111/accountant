import { Client, Account, ID, Storage, Databases } from 'react-native-appwrite';

const client = new Client()
    .setProject('67a39d4d001c684cead2')
    .setPlatform('naseucetni.accountant');

    export const storage = new Storage(client);
    export const databases = new Databases(client);