	
//Gets the client list for a trainer
const handleTrainerGetClient = (db, req, res) => {
	return db.select('*').from('users')
			.where('email', '=', req.body.email)
			.then(user => {
				res.json(user[0])
			})
			.catch(err => res.status(400).json('Unable to get user'))
		}


//get clients of a trainer
const handleGetClients = (db, req, res) => {
	const { trainer } = req.body;
	
	db('package')
	.select('*')
	.rightOuterJoin('users', 'users.email', '=', 'package.email')
	.where('users.trainer', '=', trainer)
	.andWhere('package.active', '=', true)
	.orWhere(db.raw('package.packageid is NULL'))
	.andWhere('users.istrainer', '=', false)
	.then(list => {
		res.json(list); 
	})
	.catch(err => res.status(400).json(err + ' Error getting clients package information'));
}

module.exports = {
	handleTrainerGetClient: handleTrainerGetClient,
	handleGetClients: handleGetClients
};