const roleModel = require('../../models/roles');

module.exports = {
	
	generateRoles: async () => {

		console.log('Seeding Roles...');

		const rolesArr = [{ name: 'Moderator' }, { name: 'Admin' }];
		
		let added = false;
		for (let newRole of rolesArr) {
			
			const role = await roleModel.findOne({ name: newRole.name });
			
			if (!role) {
				added = true;
				
				rolesModelObj = new roleModel({
					name: newRole.name
				});
				
				rolesModelObj.save();

				console.log(`${name} was added.`);

			}
			
		}

		if (!added) {
			console.log('There was no new roles added.');
		}
	}
}