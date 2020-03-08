const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const PORT = process.env.PORT || 3005;

//Controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const packages = require('./controllers/packages');
const training = require('./controllers/training');
const trainer = require('./controllers/trainer');
const stats = require('./controllers/stats');
const workout = require('./controllers/workout');
const version = '1.75';

/* const db = knex({
  client: 'pg',
  connection: {
   host : '127.0.0.1',
   user: '',
   password: '',
   database: 'trainingtest'
  }
});  */

 const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true,
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
app.post('/getworkout', (req, res) => {workout.handleGetWorkout(db, req, res)})

app.get('/', (req, res) => {
    res.send('trainingtrackerDB working, ' + version)
});

app.listen(PORT, () => {
	console.log(`PT Tracker Server is running on port ${PORT}`);
});

