

export async function findFileMiddleware (ctx:any, next:any) {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = "Select File";
        ctx.app.emit('error', err, ctx);
    }
}

export async function listFileMiddleware (ctx:any, next:any) {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 400;
        ctx.body = "Unable To Locate File";
        ctx.app.emit('error', err, ctx);
    }
}
