const filesModel = require('../models/files');

module.exports = {

	saveFile: async (fileDTO) => {

		const file = new filesModel({
			name: fileDTO.originalname,
			path: fileDTO.location,
			size: fileDTO.size,
			version: 1,
			post_id: fileDTO.postId 
		});

		await file.save();

	}

}