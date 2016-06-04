module.exports = {
	getHome:function(req,res){

		console.log(req.user);
		res.send("/home");
	},
	getAccount:function(req,res){
		res.send({
			email: req.user.local.email,
			fName: req.user.fName,
			lName: req.user.lName
		})
	}
}