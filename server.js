const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

//Controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const packages = require('./controllers/packages');
const training = require('./controllers/training');
const trainer = require('./controllers/trainer');
const stats = require('./controllers/stats');
const workout = require('./controllers/workout');
//const info = require('./controllers/info');

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


app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})
app.post('/addtraining', (req, res) => {training.handleAddTraining(db, req, res)})
app.post('/gettrainings', (req, res) => {training.handleGetTrainings(db, req, res)})
app.post('/addstats', (req, res) => {stats.handleAddStats(db, req, res)})
app.post('/getstats', (req, res) => {stats.handleGetStats(db, req, res)})
app.post('/updatepackage', (req, res) => {packages.handleUpdatePackage(db, req, res)})
app.post('/getpackage', (req, res) => {packages.handleGetPackage(db, req, res)})
app.post('/addpackage', (req, res) => {packages.handleAddPackage(db, req, res)})
app.post('/trainergetclient', (req, res) => {trainer.handleTrainerGetClient(db, req, res)})
app.post('/getclients', (req, res) => {trainer.handleGetClients(db, req, res)})
app.post('/updateworkout', (req, res) => {workout.handleUpdateWorkout(db, req, res)})
//app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})


app.listen(3001, () => {
	console.log('Training Tracker Server is running on port 3001');
});


//Gets the client information for a trainer
/*app.post('/trainergetclient', (req, res) => {
	return db.select('*').from('users')
			.where('email', '=', req.body.email)
			.then(user => {
				res.json(user[0])
			})
			.catch(err => res.status(400).json('Unable to get user'))
		}) */


/*// Increments the package used field in Packages table
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

app.post('/addpackage', (req, res) => {
	const { email, maxsessions, packagedate, packageid, newpackage } = req.body;
	console.log(`${email} ${maxsessions} ${packagedate} ${packageid}`)
	if(!newpackage) {
		db.update('active', false).from('package')
				.where('email', '=', email, 'active', '=', true)
/*				.then(info => {
					res.json(user[0])
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
*/
/*app.post('/getclients', (req,res) => {
	//get clients of a trainer
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
})*/


