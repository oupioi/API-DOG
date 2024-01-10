import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';

export class CheckNumber {

    static CheckintParam = [
        check('param1').isInt().withMessage('Le paramètre doit être un entier'),
        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ];

    static CheckintParams = [
        check('param1').isInt().withMessage('Le paramètre 1 doit être un entier'),
        check('param2').isInt().withMessage('Le paramètre 2 doit être un entier'),
        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ];

    
}