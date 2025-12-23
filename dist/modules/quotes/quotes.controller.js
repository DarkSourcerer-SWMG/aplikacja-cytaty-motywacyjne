"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotesController = void 0;
const common_1 = require("@nestjs/common");
const quotes_service_1 = require("./quotes.service");
const common_2 = require("@nestjs/common");
let QuotesController = class QuotesController {
    constructor(quotesService) {
        this.quotesService = quotesService;
    }
    async random(tag, res) {
        const q = await this.quotesService.getRandom(tag);
        if (!q) {
            return res.status(common_1.HttpStatus.NO_CONTENT).send();
        }
        return res.status(common_1.HttpStatus.OK).json(q);
    }
    async findAll() {
        return this.quotesService.findAll();
    }
    create(body) {
        return this.quotesService.create({
            text: body.text,
            language: body.language,
            authorId: Number(body.authorId),
            tagIds: (body.tagIds ?? []).map(Number),
        });
    }
};
exports.QuotesController = QuotesController;
__decorate([
    (0, common_1.Get)("random"),
    __param(0, (0, common_1.Query)("tag")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuotesController.prototype, "random", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuotesController.prototype, "findAll", null);
__decorate([
    (0, common_2.Post)(),
    __param(0, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QuotesController.prototype, "create", null);
exports.QuotesController = QuotesController = __decorate([
    (0, common_1.Controller)("quotes"),
    __metadata("design:paramtypes", [quotes_service_1.QuotesService])
], QuotesController);
//# sourceMappingURL=quotes.controller.js.map