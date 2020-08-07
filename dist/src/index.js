"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_router_1 = __importDefault(require("koa-router"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const koa_json_1 = __importDefault(require("koa-json"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const component_api_1 = __importDefault(require("./component-api"));
const Sequelize = require('sequelize');
const app = new koa_1.default();
const router = new koa_router_1.default();
router.get("/", async (ctx, next) => {
    ctx.body = "hello!";
    ctx.res.statusCode = 200;
});
// Init Middlewares
app.use(koa_json_1.default());
app.use(koa_logger_1.default());
app.use(koa_bodyparser_1.default());
// Routes
app.use(router.routes()).use(router.allowedMethods());
app.use(component_api_1.default.routes());
const PORT = process.env.port || 3000;
app.listen(PORT, () => {
    console.log(`Koa started on port ${PORT}`);
});
//# sourceMappingURL=index.js.map