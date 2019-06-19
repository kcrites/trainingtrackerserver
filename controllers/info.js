app.get('/', (req, res) => {
	return db.select('*').from('users')
	.then(users => {
	if(users.length) {
		res.json(users)
	}	
	else{
		res.status(400).json('No Users in DB')
	}
}).catch(err => res.status(400).json('Error getting users list'))
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db.select('*').from('users').where({id})
	.then(user => {
		if(user.length) {
			res.json(user[0])
		} else {
			res.status(400).json('User Not Found')
		}
		})
		.catch(err => res.status(400).json('Error getting user'))
})