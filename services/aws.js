const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const { aws_bucket_name, aws_bucket_region, aws_access_key, aws_secret_key } = require('../config/index');

const s3 = new aws.S3({
	region: aws_bucket_region,
	accessKeyId: aws_access_key,
	secretAccessKey: aws_secret_key,
});

const fileFilter = (req, file, cb) => {

	const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

	if (!allowedTypes.includes(file.mimetype)) {
		const error = new Error('Incorrect file type');
		error.code = "INCORRECT_FILETYPE";

		return cb(error, false);
	}

	cb(null, true);

}

const upload = multer({

	fileFilter,
	
	storage: multerS3({
		acl: 'public-read',
	  	s3,
	  	bucket: aws_bucket_name,
		region: aws_bucket_region,
	  	key: function (req, file, cb) {
			cb(null, file.originalname);
	  	},
	}),

});

module.exports = upload;