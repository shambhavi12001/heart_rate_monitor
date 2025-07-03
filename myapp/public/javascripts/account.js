let errorFound = false;
function editProfile(){
        if ($('#name').val() === "" && $('#password').val() === "") {
                $('#errors').html("invalid name and email!");
        	errorFound = true;
	}
        if ($('#name').val() === "") {
        	$('#errors').html("invalid name!");
        	errorFound = true;
	}
        if($('#password').val() === ""){
		$('#errors').html("invalid password!");
		errorFound = true;
	}


	if(!errorFound) {
		$('#errors').html("");;
        	let txdata = {
                	fullName: $('#name').val(),
			email: $('#success').text(),
                	password: $('#password').val()
        	};
	
         	$.ajax({
                	url: '/customers/update',
                	method: 'POST',
                	contentType: 'application/json',
                	data: JSON.stringify(txdata),
                	dataType: 'json'
         	}).done(function(data, textStatus, jqXHR) {
                	$('#rxdata').html(JSON.stringify(data, null, 2));

         	}).fail(function(data, textStatus, jqXHR) {
                	$('#rxdata').html(JSON.stringify(data, null, 2));
         	});
	}
	$('#name').val("");
	$('#password').val("");
	errorFound = false;
}
function logout() {
    localStorage.removeItem("token");
    window.location.replace("login.html");
}
function addDevice(){
	if($('#deviceID').val() === "" && $('#accessToken').val() === ""){
		window.alert("invalid id and access token!");
	}
	if($('#deviceID').val() === ""){
		window.alert("invalid id!");
	}
	if($('#accessToken').val() === ""){
		window.alert("invalid access token!");
	}
	let txdata = {
		email: $('#success').html(),
		deviceID: $('#deviceID').val(),
		accessToken: $('#accessToken').val()
	}
	$.ajax({
                url: '/customers/add',
		method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(txdata),
                dataType: 'json'
        }).done(function(data, textStatus, jqXHR) {
		$('#rxdata').html("success add");
		getDevices("#removeDevice");
		getDevices("#devices");
	}).fail(function(data, textStatus, jqXHR) {
		$('#rxdata').html("failed add");
	});
}

function removeDevice() {
        let txdata = {
                deviceID: $('#removeDevice').val()
        }
        $.ajax({
                url: '/customers/remove',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(txdata),
                dataType: 'json'
        }).done(function(data, textStatus, jqXHR) {
                $('#rxdata').html("success remove");
		getDevices("#removeDevice");
		getDevices("#devices");
	}).fail(function(data, textStatus, jqXHR) {
		$('#rxdata').html("fail remove");
	});
}

function getDevices(id){
	let txdata = {
		email: $('#success').html()
	}
	$.ajax({
        	url: '/customers/list',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(txdata),
                dataType: 'json'
	}).done(function (data, textStatus, jqXHR) {
                $('#rxdata').html(JSON.stringify(data), null, 2);
		$(id).html("");
                data.forEach(function (device) {
			let line = "<option value=" + device.deviceID + ">Device: " + device.deviceID + "</option>";
                        $(id).append(line);
                });
        }).fail(function(data, textStatus, jqXHR) {
                $('#rxdata').html("failed list remove");
        });
}
		
function setDelay(){
if(!($('#devices').val() === "")){

	let txdata = {
		deviceID: $('#devices').val(),
		delayNum: $('#frequency').val()
	}
	$.ajax({
                url: '/devices/frequency',
		method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(txdata),
                dataType: 'json'
        }).done(function (data, textStatus, jqXHR) {
		$('#rxdata').html(done);
	 }).fail(function(data, textStatus, jqXHR) {
                $('#rxdata').html("failed freq");
        });
}
}
$(function (){
    	$('#logout').click(logout);
	$('#submit').click(editProfile);
	$('#regDev').click(addDevice);
	$('#rmDevice').click(removeDevice);
	$('#range').click(setDelay);
	$.ajax({
        	url: '/customers/status',
        	method: 'GET',
        	headers: { 'x-auth' : window.localStorage.getItem("token") },
        	dataType: 'json'
	})
    	.done(function (data, textStatus, jqXHR) {
        	$('#rxdata').html(JSON.stringify(data), null, 2);
		data.forEach(function (currentUser) {
			$('#success').html(currentUser.email);
		});
    	})
    	.fail(function (jqXHR, textStatus, errorThrown) {
        	window.location.replace("display.html");
    	});
	setTimeout(function(){
		getDevices("#removeDevice");
		getDevices("#devices");
	}, 500);
});


