import mongoose from "mongoose";

// mongoose.set("debug", true);

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
    throw new Error("MongoDB URL is not defined!");
}

let cached = global.mongoose; // Attempt to retrieve an existing global cache for the MongoDB connection

// * Initialize the cache if it does not exist
if (!cached) {
    cached = global.mongoose = { Types: null, connection: null, promise: null };
}

const ConnectDB = async () => {
    // * Return the existing database connection if available
    if (cached.connection) {
        return cached.connection;
    }

    // * If no existing connection attempt is in progress, create a new connection promise
    if (!cached.promise) {
        const opts = {
            bufferCommands: true, // Enable Mongoose command buffering while connecting
            maxPoolSize: 10, // Limit the connection pool to 10 connections
        };
        cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);
    }

    try {
        // * Wait for the ongoing connection attempt to resolve
        cached.connection = await cached.promise;
    } catch (error) {
        cached.promise = null; // Reset promise if the connection fails
        throw error;
    }

    // * Return the active MongoDB connection
    return cached.connection;
};

export default ConnectDB;