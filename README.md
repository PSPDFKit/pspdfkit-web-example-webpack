PSPDFKit for Web – webpack example
====================================

This example shows how to build a [PSPDFKit for Web](https://pspdfkit.com/web/) web application with [webpack](https://webpack.js.org/).

This example uses the Standalone version of [PSPDFKit for Web](https://pspdfkit.com/web/) distributed as npm package.

## Prerequisites

* [Node.js](http://nodejs.org/) (with NPM)
* A valid PSPDFKit for Web license

## Getting Started

```bash
git clone git@github.com:PSPDFKit/pspdfkit-web-example-webpack.git
cd pspdfkit-web-example-webpack

echo "place your license key here" > ./config/license-key

PSPDFKIT_NODE_KEY="place your node key here" npm install --save https://customers.pspdfkit.com/npm/${PSPDFKIT_NODE_KEY}/latest.tar.gz

npm install
npm start
```

The example app is built in the `./dist` folder and is now running on [http://localhost:8080](http://localhost:8080).

Upload a PDF either via the `Select File` button at top-left or by dropping a PDF into the page.

For further instructions please refer to our online guide available at https://pspdfkit.com/guides/web/current/standalone/adding-to-your-project#toc_install-with-npm

If you are using an evaluation license you can find the license key at https://pspdfkit.com/guides/web/current/standalone/integration/#toc_example-application

## webpack configuration file

The `webpack` configuration file is located at [./config/webpack.js](config/webpack.js).

## Development mode

To run the app in development mode run

```bash
npm run start:dev
```
