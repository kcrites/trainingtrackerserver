const express = require('express');
const bodyParser = require('body-parser');

//Controllers
/*const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');*/

const app = express();

app.use(bodyParser.json());

const database = {
	users: [ {
			id: '123',
			name: 'Ken',
			email: 'ken@gmail.com',
			password: 'dog',
			joined: new Date()
			},
			{
			id:'124',
			name: 'Jen',
			email: 'jen@gmail.com',
			password: 'cat',
			joined: new Date()
			}
			],
	stats: [{
		id:'123',
		weight: 93,
		height:175,
		bmi: 30.2,
		workout: '12/12/1212',

	}]
}

app.get('/', (req, res) => { res.send('It is working'); })

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if(user.id === id) {
			found = true;
			return res.json(user);
		} 
	})
	if (!found) {
		res.status(400).json('User not found.');
	}
})

//app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/signin', (req, res) => {
	if(req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
		res.json('Success');
	}
	else {
		res.status(400).json('Error logging in');
	}
})

app.post('/register', (req, res) => {
const { email, name, password} = req.body
	database.users.push({
		id: '125',
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	});
	res.json(database.users[database.users.length-1]);
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