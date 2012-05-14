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
	var data2 = [];
	var data3 = [];
	var x_max = new Date(finalData[finalData.length-1]["Datum + tijdstip"]).getTime();
	var x_min = new Date(finalData[0]["Datum + tijdstip"]).getTime();
	for(var i in finalData){
	    date = new Date(finalData[i]["Datum + tijdstip"]).getTime();
	    data[i] =  [date, parseFloat(finalData[i].Waarde)];
	    data2[i] = [date, parseFloat(finalData[i].Waarde) - 0.12];
	    data3[i] = [date, parseFloat(finalData[i].Waarde) + 0.12];
	}
        var options = {
	    colors: ['blue', 'red', 'green'],
	    series: {
		lines: { show: true },
		points: { show: true }
            },
	    yaxis: {
		min: -0.4,
		max: 0.1},
	    xaxis: {
		mode: "time",
		tickSize: [2, "day"]},
	    selection: { mode: "x" }
        };
	var placeholder = $("#placeholder");

	placeholder.bind("plotselected", function (event, ranges) {
            $("#selection").text(ranges.xaxis.from.toFixed(1) + " to " + ranges.xaxis.to.toFixed(1));
	    //alert("tttt");
            //var zoom = $("#zoom").attr("checked");
            var zoom = true;
            if (zoom)
		plot = $.plot(placeholder, [data, data2, data3],
                              $.extend(true, {}, options, {
				  xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
                              }));
	});

	placeholder.bind("plotunselected", function (event) {
            $("#selection").text("");
	});

	var plot = $.plot(placeholder, [data, data2, data3], options);

	$("#clearSelection").click(function () {
            plot.clearSelection();
	});

	$("#setSelection").click(function () {
            plot.setSelection({ xaxis: { from: x_min, to: x_max } });
	});
    }

});
