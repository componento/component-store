"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function findFileMiddleware(ctx, next) {
    try {
        await next();
    }
    catch (err) {
        ctx.status = err.status || 500;
        ctx.body = "Select File";
        ctx.app.emit('error', err, ctx);
    }
}
exports.findFileMiddleware = findFileMiddleware;
async function listFileMiddleware(ctx, next) {
    try {
        await next();
    }
    catch (err) {
        ctx.status = err.status || 400;
        ctx.body = "Unable To Locate File";
        ctx.app.emit('error', err, ctx);
    }
}
exports.listFileMiddleware = listFileMiddleware;
//# sourceMappingURL=error_handling.js.map