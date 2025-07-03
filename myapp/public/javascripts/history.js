let num = 0;
function getDates() {
	    var days = 0;
            var date = new Date();
            var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
            var day =last.getDate();
            var month=last.getMonth()+1;
            var year=last.getFullYear();
             
	    // Add some text to the new cells:
            $("#day1Date").html(month + '/' + day + '/' + year);
	
            days = 1; 
	    
	    // Days you want to subtract
            date = new Date();
            last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
            day =last.getDate();
            month=last.getMonth()+1;
            year=last.getFullYear();
  
            $("#day2Date").html(month + '/' + day + '/' + year);

            days = 2; // Days you want to subtract
            date = new Date();
            last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
            day =last.getDate();
            month = last.getMonth()+1;
            year = last.getFullYear();
            
            $("#day3Date").html(month + '/' + day + '/' + year);

            days = 3; // Days you want to subtract
            date = new Date();
            last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
            day =last.getDate();
            month=last.getMonth()+1;
            year=last.getFullYear();

            $("#day4Date").html(month + '/' + day + '/' + year);

            days = 4; // Days you want to subtract
            date = new Date();
            last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
            day =last.getDate();
            month=last.getMonth()+1;
            year=last.getFullYear();

            $("#day5Date").html(month + '/' + day + '/' + year);

            days = 5; // Days you want to subtract
            date = new Date();
            last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
            day =last.getDate();
            month=last.getMonth()+1;
            year=last.getFullYear();
				
            $("#day6Date").html(month + '/' + day + '/' + year);

            days = 6; // Days you want to subtract
            date = new Date();
            last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
            day =last.getDate();
            month=last.getMonth()+1;
            year=last.getFullYear();
	    num = day;
            $("#day7Date").html(month + '/' + day + '/' + year);
 
}

function getDevices(currentUser){
        let txdata = {
                email: currentUser
        }
        $.ajax({
                url: '/customers/list',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(txdata),
                dataType: 'json'
        }).done(function (data, textStatus, jqXHR) {
                $('#rxdata_weekly').html(JSON.stringify(data), null, 2);
                $('#devices').html("");
                data.forEach(function (device) {
                        let line = "<option value=" + device.deviceID + ">Device: " + device.deviceID + "</option>";
                        $("#devices").append(line);
                });
        }).fail(function(data, textStatus, jqXHR) {
                $('#rxdata_weekly').html("failed list remove");
        });
}

function viewReport(date, index){
	let txdata = {
		deviceID: $('#devices').val(),
		day: date
	}
	$.ajax({
                url: '/devices/date',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(txdata),
                dataType: 'json'
        }).done(function (data, textStatus, jqXHR) {
		$('#rxdata_weekly').html(JSON.stringify(data), null, 2);
		let sum = 0;
		let c = 0;
		let min = 1000;
		let max = -1;
		if(data.length === 0){
		}
		else {
			data.forEach(function (report) {
				sum = sum + report.HR;
				c = c + 1;
				if(report.HR < min){
					min = report.HR;
				}
				if(report.HR > max){
					max = report.HR;
				}
			});
			$("#day" + (7 - index) + "Avg").html(sum/c);
			$("#day" + (7 - index) + "Min").html(min);
			$("#day" + (7 - index) + "Max").html(max);
		}
	}).fail(function(data, textStatus, jqXHR) {
                $('#rxdata_weekly').html("failed list remove");
        });

}

function rowClick(x) {
   // alert("Row index is: " + x.rowIndex);
	location.replace("daily.html?day=" + x.rowIndex + "&deviceID="+ $('#devices').val());
}

$(function() {
	getDates();
	$.ajax({
                url: '/customers/status',
                method: 'GET',
                headers: { 'x-auth' : window.localStorage.getItem("token") },
                dataType: 'json'
        })
        .done(function (data, textStatus, jqXHR) {
                 $('#rxdata_weekly').html(JSON.stringify(data), null, 2);
                data.forEach(function (currentUser) {
                        getDevices(currentUser.email);
                        $('rxdata_weekly').html(currentUser);
                });
        }).fail(function (jqXHR, textStatus, errorThrown) {
                $('rxdata_weekly').html("failed to get user email");
        });
	$("#view").click(function() {
		for(i = 6; i >= 0; i--){
			viewReport(num + i, i);
		}
	});
});

