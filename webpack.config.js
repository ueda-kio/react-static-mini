const path = require('path');
const globule = require('globule');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {HtmlWebpackSkipAssetsPlugin} = require('html-webpack-skip-assets-plugin');

const assignPlugins = () => {
	const assignObject = {
		plugins: [
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