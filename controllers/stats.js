
//Takes data from Stats Input Form and send it to the DB
const handleAddStats = (db, req, res) => {
		const { weight, musclemass, fatlevel, bmi, vv, percentwater, statsdate, email} = req.body
		db('stats')
		.returning('*')
		.insert({	
				email: email,
				weight: weight,
				musclemass:musclemass,
				fatlevel: fatlevel,
				bmi: bmi,
				vv:vv,
				percentwater: percentwater,
				statsdate: statsdate
				}).then( user => {
		res.json(user[0]);

	})
	.catch(err => res.status(400).json('Unable to add measurements'))
}

// Returns all of the stats for a user based on email address
const handleGetStats = (db, req, res) => {
	const { email } = req.body;
	return db.select('*').from('stats')
	.where('email', '=', email)
	.orderBy('statsdate', 'desc')
	.then(data => {
		res.json(data)
	})
	.catch(err => res.status(400).json('Unable to get stats history'))
}

module.exports = {
	handleAddStats: handleAddStats,
	handleGetStats: handleGetStats
};