# PSPDFKit for Web Example – Webpack

This example shows how to build a [PSPDFKit for Web](https://pspdfkit.com/web/) web application with
[webpack](https://webpack.js.org/).

This example uses the Standalone version of [PSPDFKit for Web](https://pspdfkit.com/web/)
distributed as an npm package.

## Prerequisites

- [Node.js](http://nodejs.org/)
- A PSPDFKit for Web license. If you don't already have one
  you can [request a free trial here](https://pspdfkit.com/try/).

## Getting Started

Clone the repo:

```bash
git clone https://github.com/PSPDFKit/pspdfkit-web-example-webpack.git
cd pspdfkit-web-example-webpack
```

Install the project dependencies with `npm`:

```bash
npm install
```

Now that everything is installed we need to configure the app to use our [PSPDFKit for Web license key](https://pspdfkit.com/guides/web/current/standalone/integration).

Edit `./config/license-key` and replace the string `YOUR_LICENSE_KEY_GOES_HERE` with the license key that you received via e-mail.

## Running the Example

We are ready to launch the app! 🎉

```bash
npm run start
```

You can now open http://localhost:8080 in your browser and enjoy!

Upload a PDF either via the `Select File` button at top-left or by dropping a PDF into the page.

We put a sample PDF document in the `assets` folder of this project for you to try!

For further instructions please refer to our online guide available at
https://pspdfkit.com/guides/web/current/standalone/adding-to-your-project#toc_install-with-npm

If you are using an evaluation license you can find the license key at
https://pspdfkit.com/guides/web/current/standalone/integration/#toc_example-application

### Development mode

To run the app in development mode run

```bash
npm run start:dev
```

## webpack configuration file

The `webpack` configuration file is located at [./config/webpack.js](config/webpack.js).

## License

This software is licensed under a [modified BSD license](LICENSE).

## Contributing

Please ensure
[you signed our CLA](https://pspdfkit.com/guides/web/current/miscellaneous/contributing/) so we can
accept your contributions.
