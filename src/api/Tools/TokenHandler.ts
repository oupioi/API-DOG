import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { CustomError } from "./ErrorHandler";

export class TokenHandler 
{
    static tokenUserId?: number|null = null;

    static handle(req: Request, res: Response, next: NextFunction)
    {
        const token: string = req.headers['authorization'].split(' ')[1];
        try {
            const decodedToken: string|jwt.JwtPayload = jwt.verify(token, process.env.SECRET_KEY);
            TokenHandler.tokenUserId = TokenHandler.getDocumentProperty(decodedToken, 'id');
        } catch (err) {
            throw new CustomError("Invalid Token", 403)
        }
        return next();
    }
    
    static create(userId: number)
    {
        const token = jwt.sign(
            { id: userId }, process.env.SECRET_KEY, {expiresIn: '7d'}
        );
        return token;
    }

    private static getDocumentProperty (object: any, idKey: string) {
        let result;
      
        if (object) {
          type MyObjectKey = keyof typeof object;
          const myId = idKey as MyObjectKey;
          result = object[myId];
        }
      
        return parseInt('' + result);
      }
      
      
}