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
    filename: 'js/bundle.js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    publicPath: '/assets/'
  },
  mode: 'production',
  plugins: [
    new MiniCssExtractPlugin({ filename: 'css/style.css' })
  ],
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'async', // Only split async chunks to avoid main bundle conflicts
      minSize: 20000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-typescript']
        }
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
            loader: 'sass-loader',
            options: {
              // Use the modern Dart Sass API
              api: 'modern',
              sassOptions: {
                // Silence deprecation warnings from dependencies (Bootstrap 5.3.x)
                // These will be fixed when Bootstrap migrates to the new Sass module system
                // See: https://sass-lang.com/d/import and https://sass-lang.com/d/color-functions
                silenceDeprecations: ['import', 'global-builtin', 'color-functions']
              }
            }
          }
        ]
      }
    ]
  }
}
export default config
