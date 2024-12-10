import type { Request, Response, NextFunction } from "express";
import { HttpException } from "../error/HttpExceptions";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        email: string;
    };
}

export default class Auth {
    constructor() { }
    async verifyToken(req: AuthRequest, _res: Response, next: NextFunction): Promise<void> {
        try {
            const { authorization } = req.headers;
            if (!authorization) throw new HttpException(401, "Unauthorized");
            const [type, token] = authorization.split(" ");
            if (type !== "Bearer") throw new HttpException(401, "Unauthorized");
            const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'content');
            req.user = decoded as { email: string; };
            next();
        } catch (err) {
            next(err)
        }
    }

    verifyPermissions(permission: string) {
        return (req: AuthRequest, _res: Response, next: NextFunction): void => {
            if (!req.user) throw new HttpException(403, "Forbidden");
            next();
        };
    }
}