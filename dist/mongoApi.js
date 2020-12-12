"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertData = exports.getData = exports.dbResolver = void 0;
var mongodb_1 = require("mongodb");
var redis = require("redis");
var mongoClient = new mongodb_1.MongoClient("mongodb://rwuser:T7z-75F-34m-rGC@192.168.0.69:8635,192.168.0.106:8635,192.168.0.214:8635,192.168.0.100:8635,192.168.0.11:8635,192.168.0.216:8635,192.168.0.125:8635,192.168.0.5:8635,192.168.0.114:8635,192.168.0.132:8635/test?authSource=admin", { useUnifiedTopology: true });
var publisher = redis.createClient({
    password: 'T7z-75F-34m-rGC',
    host: "192.168.0.111",
});
function dbResolver(resolver) {
    var _this = this;
    if (resolver === void 0) { resolver = function (client) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }; }
    return __awaiter(this, void 0, void 0, function () {
        var client, db, changeStream, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, mongoClient.connect()];
                case 1:
                    client = _a.sent();
                    db = client.db("moldb");
                    changeStream = db.watch();
                    changeStream.on('change', function (next) {
                        console.log('changed ', next['fullDocument']);
                        // process next document
                    });
                    return [3 /*break*/, 4];
                case 2:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [3 /*break*/, 4];
                case 3: return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.dbResolver = dbResolver;
function getData(index) {
    return __awaiter(this, void 0, void 0, function () {
        var resolve, reject, result, client, db, rs, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = new Promise(function (r, rj) { resolve = r; reject = rj; });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, mongoClient.connect()];
                case 2:
                    client = _a.sent();
                    db = client.db("moldb");
                    return [4 /*yield*/, db.collection('moldb').find({
                            _id: index
                        }).toArray(function (err, _result) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            console.log(index);
                            console.log(_result);
                            resolve(__spreadArrays([index], _result));
                        })];
                case 3:
                    rs = _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    e_2 = _a.sent();
                    console.error(e_2);
                    return [3 /*break*/, 6];
                case 5: return [7 /*endfinally*/];
                case 6: return [2 /*return*/, result];
            }
        });
    });
}
exports.getData = getData;
function insertData(body) {
    return __awaiter(this, void 0, void 0, function () {
        var resolve, reject, result, client, db, collection, data, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = new Promise(function (r, rj) { resolve = r; reject = rj; });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, mongoClient.connect()];
                case 2:
                    client = _a.sent();
                    db = client.db("moldb");
                    return [4 /*yield*/, db.collection('moldb')];
                case 3:
                    collection = _a.sent();
                    data = __assign({ _id: body[0] }, body[1]);
                    collection.updateOne({ _id: body[0] }, { $set: data }, { upsert: true }, function (err, result) {
                        return __awaiter(this, void 0, void 0, function () {
                            var doc;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (err) {
                                            console.log(err);
                                            reject(err);
                                            return [2 /*return*/];
                                        }
                                        return [4 /*yield*/, getData(body[0])];
                                    case 1:
                                        doc = _a.sent();
                                        publisher.publish('moldb', JSON.stringify(doc));
                                        resolve(doc);
                                        return [2 /*return*/];
                                }
                            });
                        });
                    });
                    return [3 /*break*/, 6];
                case 4:
                    e_3 = _a.sent();
                    console.error(e_3);
                    return [3 /*break*/, 6];
                case 5: return [7 /*endfinally*/];
                case 6: return [2 /*return*/, result];
            }
        });
    });
}
exports.insertData = insertData;
//# sourceMappingURL=mongoApi.js.map