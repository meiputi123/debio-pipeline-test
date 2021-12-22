const WorkerPlugin = require("worker-plugin")

module.exports = {
  chainWebpack: config => {
    config.module
      .rule("mjs$")
      .test(/\.mjs$/)
      .include
      .add(/node_modules/)
      .end()
      .type("javascript/auto")
  },
  "transpileDependencies": [
    "vuetify",
    "eslint-loader"
  ],
  configureWebpack: {
    output: {
      globalObject: "this"
    },
    plugins: [
      new WorkerPlugin()
    ],
    resolve: {
      extensions: ["*", ".mjs", ".js", ".vue", ".json", ".mjs", ".js", ".vue", ".json", ".gql", ".graphql"]
    },
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto"
        }
      ]
    }
  }
}
