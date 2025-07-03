const urlParams = new URLSearchParams(window.location.search);
const d = urlParams.get('day');
const dev = urlParams.get('deviceID');;
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
                $('#rxdata_daily').html(JSON.stringify(data), null, 2);
                $('#devices').html("");
                data.forEach(function (device) {
                        let line = "<option value=" + device.deviceID + ">Device: " + device.deviceID + "</option>";
                        $("#devices").append(line);
                });
        }).fail(function(data, textStatus, jqXHR) {
                $('#rxdata_daily').html("failed list remove");
        });
}

function hrChart(xValues, yValues){
        new Chart("HRgraph", {
                type: "line",
                data: {
                        labels: xValues,
                        datasets: [{
                                fill: false,
                                lineTension: 0,
                                backgroundColor: "rgba(0,0,0,1.0)",
                                borderColor: "rgba(0,0,0,0.1)",
                                data: yValues,
                                pointBackgroundColor: 'rgb(255, 99, 132)',
                                pointBorderColor: 'rgb(255, 99, 132)',
                                pointRadius: 6,
                                pointHoverRadius: 8,
                                pointHitRadius: 10,
                                showLine: true,
                                spanGaps: false
                        }]
                },
                options: {
                  scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero: true
                      }
                    }]
                  },
                  tooltips: {
                    callbacks: {
                      label: function(tooltipItem) {
                        var dataset = chart.data.datasets[tooltipItem.datasetIndex];
                        var currentValue = dataset.data[tooltipItem.index];
                        var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                          return previousValue + currentValue;
                        });
                        var tooltipLabel = dataset.label || '';
                        
                         var minValue = Math.min(...dataset.data);
                         var maxValue = Math.max(...dataset.data);
          
          
                         if (currentValue === minValue) {
                         tooltipLabel += ": Minimum";
                         } else if (currentValue === maxValue) {
                         tooltipLabel += ": Maximum";
                         }
                         return tooltipLabel + ": " + currentValue;
                      }
                    }
                  }
      }
        });
}
function spo2Chart(xValues, yValues){
    var ctx = document.getElementById('spo2graph').getContext('2d');
    new Chart(ctx, {
            type: "line",
            data: {
                    labels: xValues,
                    datasets: [{
                            fill: false,
                            lineTension: 0,
                            backgroundColor: "rgba(0,0,0,1.0)",
                            borderColor: "rgba(0,0,0,0.1)",
                            data: yValues,
                            pointBackgroundColor: 'rgb(255, 99, 132)',
                            pointBorderColor: 'rgb(255, 99, 132)',
                            pointRadius: 6,
                            pointHoverRadius: 8,
                            pointHitRadius: 10,
                            showLine: true,
                            spanGaps: false
                    }]
            },
            options: {
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              },
              tooltips: {
                callbacks: {
                  label: function(tooltipItem) {
                    var dataset = chart.data.datasets[tooltipItem.datasetIndex];
                    var currentValue = dataset.data[tooltipItem.index];
                    var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                      return previousValue + currentValue;
                    });
                    var tooltipLabel = dataset.label || '';
                    
                     var minValue = Math.min(...dataset.data);
                     var maxValue = Math.max(...dataset.data);
      
      
                     if (currentValue === minValue) {
                     tooltipLabel += ": Minimum";
                     } else if (currentValue === maxValue) {
                     tooltipLabel += ": Maximum";
                     }
                     return tooltipLabel + ": " + currentValue;
                  }
                }
              }
            }
    });
}

function viewReport(){
	let date = new Date();
	date = date.getDate() - d + 1;
        txdata = {
                deviceID: dev,
		day: date
        }
        $.ajax({
                url: '/devices/graph',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(txdata),
                dataType: 'json'
        }).done(function(data, textStatus, jqXHR) {
        	$('#rxdata_daily').html(JSON.stringify(data), null, 2);
		let hrX = [];
		let hrY = [];
                let spo2X = [];
		let spo2Y = [];
		data.forEach(function(report) {
                        hrX.push(report.timeStamp);
			hrY.push(report.HR);
                        spo2X.push(report.timeStamp);
			spo2Y.push(report.spo2);
                });
		hrChart(hrX, hrY);
		spo2Chart(spo2X, spo2Y);
	}).fail(function(data, textStatus, jqXHR) {
                $('#rxdata_daily').html("fail");
	});
}

$(function () {
	$.ajax({
                url: '/customers/status',
                method: 'GET',
                headers: { 'x-auth' : window.localStorage.getItem("token") },
                dataType: 'json'
        })
        .done(function (data, textStatus, jqXHR) {
		 $('#rxdata_daily').html(JSON.stringify(data), null, 2);
	}).fail(function (jqXHR, textStatus, errorThrown) {
                $('rxdata_daily').html("failed to get user email");
        });
	viewReport();
});
