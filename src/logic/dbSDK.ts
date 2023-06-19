import { Client, Databases, ID, Query } from 'appwrite'

// const API_ENDPOINT = import.meta.env.API_ENDPOINT
// const APPWRITE_API = import.meta.env.APPWRITE_API

// const PROJECT_ID = import.meta.env.PROJECT_ID
// const DATABASE_ID = import.meta.env.DB_ID
// const COLLECTION_ID = import.meta.env.COLLECTION_ID

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  // .setProject(`${PROJECT_ID}`)
  .setProject('6470ec273ccbfc1462f7')

const databases = new Databases(client)

// GET all docs
export const GetAllUsers = databases.listDocuments(
  '6470ec650e1ca8428bf6', '6470eca413760d1ae70a',
  // `${DATABASE_ID}`, `${COLLECTION_ID}`,
).then((response) => {
  return response
}, (error) => {
  return error
})
// GET a User
export const GetUser = (label: string, data: string) => databases.listDocuments(
  '6470ec650e1ca8428bf6', '6470eca413760d1ae70a',
  // `${DATABASE_ID}`, `${COLLECTION_ID}`,
  [
    Query.equal(label, data),
  ],
).then((response) => {
  return response
}, (error) => {
  return error
})

// Create new user
export const CreateUser = (data: any) => databases.createDocument(
  '6470ec650e1ca8428bf6', '6470eca413760d1ae70a',
  // `${DATABASE_ID}`, `${COLLECTION_ID}`,
  ID.unique(),
  JSON.stringify(data),
).then((response) => {
  return response
}, (error) => {
  return error
})
