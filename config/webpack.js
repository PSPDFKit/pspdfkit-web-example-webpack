/**
 * webpack configuration file used to build both
 * a development and production version of the app.
 *
 * The production version is built in the `./dist` folder.
 * When building the development mode it also starts a web server at http://localhost:8080
 *
 * This configuration file creates two main bundles:
 *
 * * vendor.js - contains external libraries (including pspdfkit.js).
 * * app.js - contains the application code.
 *
 * It also copies the WASM/ASM and CSS files from the npm package folder,
 * since `PSPDFKit.load` loads them relative to the application execution path.
 */

const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const licenseKey = fs
  .readFileSync("./config/license-key")
  .toString()
  .replace(/\s/g, "");

if (licenseKey === "") {
  // eslint-disable-next-line no-console
  console.log(`
Invalid or missing license key. Please save your license key to "${path.resolve(
    "./config/license-key"
  )}

If you are a customer you can find your license key in the customers portal https://customers.pspdfkit.com
otherwise if you are using an evaluation license you can find the license key at https://pspdfkit.com/guides/web/current/standalone/integration/#toc_example-application
".
  `);
  process.exit(1);
}

/**
 * Determine whether we are in development mode.
 *
 * $ NODE_ENV=development webpack --config config/webpack.js
 */
const isDev = process.env.NODE_ENV === "development";

const filesToCopy =
  // PSPDFKit files.
  [
    "pspdfkit.wasm.js",
    "pspdfkit.wasm",
    "pspdfkit.asm.js",
    "pspdfkit.asm.js.mem",
    "pspdfkit.css"
  ].map(function(dependency) {
    return {
      from: "./node_modules/pspdfkit/dist/" + dependency,
      to: "./" + dependency
    };
  });

// Application CSS.
filesToCopy.push({
  from: "./src/index.css",
  to: "./index.css"
});

/**
 * webpack main configuration object.
 */
const config = {
  // entry
  entry: {
    // Creates a `vendor.js` bundle which contains external libraries (including pspdfkit.js).
    vendor: ["pspdfkit", "drag-drop"],
    // Creates an `app.js` bundle which contains the application code.
    app: path.resolve("./src/index.js")
  },

  // output
  output: {
    path: path.resolve("./dist"),
    publicPath: "/",
    // [name] is the bundle name from above.
    filename: "[name].js"
  },
  resolve: {
    modules: [path.resolve("./src"), path.resolve("./node_modules")]
  },
  plugins: [
    // Automatically insert <script src="[name].js"><script> to the page.
    new HtmlWebpackPlugin({
      template: path.resolve("./src/index.html"),
      chunks: ["vendor", "app"]
    }),
    // Copy the WASM/ASM and CSS files to the `output.path`.
    new CopyWebpackPlugin(filesToCopy),
    // Create a separate file (known as a chunk) containing the vendor code.
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "vendor.js"
    }),
    new webpack.DefinePlugin({
      // For convenience we define the license key as an environment variable.
      "process.env": {
        PSPDFKIT_LICENSE_KEY: `"${licenseKey}"`
      }
    })
  ],
  // When building for production it is better to ignore any cache.
  cache: isDev
};

// Development only settings.
if (isDev) {
  config.devtool = "source-map";
  config.devServer = {
    host: "127.0.0.1",
    compress: true
  };
}

module.exports = config;
