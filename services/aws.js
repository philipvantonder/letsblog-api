const fs = require('fs');
const AWS = require('aws-sdk');

const { aws_bucket_name, aws_bucket_region, aws_access_key_id, aws_secret_key } = require('../config/index');

const s3 = new AWS.S3({
	region: aws_bucket_region,
	accessKeyId: aws_access_key_id,
	secretAccessKey: aws_secret_key,
});

const uploadFile = (fileName) => {

	const fileContent = fs.readFileSync(fileName);

	const params = {
		Bucket: aws_bucket_name,
		Key: 'user-placeholder.jpg',
		Body: fileContent
	}

	s3.upload(params, function(err, data) {
		if (err) {
			throw err;
		}
		console.log(`File uploaded successfully. ${data.Location}`);
	});
}