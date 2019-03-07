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
console.log(db.select('*').from('users').then(data => {

}));

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
	users: [ {
		id: '123',
		name: 'Ken',
		email: 'ken@gmail.com',
		height: 175,
		password: 'dog',
		isAdmin: true,
		joined: new Date()
		},
		{
		id:'124',
		name: 'Jen',
		email: 'jen@gmail.com',
		password: 'cat',
		isAdmin: false,
		joined: new Date()
		}],
	stats: [{
		id:'123',
		weight: 93,
		height:175,
		bmi: 30.2,
		workout: '12/12/1212',

		}],
	login: [{
		id: '987',
		hash: '$2a$10$tWppzxMhW1Rp9wVOzQbSU.OzKq.PaY02/GJ64ZmhUInsvhkKUFuF6',
		email: 'ken@gmail.com'
		},{
		id: '988',
		hash: '$2a$10$tWppzxMhW1Rp9wVOzQbSU.OzKq.PaY02/GJ64ZmhUInsvhkKUFuF6',
		email: 'hayden@gmail.com'	
		}],
	packages: [{
		id: '223',
		packageID: 103,
		dateStarted: '03/01/2019'
	}]
}

app.get('/', (req, res) => { res.send(database.users); })

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
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
	if(req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
		res.json(database.users[0]);
	}
	else {
		res.status(400).json('Error logging in');
	}
})

app.post('/register', (req, res) => {
const { email, name, password, height} = req.body
bcrypt.hash(password, null, null, function(err, hash) {
	console.log(hash);
});
	db('users')
		.returning('*')
		.insert({
		name: name,
		email: email,
		height: height,
		joined: new Date(),
		isadmin: false
	}).then(user => {
		res.json(user[0]);
	})
	.catch(err => res.status(400).json('Unable to register'))
	
})

app.post('/addstats', (req, res) => {
	const {id, weight, height, bmi} = req.body
		database.stats.push({
			id:id,
			weight: weight,
			height: height,
			bmi: bmi,
			workout: new Date()

		});
		res.json(database.stats[database.stats.length-1]);
		console.log(database.stats)
})

app.post('/getstats', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if(user.id === id) {
			found = true;
			return res.json(database.stats[0]);
		} 
	})
	if (!found) {
		res.status(400).json('User not found.');
	}
})

//app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

//app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})

//app.put('/image', (req, res) => { image.handleImage(req, res, db)})
//app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(3001, () => {
	console.log('Training Tracker Server is running on port 3001');
});