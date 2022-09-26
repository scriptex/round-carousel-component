const { resolve } = require('path');

module.exports = {
	entry: {
		'round-carousel': './src/round-carousel.ts'
	},
	output: {
		path: resolve(__dirname, '..', 'dist'),
		filename: '[name].js',
		library: {
			type: 'umd',
			name: 'RoundCarousel'
		}
	},
	resolve: {
		extensions: ['.ts']
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader'
			}
		]
	}
};
