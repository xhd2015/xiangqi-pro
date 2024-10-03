const path = require("path")
const fs = require("fs")
// const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const webpack = require("webpack")

let distDir = process.env["DIST_DIR"]
if (!distDir) {
  distDir = "dist"
}

module.exports = {
  entry: {
    index: "./src/index.tsx",
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, distDir + "/build"),
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["file?name=[name].[ext]"],
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/, // too much files if commented out, making it too slow
        resolve: {
          extensions: [".tsx", ".ts", ".js", ".jsx"],
        },

        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      // specifically for node_modules/code-lens-support-login
      {
        test: /\.tsx?$/,
        include:
          /(node_modules\/(code-lens-support-login|code-lens-support-admin|coverage-visualizer))/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.(js|jsx)$/,
        include:
          /(node_modules\/(code-lens-support-login|code-lens-support-admin|coverage-visualizer))/, // too much files if commented out, making it too slow
        resolve: {
          extensions: [".tsx", ".ts", ".js", ".jsx"],
        },
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: "file-loader",
          options: {
            outputPath: "assets",
          },
        },
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: "file-loader?name=/img/[name].[ext]",
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
    },
    extensions: [".tsx", ".ts", "jsx", ".js"],
    fallback: {
      util: require.resolve("util/"),
    },
  },
  plugins: [
    // new MonacoWebpackPlugin({}),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    // new BundleAnalyzerPlugin(),
  ],
}
