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
	{ id:'124',
	name: 'Jen',
	email: 'jen@gmail.com',
	password: 'cat',
	joined: new Date()
	}
	]
}

app.get('/', (req, res) => { res.send('It is working'); })

//app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/signin', (req, res) => {
	if(req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
		res.json('Success');
	}
	else {
		res.status(400).json('Error logging in');
	}
})

//app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

//app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})

//app.put('/image', (req, res) => { image.handleImage(req, res, db)})
//app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(3001, () => {
	console.log('Training Tracker Server is running on port 3001');
});