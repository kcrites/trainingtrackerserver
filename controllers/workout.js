const handleGetWorkout = (db, req, res) => {
    data2 = {
        email: 'kencrites@gmail.com',
        date: '12/12/1990'
    }
    const { email, workoutdate } = req.body;
	return db.select('*').from('workout')
	.where('email', '=', email, 'workoutdate', '=', workoutdate)
	.then(data => {
		res.json(data2)
	})
	.catch(err => res.status(400).json('Unable to get Workout Information'))
};

//Takes data from Stats Input Form and send it to the DB
const handleUpdateWorkout = (db, req, res) => {
    const {email, workoutdate} = req.body
 /*    db('workoutgroup')
    .returning('*')
    .insert({	
            email: email,
            group: 1,
            workoutdate: workoutdate
            }).then( user => { 
   
                res.json(user[0]);

})
.catch(err => res.status(400).json('Unable to add measurements'))*/
console.log(req.body.email, req.body.group1, req.body.group2, req.body.trainingdate);
}

module.exports = {
    handleUpdateWorkout: handleUpdateWorkout,
    handleGetWorkout: handleGetWorkout
	
};