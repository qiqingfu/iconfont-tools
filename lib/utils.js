"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePath = exports.copy = exports.readFile = exports.mkFile = exports.rmdir = exports.mkdir = exports.exitDir = exports.getState = void 0;
var fs_1 = __importDefault(require("fs"));
var rimraf_1 = __importDefault(require("rimraf"));
var path_1 = __importDefault(require("path"));
exports.getState = function (filePath) {
    return new Promise(function (resolve) {
        /**
         * 不推荐在调用 fs.open()，fs.readFile()、fs.writeFile()之前使用 fs.stat() 检查文件是否存在
         * 要检查文件是否存在而不对其进行操作，建议使用 fs.access()
         */
        fs_1.default.stat(filePath, function (err, stats) {
            if (err) {
                return resolve(false);
            }
            resolve(stats);
        });
    });
};
/**
 * 检查文件目录是否存在
 * @param filePath 路径 path
 */
exports.exitDir = function (filePath) {
    return new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
        var fileStats;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.getState(filePath)
                    // 文件不存在，返回 false
                ];
                case 1:
                    fileStats = _a.sent();
                    // 文件不存在，返回 false
                    if (!fileStats) {
                        return [2 /*return*/, resolve(false)];
                    }
                    // 目录不存在，返回 false
                    if (!fileStats.isDirectory()) {
                        resolve(false);
                    }
                    // 返回 true
                    resolve(true);
                    return [2 /*return*/];
            }
        });
    }); });
};
/**
 * 根据给定的 path，创建新的目录
 * @param path
 */
exports.mkdir = function (filePath) {
    return new Promise(function (resolve) {
        /**
         * 异步地创建目录
         */
        fs_1.default.mkdir(filePath, { recursive: true }, function (err) {
            if (err) {
                return resolve(false);
            }
            resolve(true);
        });
    });
};
exports.rmdir = function (filePath) {
    return new Promise(function (resolve) {
        rimraf_1.default(filePath, function (err) {
            if (err) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        });
    });
};
/**
 * 将指定的内容写入文件
 * @param filePath
 * @param content
 */
exports.mkFile = function (filePath, content) {
    return new Promise(function (resolve) {
        try {
            fs_1.default.writeFileSync(filePath, content);
            resolve(true);
        }
        catch (error) {
            resolve(false);
        }
    });
};
/**
 * 读取指定文件的内容
 * @param path
 */
exports.readFile = function (filePath) {
    return new Promise(function (resolve) {
        try {
            var content = fs_1.default.readFileSync(filePath, 'utf-8');
            resolve(content);
        }
        catch (error) {
            resolve(false);
        }
    });
};
exports.copy = function (from, to) {
    return new Promise(function (resolve) {
        try {
            fs_1.default.writeFileSync(to, fs_1.default.readFileSync(from));
            resolve(true);
        }
        catch (error) {
            resolve(false);
        }
    });
};
function generatePath(flPath) {
    return __awaiter(this, void 0, void 0, function () {
        var targetPath, pwd, isDir, createSuccess;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    targetPath = flPath;
                    /**
                     * 这是在校验相对路径吗?
                     * 如果生成的目标路径是相对路径，就解析为绝对路径
                     * 解析的规则：
                     *  - 运行当前 cli 所在的路径 + 相对路径
                     *  - 通过 path.resolve() 解析
                     */
                    if (flPath.indexOf('.') === 0) {
                        pwd = process.cwd();
                        targetPath = path_1.default.resolve(pwd, flPath);
                    }
                    return [4 /*yield*/, exports.exitDir(targetPath)
                        /**
                         * 如果要生成的目录不存在的话，就给用户创建
                         */
                    ];
                case 1:
                    isDir = _a.sent();
                    if (!!isDir) return [3 /*break*/, 3];
                    console.log("\u5BF9\u4E0D\u8D77\uFF0C\u8F93\u51FA\u76EE\u5F55" + targetPath + "\u4E0D\u5B58\u5728\uFF01");
                    return [4 /*yield*/, exports.mkdir(targetPath)];
                case 2:
                    createSuccess = _a.sent();
                    if (!createSuccess) {
                        throw new Error("\u76EE\u5F55" + targetPath + "\u521B\u5EFA\u5931\u8D25");
                    }
                    console.log("\u76EE\u5F55" + targetPath + "\u521B\u5EFA\u6210\u529F");
                    _a.label = 3;
                case 3: return [2 /*return*/, targetPath];
            }
        });
    });
}
exports.generatePath = generatePath;
exports.default = {
    generatePath: generatePath,
    getState: exports.getState,
    exitDir: exports.exitDir,
    mkdir: exports.mkdir,
    rmdir: exports.rmdir,
    mkFile: exports.mkFile,
    readFile: exports.readFile,
    copy: exports.copy,
};
