import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction): void => {

    console.error(`[ERROR] ${err.name}: ${err.message}`);
    const status = res.statusCode !== 200 ? res.statusCode : 500;

    res.status(status).json({
    error: err.message || 'Internal Server Error',
    });
}