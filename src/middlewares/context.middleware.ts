// Import local storage from nodejs
import { AsyncLocalStorage } from 'async_hooks';
// Import NextFunction type from expressjs which is the core of nestjs
import { NextFunction } from 'express';

/**
 * Request context interface of type
 * key value
 */
interface RequestContext {
    [key: string]: string;
}

/**
 * Define global store to hold context
 */
const globalStore = new AsyncLocalStorage<RequestContext>();

/**
 * Simple function to load context for a request from global store
 * Allows easy access to a request's context
 */
export const ctx = (): RequestContext => {
    const context = globalStore.getStore();
    if (!context) {
        console.error('No context available to bind to');
        return {};
    }
    return context;
};

/**
 * Allows wrapping a request in a context
 * GlobalStore has a run function which runs the passed
 * function within the context passed
 * @param fx
 * @param context
 */
const runWithCtx = (
    fx: (ctx: RequestContext) => any,
    context: RequestContext = {},
) => {
    globalStore.run(context, () => {
        return fx(ctx());
    });
};

/**
 * Middleware func to attach all requests applied to with a context
 * Uses the next chain as an entry point to adding the context wrapper
 * which then gets carried forward
 * @param _req
 * @param _res
 * @param next
 */
export const withContext = (
    _req: Request,
    _res: Response,
    next: NextFunction,
) => {
    runWithCtx(() => next(), {});
};

/**
 * Middleware func to attach request's context with headers meta
 * Attaches to request data like requestId and correlationId etc
 * @param mapperFunc
 */
export const appendToContext = (mapperFunc: (context: RequestContext, req: Request) => void) => (
    _req: Request,
    _res: Response,
    next: NextFunction,
) => {
    const context = ctx();
    mapperFunc(context, _req);
    return next();
};
