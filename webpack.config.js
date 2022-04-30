const path = require('path');
const globule = require('globule');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const {HtmlWebpackSkipAssetsPlugin} = require('html-webpack-skip-assets-plugin');

const assignPlugins = () => {
	const assignObject = {
		plugins: [
			new CleanWebpackPlugin({
				cleanOnceBeforeBuildPatterns: [
					'assets/stylesheet',
					'assets/js',
				]
			}),
			new HtmlWebpackSkipAssetsPlugin({
				excludeAssets: [/main.js/]
			})
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
		};

		assignObject.plugins.push(new HtmlWebpackPlugin(_obj));
	};

	for (const [htmlFileName, tsxFileName] of Object.entries(entriesList)) {
		pushEntryFiles(htmlFileName, tsxFileName);
	}

	return assignObject;
};

module.exports = () => {
	return [
		Object.assign({
			entry: './src/js/main',
			output: {
				path: path.join(__dirname, 'dist'),
				filename: 'js/[name].js'
			},
			devtool: false,
			watchOptions: {
				ignored: /node_modules/
			},
			resolve: {
				// 拡張子を省略してimportできるようになる
				extensions: ['.js', '.ts', '.tsx'],
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
			target: "web",
		}, assignPlugins())
	]
}