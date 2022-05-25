const mongoose = require('mongoose');

const FilesSchema = new mongoose.Schema({
    name: String,
    path: String,
    size: Number,
    version: Number,
	post_id: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Posts',
		required: true
	},
}, { timestamps: true });

module.exports = mongoose.model('Files', FilesSchema);