"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = exports.config = void 0;
var server_1 = require("next/server");
var server_2 = require("./app/config/server");
var spark_md5_1 = require("spark-md5");
exports.config = {
    matcher: ["/api/openai", "/api/chat-stream"],
};
var serverConfig = (0, server_2.getServerSideConfig)();
function getIP(req) {
    var _a, _b;
    var ip = (_a = req.ip) !== null && _a !== void 0 ? _a : req.headers.get("x-real-ip");
    var forwardedFor = req.headers.get("x-forwarded-for");
    if (!ip && forwardedFor) {
        ip = (_b = forwardedFor.split(",").at(0)) !== null && _b !== void 0 ? _b : "";
    }
    return ip;
}
function middleware(req) {
    var accessCode = req.headers.get("access-code");
    var token = req.headers.get("token");
    var hashedCode = spark_md5_1.default.hash(accessCode !== null && accessCode !== void 0 ? accessCode : "").trim();
    console.log("[Auth] allowed hashed codes: ", __spreadArray([], serverConfig.codes, true));
    console.log("[Auth] got access code:", accessCode);
    console.log("[Auth] hashed access code:", hashedCode);
    console.log("[User IP] ", getIP(req));
    console.log("[Time] ", new Date().toLocaleString());
    if (serverConfig.needCode && !serverConfig.codes.has(hashedCode) && !token) {
        return server_1.NextResponse.json({
            error: true,
            needAccessCode: true,
            msg: "Please go settings page and fill your access code.",
        }, {
            status: 401,
        });
    }
    // inject api key
    if (!token) {
        var apiKey = serverConfig.apiKey;
        if (apiKey) {
            console.log("[Auth] set system token");
            req.headers.set("token", apiKey);
        }
        else {
            return server_1.NextResponse.json({
                error: true,
                msg: "Empty Api Key",
            }, {
                status: 401,
            });
        }
    }
    else {
        console.log("[Auth] set user token");
    }
    return server_1.NextResponse.next({
        request: {
            headers: req.headers,
        },
    });
}
exports.middleware = middleware;
