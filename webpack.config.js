const path = require('path');
const globule = require('globule');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

// ejsファイルが増えても問題ないような処置
const assignPlugins = (env_mode) => {
	const assignObject = {
		plugins: [
			new FixStyleOnlyEntriesPlugin(),
			new CleanWebpackPlugin({
				cleanOnceBeforeBuildPatterns: [
					'assets/stylesheet',
					'assets/javascript',
				]
			}),
			//なんかいいヤツらしい。
			new HtmlWebpackHarddiskPlugin({
				alwaysWriteToDisk: true
			}),
		]
	};

	const reactFiles = globule.find(['**/*.tsx', '!**/_*.tsx'], {
		cwd: `${__dirname}/src/tsx`
	});
	const entriesList = reactFiles.reduce((temp, current) => {
		temp[`${current.replace(new RegExp(`.tsx`, 'i'), `.html`)}`] = `${__dirname}/src/tsx/${current}`;
		return temp;
	}, {});

	const pushEntryFiles = (filename, template) => {
		const _obj = {
			filename: filename,
			template: template,
			// prod時にコメントだけ削除する
			minify: env_mode ?
				false :
				{
					collapseWhitespace: false,
					removeComments: true,
				},
		};

		assignObject.plugins.push(new HtmlWebpackPlugin(_obj));
	};

	for (const [htmlFileName, tsxFileName] of Object.entries(entriesList)) {
		pushEntryFiles(htmlFileName, tsxFileName);
	}

	return assignObject;
};

module.exports = (env, argv) => {
	const is_DEVELOP = argv.mode === "development";

	return [
		Object.assign({
			entry: './src/js/main',
			output: {
				path: path.join(__dirname, 'dist'),
				filename: is_DEVELOP ?
					'assets/javascript/[name].js' :
					'assets/javascript/[name].[contenthash].js',
			},
			devtool: is_DEVELOP ? 'source-map' : 'eval',
			watchOptions: {
				ignored: /node_modules/
			},
			resolve: {
				// 拡張子を省略してimportできるようになる
				extensions: ['.js', '.ts', '.tsx'],
			},

			// UglifyJSPluginは非推奨
			optimization: {
				minimize: is_DEVELOP ? false : true,
				minimizer: [
					new TerserPlugin({
						terserOptions: {
							ecma: 2020,
						}
					})
				]
			},

			module: {
				rules: [
					{
					test: /\.tsx$/,
					use: [{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-typescript', '@babel/preset-react']
						}
					}]
					},
					{
						test: /\.js$/,
						exclude: /node_modules/,
						use: [{
							loader: 'babel-loader',
							options: {
								// promiseを使えるようにするヤツ
								presets: ['@babel/preset-env', '@babel/preset-react'],
								plugins: ['@babel/plugin-transform-runtime'],
							},
						}, ],
					},
					{
						test: /\.ts$/,
						exclude: /node_modules/,
						use: [{
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-typescript'],
								plugins: ['@babel/proposal-class-properties'],
							},
						}, ],
					},
					{
						enforce: 'pre',
						test: /\.js$|\.jsx$|\.tsx$|\.tsx$/,
						exclude: /node_modules/,
						loader: 'eslint-loader',
					},
				],
			},
			devServer: {
				contentBase: path.resolve(__dirname, 'dist'),
				port: 8080,
			},
			stats: {
				children: true //現状機能していない模様
			},
			target: "web",
		}, assignPlugins(is_DEVELOP))
	]
}