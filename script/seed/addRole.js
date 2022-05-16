const roleModel = require('../../models/roles');
const userRolesModel = require('../../models/userRoles');
const usersModel = require('../../models/users');

module.exports = {
	
	addRole: async () => {

		const rolesArr = [{ name: 'Moderator' }, { name: 'Admin' }];
		
		let added = false;
		for (let newRole of rolesArr) {

			const role = await roleModel.findOne({ name: newRole.name });
			
			const user = await usersModel.findOne({ email: 'pvantonder157@gmail.com' });
			
			if (user && role) {
				
				const userRole = await userRolesModel.findOne({ user: user._id, role: role._id });

				if (!userRole) {

					added = true;
					
					rolesModelObj = new userRolesModel({
						user: user._id,
						role: role._id,
					});
					
					await rolesModelObj.save();
					
					console.log(`New user role added: ${newRole.name} added for ${user.email}.`);
				}

			}
			
		}

		if (!added) {
			console.log('There was no user roles added.');
		}

	}
}