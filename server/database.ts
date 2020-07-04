var fs = require('fs');
var path = require('path');

var DB_FILE = path.join(__dirname, '../../database.json');

export interface IDatabaseProvider {
    get(table: string): Promise<Object>;
    getById(table: string, id: number): Promise<Object>;
    post(table: string, product: any): Promise<Object>;
    put(table: string, product: any, id: number): Promise<Object>;
    delete(table: string, id: number): Promise<Object>;
}

export class DatabaseProvider implements IDatabaseProvider {

    constructor() { }

    public get(table: string): Promise<Object> {
        return new Promise((resolve, reject) => {
            fs.readFile(DB_FILE, (err, data) => {
                if (err) {
                    reject(err);
                }

                return resolve(JSON.parse(data)[table] || null);
            });
        });
    }

    public getById(table: string, id: number): Promise<Object> {
        return new Promise((resolve, reject) => {
            fs.readFile(DB_FILE, (err, data) => {
                if (err) {
                    reject(err);
                }

                let db = JSON.parse(data);
                if (id < db[table].length) {
                    return resolve(db[table][id] || null);
                } else {
                    reject(new Error('not found'));
                }
            });
        });
    }

    public post(table: string, product: any): Promise<Object> {
        return new Promise((resolve, reject) => {
            fs.readFile(DB_FILE, (err, data) => {
                if (err) {
                    reject(err);
                }

                let products = JSON.parse(data);
                let id = products[table].length;
                products[table].push(product);

                fs.writeFile(DB_FILE, JSON.stringify(products, null, 4), (err) => {
                    if (err) {
                        reject(err);
                    }
                    return resolve(id);
                });
            });
        });
    }

    public put(table: string, product: any, id: number): Promise<Object> {
        return new Promise((resolve, reject) => {
            fs.readFile(DB_FILE, (err, data) => {
                if (err) {
                    reject(err);
                }

                let products = JSON.parse(data);
                let length = products[table].length;
                if (id < length) {
                    products[table].splice(id, 1, product);

                    fs.writeFile(DB_FILE, JSON.stringify(products, null, 4), (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    });
                } else {
                    reject(new Error('not found'));
                }
            });
        });
    }

    public delete(table: string, id: number): Promise<Object> {
        return new Promise((resolve, reject) => {
            fs.readFile(DB_FILE, (err, data) => {
                if (err) {
                    reject(err);
                }

                let products = JSON.parse(data);
                let length = products[table].length;
                if (id < length) {
                    products[table].splice(id, 1);

                    fs.writeFile(DB_FILE, JSON.stringify(products, null, 4), (err) => {
                        if (err) {
                            reject(err);
                        }
                        return resolve();
                    });
                } else {
                    reject(new Error('not found'));
                }
            });
        });
    }
}