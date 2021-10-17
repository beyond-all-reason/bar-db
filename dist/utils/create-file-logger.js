"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileLogger = void 0;
const fs_1 = __importDefault(require("fs"));
function createFileLogger(name) {
    fs_1.default.mkdirSync("logs", { recursive: true });
    const writeStream = fs_1.default.createWriteStream(`logs/${name}.log`, { flags: "a" });
    return (...data) => {
        writeStream.write(`${new Date().toISOString()}: ${data}\r\n`);
    };
}
exports.createFileLogger = createFileLogger;
//# sourceMappingURL=create-file-logger.js.map