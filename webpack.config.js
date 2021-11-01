const { resolve } = require('path');

module.exports = {
	entry: {
		'round-carousel': './src/round-carousel.ts'
	},
	output: {
		path: resolve(__dirname, 'dist'),
		filename: '[name].js',
		libraryTarget: 'umd',
		library: 'RoundCarousel',
		umdNamedDefine: true
	},
	resolve: {
		extensions: ['.ts']
	},
	devtool: false,
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'awesome-typescript-loader'
			}
		]
	},
	target: 'web'
};
