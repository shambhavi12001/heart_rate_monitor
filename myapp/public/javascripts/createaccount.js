function createaccount() {
    // data validation
    let nameWidg = document.querySelector("#fullName");

let emailWidg = document.querySelector("#email");

let pass1Widg = document.querySelector("#password");

let pass2Widg = document.querySelector("#passwordConfirm");

let formWidg = document.querySelector("#formErrors");

let nameInvWidg = document.querySelector("#nameInvalid");

	var ul = document.createElement('ul');

let nameValid = false;
let emailValid = false;
let passwordValid = false;
let passwordValid2 = false;
let passwordValid3 = false;
let passwordValid4 = false;
let passwordValid5 = false;
let emReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/

	pass1Widg.style.setProperty("border", "1px solid #aaa");
    pass2Widg.style.setProperty("border", "1px solid #aaa");
    nameWidg.style.setProperty("border", "1px solid #aaa");
    emailWidg.style.setProperty("border", "1px solid #aaa");

    var listel;
    formWidg.style.setProperty("display", "none");
    var ulist = document.querySelector('#formErrors ul');
    var lis = document.querySelectorAll('#unLi li');
    for(var i=0; listel=lis[i]; i++) {
        listel.parentNode.removeChild(listel);
    }


    let name = nameWidg.value;
    name = name.trim();

    let pass1 = pass1Widg.value;
    pass1 = pass1.trim();

    let pass2 = pass2Widg.value;
    pass2 = pass2.trim();

    let email = emailWidg.value;
    email = email.trim();

    //name validate
    if (name.length >= 1){
        nameValid = true;
    }
    else {
        nameValid = false;
        let li = document.createElement("li");
        li.appendChild(document.createTextNode("Missing full name."));
        nameWidg.style.setProperty("border", "2px solid red");
        ulist.appendChild(li);

    }

    //email validate
    if (emReg.test(email)){
        emailValid = true;
    }
    else {
        emailValid = false;
        let li = document.createElement("li");
        li.appendChild(document.createTextNode("Invalid or missing email address."));
        ulist.appendChild(li);
        emailWidg.style.setProperty("border", "2px solid red");

    }

    if(pass1.length >= 10 && pass1.length <= 20){
        passwordValid = true;
    }
    else {
        passwordValid = false;
        let li = document.createElement("li");
        li.appendChild(document.createTextNode("Password must be between 10 and 20 characters."));
        ulist.appendChild(li);
        pass1Widg.style.setProperty("border", "2px solid red");
        pass2Widg.style.setProperty("border", "2px solid red");


    }

    //lowercase
    if (/[a-z]/.test(pass1)){
        passwordValid2 = true;
    }
    else {
        passwordValid2 = false;
        let li = document.createElement("li");
        li.appendChild(document.createTextNode("Password must contain at least one lowercase character."));
        ulist.appendChild(li);
        pass1Widg.style.setProperty("border", "2px solid red");
        pass2Widg.style.setProperty("border", "2px solid red");
    }

    //uppercase
    if (/[A-Z]/.test(pass1)){
        passwordValid3 = true;
    }
    else {
        passwordValid3 = false;
        let li = document.createElement("li");
        li.appendChild(document.createTextNode("Password must contain at least one uppercase character."));
        ulist.appendChild(li);
        pass1Widg.style.setProperty("border", "2px solid red");
        pass2Widg.style.setProperty("border", "2px solid red");
    }

    //digit
    if (/[1-9]/.test(pass1)){
        passwordValid4 = true;
    }
    else {
        passwordValid4 = false;
        let li = document.createElement("li");
        li.appendChild(document.createTextNode("Password must contain at least one digit."));
        ulist.appendChild(li);
        pass1Widg.style.setProperty("border", "2px solid red");
        pass2Widg.style.setProperty("border", "2px solid red");
    }

    //match
    if (pass1 == pass2){
        passwordValid5 = true
    }
    else {
        passwordValid5 = false;
        let li = document.createElement("li");
        li.appendChild(document.createTextNode("Password and confirmation password don't match."));
        ulist.appendChild(li);
        pass1Widg.style.setProperty("border", "2px solid red");
        pass2Widg.style.setProperty("border", "2px solid red");
    }
    //display
    if (!nameValid || !emailValid || !passwordValid || !passwordValid2 || !passwordValid3 || !passwordValid4 || !passwordValid5) {
        formWidg.style.setProperty("display", "block");
	return;
    }


    let txdata = {
	fullName: $('#fullName').val(),
	email: $('#email').val(),
        password: $('#password').val()
    };

    $.ajax({
        url: '/customers/createAccount',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType: 'json'
    })
    .done(function (data, textStatus, jqXHR) {
        $('#rxData').html(JSON.stringify(data, null, 2));
        if (data.success) {
            // after 1 second, move to "login.html"
            setTimeout(function(){
                window.location = "login.html";
            }, 1000);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status == 404) {
            $('#rxData').html("Server could not be reached!!!");    
        }
        else if(jqXHR.status != 400){

                        formWidg.style.setProperty("display", "none");
                        var ulist = document.querySelector('#formErrors ul');
                        var lis = document.querySelectorAll('#unLi li');
                        for(var i=0; listel=lis[i]; i++) {
                            listel.parentNode.removeChild(listel);
                        }
                        emailWidg.style.setProperty("border", "2px solid red");
                        let li = document.createElement("li");
                        li.appendChild(document.createTextNode("This email has been already used"));
                        ulist.appendChild(li);
                        formWidg.style.setProperty("display", "block");
		$('#rxData').html(JSON.stringify(jqXHR, null, 2));
	}
    });
}



$(function () {
    $('#submit').click(createaccount);
});
