import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { CustomError } from "./ErrorHandler";
import { Roles } from "../../database/models/User";

export class TokenHandler 
{
    static tokenUserId?: number|null = null;
    static userRoles?: Roles[];

    static handle(req: Request, res: Response, next: NextFunction)
    {
        const token: string = req.headers['authorization'].split(' ')[1];
        try {
            const decodedToken: string|jwt.JwtPayload = jwt.verify(token, process.env.SECRET_KEY);
            TokenHandler.tokenUserId = TokenHandler.getDocumentProperty(decodedToken, 'id') as number;
            TokenHandler.userRoles = TokenHandler.getDocumentProperty(decodedToken, 'roles') as Roles[] ?? [];
        } catch (err) {
            next(new CustomError("Invalid Token", 403))
        }
        return next();
    }
    
    static create(userId: number, userRoles: Roles[])
    {
        const token = jwt.sign(
            { id: userId, roles: userRoles}, process.env.SECRET_KEY, {expiresIn: '7d'}
        );
        return token;
    }
    
    static isSameUser(req: Request, res: Response, next: NextFunction)
    {
        if(!req.params.id) {
            next(new CustomError("No identifier given"));
        }
        if (parseInt(req.params.id) != TokenHandler.tokenUserId) {
            next(new CustomError("You can't do that for another user", 403));
        }
        return next();
    }

    static isModerator(req: Request, res: Response, next: NextFunction)
    {
        if (TokenHandler.userRoles.includes(Roles.moderator)) {
            next()
        }else {
            next(new CustomError("You are not a moderator", 403));
        }
    }

    static isAdmin(req: Request, res: Response, next: NextFunction)
    {
        if (TokenHandler.userRoles.includes(Roles.admin)) {
            next()
        }else {
            next(new CustomError("You are not an administrator", 403));
        }
    }

    private static getDocumentProperty (object: any, idKey: string) {
        let result;
      
        if (object) {
          type MyObjectKey = keyof typeof object;
          const myId = idKey as MyObjectKey;
          result = object[myId];
        }
      
        return result;
      }
      
}