import { Request, Response, NextFunction } from 'express';
import { CustomError } from './ErrorHandler';

export class CheckNumber {
    static CheckintID(req: Request, res: Response, next: NextFunction) {
        if (isNaN(parseInt(req.params.id))) {
            next(new CustomError('Not Found', 404));
        }
        next();
    }
    static CheckintZipCode(req: Request, res: Response, next: NextFunction) {
        if (isNaN(parseInt(req.params.zip_code))) {
            next(new CustomError('Not Found', 404));
        }
        next();
    }
    // si il y a plusieurs paramètres ID à vérifier, on peut utiliser un tableau
    static CheckintID2(req: Request, res: Response, next: NextFunction) {
        const params = ['id', 'id2'];
        params.forEach((param) => {
            if (isNaN(parseInt(req.params[param]))) {
                next(new CustomError('Not Found', 404));
            }
        });
        next();
    }
}
       