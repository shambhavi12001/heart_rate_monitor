$(function() {
	$.ajax({
        	url: '/device/report',
		method: 'GET'
	})
	.done(function (data, textStatus, jqXHR) {
		$('#rxData').html(JSON.stringify(data, NULL, 2));
	})
	.fail(function (data, textStatus, jqXHR) {
		$('#rxData').html(JSON.stringify(data, NULL, 2));
	});
});
