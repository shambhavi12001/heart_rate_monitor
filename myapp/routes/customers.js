var express = require('express');
var router = express.Router();
var Customer = require("../models/customer");
var Device = require("../models/device");
var Report = require("../models/report");
const generateApiKey = require('generate-api-key').default;
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const fs = require('fs');
let fullNameSaved = "";
let emailSaved = "";
const secret = fs.readFileSync(__dirname + '/../keys/jwtkey').toString();

router.post("/createAccount", function (req, res) {
	Customer.findOne({ email: req.body.email }, function (err, customer) {
		if (err) 
			res.status(401).json({ success: false, err: err });
		else if (customer) {
			res.status(401).json({ success: false, msg: "This email already used" });
		}
		else {
			const passwordHash = bcrypt.hashSync(req.body.password, 10);
			const newCustomer = new Customer({
				fullName: req.body.fullName,
				email: req.body.email,
				passwordHash: passwordHash
			});
	
			newCustomer.save(function (err, customer) {
				if (err) {
					res.status(400).json({ success: false, err: err });
				}
				else {
					let msgStr = `Customer (${req.body.email}) account has been created.`;
					res.status(201).json({ success: true, message: msgStr });
					console.log(msgStr);
				}
			});
		}
	});
});

router.post("/logIn", function (req, res) {
	console.log("login please");
	if (!req.body.email || !req.body.password) {
		res.status(401).json({ error: "Missing email and/or password" });
		return;
	}
	// Get user from the database
	Customer.findOne({ email: req.body.email }, function (err, customer) {
		if (err) {
			res.status(400).send(err);
		}
		else if (!customer) {
			res.status(401).json({ error: "Login failure!!" });
		}
		else {
			if (bcrypt.compareSync(req.body.password, customer.passwordHash)) {
				const token = jwt.encode({ email: customer.email }, secret);
				res.status(201).json({ success: true, token: token, msg: "Login success" });
				
				console.log("USer logged in router");
			}
			else {
				res.status(401).json({ success: false, msg: "Email or password invalid." });
			}
		}
	});
});

router.get("/status", function (req, res) {
// See if the X-Auth header is set
        if (!req.headers["x-auth"]) {
                return res.status(401).json({ success: false, msg: "Missing X-Auth header" });
        }
	// X-Auth should contain the token
        const token = req.headers["x-auth"];
        try {
                const decoded = jwt.decode(token, secret);
                // Send back email and last access
                Customer.find({ email: decoded.email }, "email lastAccess", function (err, users) {
                        if (err) {
                                res.status(400).json({ success: false, message: "Error contacting DB. Please contact support." });
                        }
                        else {
                                res.status(200).json(users);
                        }
                });
        }
        catch (ex) {
                res.status(401).json({ success: false, message: "Invalid JWT" });
        }
});

router.post("/update", function (req, res) {
	const passwordHash = bcrypt.hashSync(req.body.password, 10);
	Customer.findOneAndUpdate({ email: req.body.email }, {$set: {fullName: req.body.fullName, passwordHash: passwordHash}}, function (err, doc) {
	if (err) {
            let msgStr = `Something wrong....`;
            res.status(201).json({ message: msgStr, err: err });
        }
        else {
            let msgStr;
            if (doc == null) {
                msgStr = `User info does not exist in DB.`;
            }
            else {
		msgStr = `User info has been updated.`;
            }
		console.log("success update");
	    res.status(201).json({ message: msgStr });
        }
    })
});

router.post("/add", function (req, res) {
	console.log(`device: ${req.body.deviceID}`);
	Device.findOne({ deviceID: req.body.deviceID }, function (err, device) {
		if (err) res.status(401).json({ success: false, err: err });
		else if (device) {
			res.status(401).json({ success: false, msg: "This deivce is already registered"});
		}
		else {
			const newDevice = new Device({
				email: req.body.email,
				deviceID: req.body.deviceID,
				accessToken: req.body.accessToken,
				apikey: generateApiKey()
			});
			newDevice.save(function (err, device) {
				if (err) {
					res.status(400).json({ success: false, err: err });
				}
				else {
					let msgStr = `Device (${req.body.deviceID}) has been added`;
					res.status(201).json({ success: true, message: msgStr });
					console.log(msgStr);
				}
			});
		}
	});
});
router.post("/remove", function (req, res) {
	Device.deleteOne({ deviceID: req.body.deviceID}, function (err, device){
		if (err) {
            		let msgStr = `Something wrong....`;
			res.status(201).json({ message: msgStr, err: err });
		}
		else {
			let msgStr = device;
			res.status(201).json({ message: msgStr });
		}
	});
});

router.post("/list", function (req, res) {
	
	console.log(`EMAIL: ${req.body.email}`);	
	Device.find({ email: req.body.email}, function (err, devices) {
		if (err) {
			let msgStr = `Something wrong....`;
			res.status(201).json({ message: msgStr });
		}
		else {
			res.status(201).json(devices);
		}
	});
});

router.post("/daily", function (req, res) {
	Report.find({ deviceID: req.body.deviceID}, function (err, reports) {
		if (err) {
			let msgStr = `Something wrong....`;
                        res.status(201).json({ message: msgStr, err: err });
		}
		else {
			let msgStr = device;
                        res.status(201).json({ message: msgStr });
                }
	});
});

module.exports = router;

