"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSideConfig = void 0;
var spark_md5_1 = require("spark-md5");
var ACCESS_CODES = (function getAccessCodes() {
  var _a;
  var code = process.env.CODE;
  try {
    var codes = (
      (_a = code === null || code === void 0 ? void 0 : code.split(",")) !==
        null && _a !== void 0
        ? _a
        : []
    )
      .filter(function (v) {
        return !!v;
      })
      .map(function (v) {
        return spark_md5_1.default.hash(v.trim());
      });
    return new Set(codes);
  } catch (e) {
    return new Set();
  }
})();
var getServerSideConfig = function () {
  if (typeof process === "undefined") {
    throw Error(
      "[Server Config] you are importing a nodejs-only module outside of nodejs",
    );
  }
  return {
    apiKey: process.env.OPENAI_API_KEY,
    code: process.env.CODE,
    codes: ACCESS_CODES,
    needCode: ACCESS_CODES.size > 0,
    proxyUrl: process.env.PROXY_URL,
    isVercel: !!process.env.VERCEL,
  };
};
exports.getServerSideConfig = getServerSideConfig;
