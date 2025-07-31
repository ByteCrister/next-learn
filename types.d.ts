// types.d.ts
import { Connection } from "mongoose";

declare global {
    var mongoose: {
        Types: unknown;
        connection: Connection | null;
        promise: Promise<Connection> | null;
    };
}

export { }; 
