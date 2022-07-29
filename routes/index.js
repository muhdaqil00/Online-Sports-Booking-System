const express = require('express')
const router = express.Router()
const Facility = require('../models/facility')
const User = require('../models/user')

router.get('/home', async(req, res) => {
    
    let facilities
    try {
        facilities = await Facility.find().sort({ createdAt: 'desc'}).limit(10).exec()
    } catch{
        facilities = []
    }
    res.render('index', {facilities: facilities})
})

router.get('/', async(req, res) => {
    
    res.render('welcome')
})

router.get('/register', function (req, res, next) {
	return res.render('register.ejs');
})

router.post('/register', function(req, res, next) { //registration
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.Fname || !personInfo.Lname || !personInfo.username || !personInfo.email || 
        !personInfo.password || !personInfo.passwordConf || !personInfo.birthDate){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							Fname:personInfo.Fname,
                            Lname:personInfo.Lname,
							username: personInfo.username,
                            email:personInfo.email,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf,
                            birthDate: personInfo.birthDate
						});
						newPerson.save()

					}).sort({_id: -1}).limit(1);
					res.redirect('/login')
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

router.get('/login', function (req, res, next) { //login
	return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.redirect('/home')
			}else{
				res.send({"Failed":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not registered!"});
		}
	});
});

router.get('/logout', function (req, res, next) { //logout
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

module.exports = router