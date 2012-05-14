$(document).ready(function(){
 
    $.ajax({
        url: "data/metingen.json",
        method: 'GET',
        dataType: 'json',
        success: onOutboundReceived
    });
 
    function onOutboundReceived(series) {
        var length = series.length;
        var finalData = series;
	var data = [];
	var x_max = new Date(finalData[4]["Datum + tijdstip"]).getTime();
	var x_min = new Date(finalData[0]["Datum + tijdstip"]).getTime();
	for(var i in finalData){
	    date = new Date(finalData[i]["Datum + tijdstip"]).getTime();
	    console.log(i);
	    data[i] =  [date, parseFloat(finalData[i].Waarde)];
	    if (i > 5){ break;}
	}
	console.log(data);
        var options = {
	    yaxis: { 
		min: -1,
		max: 1},
	    xaxis: {
		max: x_max,
		min: x_min},
            lines: { show: true }
        };
        $.plot($("#placeholder"), data, options);
    }
});
