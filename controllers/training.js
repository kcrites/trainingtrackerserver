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

const handleDeleteTraining = (db, req, res) => {
		const { id, packid, completedFlag } = req.body;
		let message = '';
		db.delete('*').from('sessions')
		.where('id', '=', id)
		.then(data => {
			if(packid) {
				 db('package')
				.where('packageid', '=', packid)
				.decrement('sessioncount', 1)
				.then(user => {
					//res.json('Session Deleted and Package Updated')
					message = 'Session Deleted and Package Updated';
				})
				.catch(err => res.status(400).json('Unable to Delete Training' + err))
			} else {
					//res.status(200).json('Session deleted')
					message = 'Session deleted';
			}
		}).then(data => {
			if(completedFlag){
				return db('package')
				.where('packageid', '=', packid)
				.update('completed', false)
				.then(message = 'Delete Complete: 3')
				.then(res.status(200).json(message))
				.catch(err => res.status(400).json('Unable to delete session: empty package error' + err))
		} else {
			message = 'Session Delete Successful';
			return res.status(200).json(message);
		}
	})
		.catch(err => res.status(400).json('Error Deleting Session ' + err))
	 
		//completedFlag is true if it was set by the training session now being deleted.
	

};

	 

module.exports = {
	handleAddTraining: handleAddTraining,
	handleGetTrainings: handleGetTrainings,
	handleDeleteTraining: handleDeleteTraining
};
