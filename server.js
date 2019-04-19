const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

//Controllers
/*const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');*/

const db = knex({
  client: 'pg',
  connection: {
   host : '127.0.0.1',
   user: '',
   password: '',
   database: 'trainingtest'
  }
});


const app = express();

app.use(bodyParser.json());
app.use(cors());


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

//app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('login')
	.where('email', '=', req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
		if(isValid) {
			return db.select('*').from('users')
			.where('email', '=', req.body.email)
			.then(user => {
				res.json(user[0])
			})
			.catch(err => res.status(400).json('Unable to get user'))
		} else {
				res.status(400).json('Wrong credentials')
		}
	})
	.catch(err => res.status(400).json('Wrong credentials'))
})

//Gets the client information for a trainer
app.post('/trainergetclient', (req, res) => {
	return db.select('*').from('users')
			.where('email', '=', req.body.email)
			.then(user => {
				res.json(user[0])
			})
			.catch(err => res.status(400).json('Unable to get user'))
		}) 

app.post('/register', (req, res) => {
const { email, name, password, height} = req.body
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
				name: name,
				email: loginEmail[0],
				height: height,
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
})

//Takes data from Training Date Input Form and send it to the DB
app.post('/addtraining', (req, res) => {
	const {sessiondate, email, packageid, packagedate} = req.body;
	console.log(packagedate);
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
})

// Increments the package used field in Packages table
app.post('/updatepackage', (req, res) => {
	const { email, packageid } = req.body;
	db('package')
	.where(
		'packageid', '=', packageid, 'email', '=', email, 
	)
	.increment('sessioncount', 1)
	.returning('*')
	.then(pack =>{
		//console.log(`pack: ${pack[0]} sessioncount: ${pack[0].sessioncount}, maxsessions: ${pack[0].maxsessions}`)
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
})

// Returns all of the training sessions for the user under the current package
app.post('/gettrainings', (req, res) => {
	const { email, packageid } = req.body;
	return db.select('*').from('sessions')
	.where({email: email, packageid: packageid})
	.then(train => {
		if(train.length) {
			res.json(train)
		} else {
			res.status(400).json('User training sessions not found')
		}
		})
		.catch(err => res.status(400).json(err + 'Error getting training information'))
})

//Takes data from Stats Input Form and send it to the DB
app.post('/addstats', (req, res) => {
	const {name, height, weight, musclemass, fatlevel, bmi, vv, percentwater, statsdate, email} = req.body
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
})

// Returns all of the stats for a user
app.post('/getstats', (req, res) => {
	const { email} = req.body;
	return db.select('*').from('stats')
	.where('email', '=', email)
	.then(data => {
		res.json(data)
	})
	.catch(err => res.status(400).json('Unable to get stats history'))
})

app.post('/getpackage', (req, res) => {
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
})

app.post('/getclients', (req,res) => {
	//get clients of a trainer
	const { trainer } = req.body;
	db('users')
	.select('*')
	.innerJoin('package', 'users.email', '=', 'package.email')
	.where('users.trainer', '=', req.body.trainer)
	.where('package.active', '=', true)
	.then(list => {
		//console.log(list.email);
		res.json(list); })
	.catch(err => res.status(400).json(err + ' Error getting clients package information'))
})

//app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

//app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})

//app.put('/image', (req, res) => { image.handleImage(req, res, db)})
//app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(3001, () => {
	console.log('Training Tracker Server is running on port 3001');
});