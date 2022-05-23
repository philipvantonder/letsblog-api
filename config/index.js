const dotenv = require('dotenv');

dotenv.config();
[
	'NODE_ENV',
].forEach((name) => {
	if (!process.env[name]) {
		throw new Error(`Environement variable ${name} is missing.`);
	}
});

module.exports = {
	node_env: process.env.NODE_ENV,
	jwt_secret: process.env.JWT_SECRET,
	port: process.env.PORT,
	mongo_url: process.env.MONGO_URL,
	sendgrid_api_key: process.env.SENDGRID_API_KEY,
	from_email: process.env.FROM_EMAIL,
	client_url: process.env.CLIENT_URL,
	test_user_email: process.env.TEST_USER_EMAIL,
	aws_bucket_name: process.env.AWS_BUCKET_NAME,
	aws_bucket_region: process.env.AWS_BUCKET_REGION,
	aws_access_key: process.env.AWS_ACCESS_KEY,
	aws_secret_key: process.env.AWS_SECRET_KEY,
}
