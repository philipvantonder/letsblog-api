
const mongoose = require('mongoose');
const { mongo_url } = require('../config/index');

// Connect to mongo
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI || mongo_url, {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true,
    useUnifiedTopology: true 
})
.then(() => {

	console.log('Seeding starting...');

	const { generateRoles } = require('./seed/roles');

	(async function() {

		await generateRoles();

	})();

	console.log('Seeding done...');

})
.catch(err => console.error(`Could not connect to DB ${err}`));