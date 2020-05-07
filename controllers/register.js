//Register a user

const handleRegister = (req, res, db) => {
	const { email, fname, lname, trainer, privacy} = req.body
		if(!email){
			return res.status(422).json({
				errors: {
					email: 'is required',
				}
			});
		
	
		}
	
		db.transaction(trx => {
			
			 trx('users')
				.returning('*')
				.insert({
					fname: fname,
					lname: lname,
					email: email,
					privacy: privacy,
					joined: new Date(),
					isadmin: false,
					istrainer: false,
					trainer: trainer
					})
					.then(user => {
						res.json(user[0]);
						})
			
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('Unable to register'))	
	};


module.exports = {
	handleRegister: handleRegister
};