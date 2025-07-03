function login() {
    let txdata = {
        email: $('#email').val(),
        password: $('#password').val()
    };
    $.ajax({
        url: '/customers/logIn',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType: 'json'
    })
    .done(function (data, textStatus, jqXHR) {
        localStorage.setItem("token", data.token);	
	window.location.replace("account.html");
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
	let formWidg = document.querySelector("#formErrors");
	let emailWidg = document.querySelector("#email");
	let pass1Widg = document.querySelector("#password");

	var ul = document.createElement('ul');
	
	emailWidg.style.setProperty("border", "1px solid #aaa");
	pass1Widg.style.setProperty("border", "1px solid #aaa");
	var listel;
        formWidg.style.setProperty("display", "none");
        var ulist = document.querySelector('#formErrors ul');
        var lis = document.querySelectorAll('#unLi li');
        for(var i=0; listel=lis[i]; i++) {
            listel.parentNode.removeChild(listel);
        }
	emailWidg.style.setProperty("border", "2px solid red");
	pass1Widg.style.setProperty("border", "2px solid red");
	let li = document.createElement("li");
        li.appendChild(document.createTextNode("Email or Password Invalid"));
	ulist.appendChild(li);
	formWidg.style.setProperty("display", "block");
    });
}

$(function () {
	$('#submit').click(login);
});
