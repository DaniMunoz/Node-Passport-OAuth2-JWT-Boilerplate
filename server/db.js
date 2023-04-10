import { MongoClient } from 'mongodb';
import dotenv from 'dotenv'
dotenv.config()

export async function getUser(email) {
  const client = new MongoClient(process.env.DATABASE_URL);
  try {    
    const database = client.db('PassportJWT');
    const users = database.collection('user');
    const query = { email: email };
    const user = await users.findOne(query);
    return user;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export async function createUser(profileId, email, name, image, refreshToken) {
  const client = new MongoClient(process.env.DATABASE_URL);
  try {
    const database = client.db('PassportJWT');
    const users = database.collection('user');
    // create a document to insert
    const user = {
      profileId: profileId,
      email: email,
      name: name,
      image: image,
      refreshToken: refreshToken,
    }
    const result = await users.insertOne(user);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}

export async function updateUser(email, refreshToken) {
  const client = new MongoClient(process.env.DATABASE_URL);
  try {
    const database = client.db('PassportJWT');
    const users = database.collection('user');
    const filter = { email: email };
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        refreshToken: refreshToken,
      },
    };
    // create a document to insert
    const result = await users.updateOne(filter, updateDoc, options);
    console.log(`A document was updated with the _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}

export async function updateUserDeleteRefreshToken(email) {
  const client = new MongoClient(process.env.DATABASE_URL);
  try {
    const database = client.db('PassportJWT');
    const users = database.collection('user');
    const filter = { email: email };
    const options = { upsert: false };
    const updateDoc = {
      $set: {
        refreshToken: null,
      },
    };
    // create a document to insert
    const result = await users.updateOne(filter, updateDoc, options);
    console.log(`A document was updated with the _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}
