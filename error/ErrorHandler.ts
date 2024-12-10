import type { Request, Response, NextFunction } from "express";
import { CustomError } from "./HttpExceptions";
import { Prisma } from "@prisma/client";

const ErrorFactory = (err: Error, res: Response) => {
    if (err instanceof CustomError) {
        const { statusCode, stack, isLogging, errors } = err;
        if (isLogging) {
            const logMessage = JSON.stringify({ statusCode, errors, stack }, null, 2);
            console.log(logMessage);
        }
        res.status(statusCode).send({ errors });
        return true
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(JSON.stringify(err, null, 2));
        res.status(400).send({ errors: [{ message: "Bad Request" }] });
        return true
    }
    return null;
};

const ErrorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    const handledError = ErrorFactory(err, res);
    if (!handledError) {
        console.log(JSON.stringify(`Unhandled error: ${err}`, null, 2));
        res.status(500).send({ errors: [{ message: "Internal server error" }] });
    }
};

export default ErrorHandler;