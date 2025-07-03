var express = require('express');
var router = express.Router();
var Report = require("../models/report");
var Device = require("../models/device");
var fetch = require("node-fetch");
router.post("/report", function(req, res) {
	console.log(`${req.body.spo2}`);
	console.log(`${req.body.heartRate}`);
	console.log(`${req.body.apikey}`);
	Device.findOne({apikey: req.body.apikey}, function(err, device){

		console.log(req.body.apikey);
		if (err) {
           		res.status(400).send(err);
       		}
		else if(!device) {
			res.status(401).json({ message: "device not in db"});
		}
		else {
			console.log("new report");
			const newReport = new Report({
				deviceID: req.body.deviceID,
				HR: req.body.heartRate,
				spo2: req.body.spo2,
				apikey: req.body.apikey
			});
			console.log("saving...");
			newReport.save(function(err, report) {
				if(err) {
					res.status(400).json({ success: false, err: err });
                		}
				else {
                   			let msgStr = `Report (${req.body.deviceID}) has been created.`;
					res.status(201).json({ success: true, message: msgStr });
					console.log(msgStr);
					let args={
						flashOkay: "1"
					}
					console.log(device.accessToken);
					async function flash(){
						const params = new URLSearchParams({ 
							access_token: device.accessToken
						});
						const response = await fetch("https://api.particle.io/v1/devices/" + req.body.deviceID + "/flash?" + params, {
							method: "POST",
                 			        	headers: { "Content-Type": "application/json" },
                        				body: JSON.stringify(args)
                				});
                				if(response.ok) {
                        				console.log("flashed");
                				}
                				else{
                        				console.log("not flashed");
							console.log(response);
                				}
					}
					flash();
				}
			});
		}
	});
});
router.post("/frequency", function(req, res) {
	Device.findOne({deviceID: req.body.deviceID}, function(err, device){
                if (err) {
                        res.status(400).send(err);
                }
                else if(!device) {
                        res.status(401).json({ message: "device not in db"});
                }
                else {
			let args={
                                delayNum: req.body.delayNum
                        }
			async function delay(){
				const params = new URLSearchParams({
                                                        access_token: device.accessToken
                                                });
				const response = await fetch("https://api.particle.io/v1/devices/" + req.body.deviceID + "/setDelay?" + params, {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify(args)
                                                });
				if(response.ok) 
				{
                                	console.log("flashed");
                                }
                                else{
					console.log("not flashed");
                                        console.log(response);
				}
			}
			delay();
		}
	});
});
router.post("/graph", function(req, res) {
	let toDate = "";
        let fromDate = "";
        console.log(req.body.day);
        if(req.body.day < 9){
                toDate = "2022-12-0" + (req.body.day + 1);
                fromDate = "2022-12-0" + (req.body.day);
        }
        else if(req.body.day > 9){
                toDate = "2022-12-" + (req.body.day + 1);
                fromDate = "2022-12-" + (req.body.day);
        }
        else{
                toDate = "2022-12-" + (req.body.day + 1);
                fromDate = "2022-12-0" + (req.body.day);
        }
	console.log(toDate);
	console.log(fromDate);
	Report.find({deviceID: req.body.deviceID, timeStamp : {$gt: new Date(fromDate), $lt: new Date(toDate)}}, function(err, reports) {
		if (err) {
                        res.status(400).send(err);
                }
		else if(!reports) {
			res.status(401).json({ message: "no measurements"});
		}
		else{
			console.log(reports);
			res.status(201).json(reports);
		}
	});
});

router.post("/date", function(req, res) {
	let toDate = "";
	let fromDate = "";
	console.log(req.body.day);
	if(req.body.day < 9){
		toDate = "2022-12-0" + (req.body.day + 1);
		fromDate = "2022-12-0" + (req.body.day);
	}
	else if(req.body.day > 9){
		toDate = "2022-12-" + (req.body.day + 1);
		fromDate = "2022-12-" + (req.body.day);
	}
	else{
		toDate = "2022-12-" + (req.body.day + 1);
		fromDate = "2022-12-0" + (req.body.day);
	}
	Report.find({deviceID: req.body.deviceID, timeStamp : {$gt: new Date(fromDate), $lt: new Date(toDate)}}, function(err, reports) {
                if (err) {
                        res.status(400).send(err);
                }
                else if(!reports) {
                        res.status(401).json({ message: "no measurements"});
			console.log("no measurements");
                }
                else{
			console.log(`reports are from ${req.body.day}`);
                        res.status(201).json(reports);
                	console.log(reports);
		}
        });
});

module.exports = router;
