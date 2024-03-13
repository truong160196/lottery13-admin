const path = require("path");

module.exports = {
  alias: {
    "~": path.resolve(__dirname, "./"),
    "@": path.resolve(__dirname, "./src/"),
    src: path.resolve(__dirname, "./src/"),
    utils: path.resolve(__dirname, "./src/utils/"),
    styles: path.resolve(__dirname, "./src/styles/"),
    routers: path.resolve(__dirname, "./src/routers/"),
    states: path.resolve(__dirname, "./src/states/"),
    containers: path.resolve(__dirname, "./src/containers/"),
    constants: path.resolve(__dirname, "./src/constants/"),
    components: path.resolve(__dirname, "./src/components/"),
    pages: path.resolve(__dirname, "./src/pages/"),
    _common: path.resolve(__dirname, "./src/_common/"),
  },
  extensions: [".js", ".jsx", ".json"],
  modules: [path.join(__dirname, "app"), "node_modules"],
};
