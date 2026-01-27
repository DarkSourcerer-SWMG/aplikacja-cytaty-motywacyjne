"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1');
    const config = app.get(config_1.ConfigService);
    const port = config.get('PORT') || 3000;
    await app.listen(port);
    console.log(`Listening on http://localhost:${port}/api/v1`);
}
bootstrap();
//# sourceMappingURL=main.js.map