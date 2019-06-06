	
const checkForEmail = (email, res) => {
	if(!email){
		return res.status(422).json({
			errors: {
				email: 'is required',
			}
		});
	}
}

const checkForPassword = (password, res) => {
	if(!password){
		return res.status(422).json({
			errors: {
				password: 'is required',
			}
		});
	}
}

module.exports = {
	checkForEmail: checkForEmail,
	checkForPassword: checkForPassword,
};