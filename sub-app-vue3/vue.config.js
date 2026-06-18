const path = require("path");
const {defineConfig} = require('@vue/cli-service')

const node_env = process.env.NODE_ENV === "production";
const packageName = require("./package.json").name;

const baseUrl = "/";
const resolve = (dir) => path.join(__dirname, dir);

module.exports = defineConfig({
  //打包输入目录
  outputDir: `../dist/${packageName}`,
  publicPath: node_env ? baseUrl : "/",
  assetsDir: "static",
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
    output: {
      library: `${packageName}-[name]`,
      libraryTarget: "umd", // 把微应用打包成 umd 库格式
      // jsonpFunction: `webpackJsonp_${packageName}`,
    },
  },

  transpileDependencies: true,
  devServer: {
    port: 5013,
    headers: {
      // 主应用获取子应用时跨域响应头
      'Access-Control-Allow-Origin': '*',
    },
  },
})
