import * as express from 'express';
import { DatabaseProvider } from "./../database";
const products = new DatabaseProvider();

interface IProduct {
    id: number,
    name: string;
    url: string;
    prize: number;
}

function handleError(err: Error, res: express.Response) {
    if (err.message === 'not found') {
        res.status(404).json({ 'error': err.message })
    } else {
        console.error(err);
        res.status(500).json({ 'error': true });
    }
}

function isIProduct(arg: any): arg is IProduct {
    return arg && arg.id && typeof (arg.id) == 'number'
        && arg.name && typeof (arg.name) == 'string'
        && arg.url && typeof (arg.url) == 'string'
        && arg.prize && typeof (arg.prize) == 'number';
}

export class ProductsController {
    static validateId(req: express.Request, res: express.Response, next: express.NextFunction) {
        let id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ 'error': 'id not a number' });
        } else {
            next()
        }
    }

    static validateProduct(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (isIProduct(req.body)) {
            next()
        } else {
            return res.status(400).json({ 'error': 'not a product' });
        }
    }

    static getAllItems(req: express.Request, res: express.Response) {
        return products.get('products').then((data: IProduct[]) => {
            res.status(200).json(data);
        }).catch((err) => {
            handleError(err, res);
        })
    }

    static getSingleItem(req: express.Request, res: express.Response) {
        let id = Number(req.params.id);

        return products.getById('products', id).then((data: IProduct) => {
            res.status(200).json(data);
        }).catch((err) => {
            handleError(err, res);
        })
    }

    static createItem(req: express.Request, res: express.Response) {
        return products.post('products', req.body)
            .then((id: number) => {
                res.status(201).location(`/products/${id}`).json(req.body);
            }).catch((err) => {
                handleError(err, res);
            })
    }

    static modifyItem(req: express.Request, res: express.Response) {
        let id = Number(req.params.id);

        return products.put('products', req.body, id)
            .then(() => {
                res.status(200).json(req.body);
            }).catch((err) => {
                handleError(err, res);
            })
    }

    static deleteItem(req: express.Request, res: express.Response) {
        let id = Number(req.params.id);

        return products.delete('products', id)
            .then(() => {
                res.status(204).end();
            }).catch((err) => {
                handleError(err, res);
            })
    }
}