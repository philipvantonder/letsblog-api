
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

	const { generateRoles } = require('./seed/roles');
	const { addRole } = require('./seed/addRole');

	(async function() {

		await generateRoles();

		await addRole();

		process.exit(1);
	})();

})
.catch(err => console.error(`Could not connect to DB ${err}`));