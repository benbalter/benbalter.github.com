import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import { fileURLToPath } from 'url'
import autoprefixer from 'autoprefixer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config = {
  entry: ['./js/script.ts', './sass/_retlab.scss'],
  output: {
    path: path.resolve(__dirname, 'assets'),
    filename: 'js/bundle.js'
  },
  mode: 'production',
  plugins: [
    new MiniCssExtractPlugin({ filename: 'css/style.css' })
  ],
  optimization: {
    minimize: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader'
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer
                ]
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  }
}
export default config
