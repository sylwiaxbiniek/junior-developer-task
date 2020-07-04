
import { IDatabaseProvider } from '../../server/database';

export class MockDatabaseProvider implements IDatabaseProvider {
    public database: any = {};

    constructor(database: Object = {}) {
        this.database = database;
    }

    public get(table: string): Promise<Object> {
        return new Promise((resolve) => {
            return resolve(this.database[table] || null);
        });
    }

    public getById(table: string, id: number): Promise<Object> {
        return new Promise((resolve, reject) => {
            if (id < this.database[table].length) {
                return resolve(this.database[table][id] || null);
            } else {
                reject(new Error('not found'));
            }
        });
    }

    public post(table: string, product: any): Promise<Object> {
        return new Promise((resolve) => {
            let id = this.database[table].length;
            return resolve(id);
        });
    }

    public put(table: string, product: any, id: number): Promise<Object> {
        return new Promise((resolve, reject) => {
            if (id < this.database[table].length) {
                return resolve();
            } else {
                reject(new Error('not found'));
            }
        });
    }

    public delete(table: string, id: number): Promise<Object> {
        return new Promise((resolve, reject) => {
            if (id < this.database[table].length) {
                return resolve();
            } else {
                reject(new Error('not found'));
            }
        });
    }
}