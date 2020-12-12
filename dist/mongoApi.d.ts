import { Db } from "mongodb";
export declare function dbResolver(resolver?: (client: Db) => Promise<void>): Promise<void>;
export declare function getData(index: any): Promise<unknown>;
export declare function insertData(body: any): Promise<unknown>;
