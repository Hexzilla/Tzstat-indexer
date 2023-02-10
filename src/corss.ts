import cors, { CorsOptions } from 'cors';

const getApplicationAllowedOrigins = (): string[] => {
	const env = process.env.APP_ENV;

	switch (env) {
		case 'production':
			return [
				'https://pixl.xyz',
			];
		case 'development':
		default:
			return [
				'http://localhost:3000',
				'http://localhost:3001',
			];
	}
};

const AppliationCorsOptions: CorsOptions = {
	origin: getApplicationAllowedOrigins(),
	methods: ['PUT', 'GET', 'POST', 'DELETE', 'OPTIONS'],
	optionsSuccessStatus: 200,
};

//export default cors(AppliationCorsOptions);
export default cors({
	origin: '*'
});
