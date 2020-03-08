//Takes data from Training Date Input Form and send it to the DB
const handleAddTraining = (db, req, res) => {
		const {sessiondate, email, packageid, packagedate} = req.body;
		db('sessions')
		.returning('*')
		.insert({	
					email: email,
					sessiondate: sessiondate,
					packageid: packageid,
					packagedate: packagedate
				}).then( user => {
		res.json(user[0]);
	})
	.catch(err => res.status(400).json('Unable to add training session'))	
}

// Returns all of the training sessions for the user under the current package
const handleGetTrainings = (db, req, res) => {
	const { email, packageid } = req.body;
	return db.select('*').from('sessions')
	.where({email: email})
	.orderBy('sessiondate', 'desc')
	.then(train => {
		if(train.length) {
			res.json(train)
		} else {
			res.status(400).json('User training sessions not found')
		}
		})
		.catch(err => res.status(400).json(err + 'Error getting training information'))
	}

module.exports = {
	handleAddTraining: handleAddTraining,
	handleGetTrainings: handleGetTrainings
};