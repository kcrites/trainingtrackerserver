// Increments the package used field in Packages table
const handleUpdatePackage = (db, req, res) => {
	const { email, packageid } = req.body;
	db('package')
	.where(
		'packageid', '=', packageid, 'email', '=', email, 
	)
	.increment('sessioncount', 1)
	.returning('*')
	.then(pack =>{
		if(pack[0].maxsessions === pack[0].sessioncount){
			return db.update('completed', true).from('package')
			.where('packageid', '=', packageid, 'email', '=', email)
			.then(info => {
				res.json(pack)})
		} else{
				res.json(pack);
		}
	})
	.catch(err => res.status(400).json('Unable to increment session count'))	
}

const handleAddPackage = (db, req, res) => {
	const { email, maxsessions, packagedate, packageid, newpackage } = req.body;
	console.log(`${email} ${maxsessions} ${packagedate} ${packageid}`)
	if(!newpackage) {
		db.update('active', false).from('package')
				.where('email', '=', email, 'active', '=', true)
/*				.then(info => {
					res.json(user[0])*/
				.catch(err => res.status(400).json('Unable to update package: active'))
	}
	return db('package')
	.returning('*')
	.insert({	
			email: email,
			packageid: packageid,
			sessioncount: 0,
			maxsessions: maxsessions,
			completed: false,
			active: true,
			datestarted: packagedate
			})
	.then(user => {
		res.json(user[0])
	})
	.catch(err => res.status(400).json('Unable to add package' + err))
}


const handleGetPackage = (db, req, res) => {
	const { email } = req.body;
	db('package').where({email: email, active: true}).select('*')
	.then(pack => {
		if(pack.length) {
			res.json(pack[0])
		} else {
			res.status(400).json('User Package Not Found')
		}
		})
		.catch(err => res.status(400).json(err + 'Error getting package information'))
}

module.exports = {
	handleUpdatePackage: handleUpdatePackage,
	handleAddPackage: handleAddPackage,
	handleGetPackage: handleGetPackage,
};

