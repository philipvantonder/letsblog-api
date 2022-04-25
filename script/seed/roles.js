const roleModel = require('../../models/roles');

module.exports = {
	
	generateRoles: async () => {

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

				console.log(`New ${newRole.name} role added.`);

			}
			
		}

		if (!added) {
			console.log('There was no new roles added.');
		}
		
	}
}