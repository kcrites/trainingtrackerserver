//Register a user

const handleRegister = (req, res, db, bcrypt) => {
	const { email, fname, lname, password, height, privacy} = req.body
		if(!email){
			return res.status(422).json({
				errors: {
					email: 'is required',
				}
			});
		}
		if(!password){
			return res.status(422).json({
				errors: {
					password: 'is required',
				}
			});
		}
	const hash = bcrypt.hashSync(password);
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
				.returning('*')
				.insert({
					fname: fname,
					lname: lname,
					email: loginEmail[0],
					height: height,
					privacy: privacy,
					joined: new Date(),
					isadmin: false,
					istrainer: false,
					trainer: 'Desire'
					})
					.then(user => {
						res.json(user[0]);
						})
				})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('Unable to register'))	
	};


module.exports = {
	handleRegister: handleRegister
};