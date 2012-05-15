var jsonToCollection = function(series) {
    //Return 2 dem. list with timeseries
    var collection;
    
    for(var i in finalData){
	date = new Date(finalData[i]["Datum + tijdstip"]).getTime();
	data[i] =  [date, parseFloat(finalData[i].Waarde).toFixed(3)];
	data2[i] = [date, (parseFloat(finalData[i].Waarde) - 0.12).toFixed(3)];
	data3[i] = [date, (parseFloat(finalData[i].Waarde) + 0.12).toFixed(3)];
    }
    return collection;
}


var onOutboundReceived = function(series) {
    var length = series.length;
    var finalData = series;
    var data = [];
    var data2 = [];
    var data3 = [];
    var x_max = finalData[finalData.length-1]["Timestamp"];
    var x_min = finalData[0]["Timestamp"];
    for(var i in finalData){
	var date = finalData[i]["Timestamp"];
	data[i] =  [date, parseFloat(finalData[i].Waarde).toFixed(3)];
	data2[i] = [date, (parseFloat(finalData[i].Waarde) - 0.12).toFixed(3)];
	data3[i] = [date, (parseFloat(finalData[i].Waarde) + 0.12).toFixed(3)];
    }
    var options = {
  colors: ['blue', 'red', 'green'],
  series: {
      lines: { show: true },
      points: { show: true, hoverable: true }
  },
  yaxis: {
      min: -0.4,
      max: 0.1},
  xaxis: {
      mode: "time",
      tickSize: [2, "day"]},
  selection: { mode: "x" },
  grid: { hoverable: true }
    };
    var placeholder = $("#placeholder");

    placeholder.bind("plotselected", function (event, ranges) {
  $("#selection").text(ranges.xaxis.from.toFixed(1) + " to " + ranges.xaxis.to.toFixed(1));
  //alert("tttt");
  //var zoom = $("#zoom").attr("checked");
  var zoom = true;
  if (zoom) {
      var x_min_zoom, x_max_zoom, tick_size, diff_time, diff_seconds;
      x_min_zoom = ranges.xaxis.from;
      x_max_zoom = ranges.xaxis.to; 
      tick_size = [];
      diff_time = x_max_zoom - x_min_zoom;
      diff_seconds = diff_time/1000;
      diff_minutes = diff_time/1000/60;
      diff_hours = diff_time/1000/60/60;
      //TODO get min time stap from timeseries
      if (diff_hours > 24*30) {
    $.merge(tick_size, [1, "month"]); 
      } else if (diff_hours > 24) {
    $.merge(tick_size, [1, "day"]); 
      } else if (diff_hours > 1) {
    $.merge(tick_size, [1, "hour"]);
      } else if (diff_minutes > 45) {
    $.merge(tick_size, [15, "minute"]);
      } else if (diff_minutes > 10) {
    $.merge(tick_size, [10, "minute"]);
      } else if (diff_minutes > 5) {
    $.merge(tick_size, [5, "minute"]);
      } else if (diff_minutes > 1) {
    $.merge(tick_size, [1, "minute"]);
      } else if (diff_seconds > 45 ) {
    $.merge(tick_size, [15, "second"]);
      } else if (diff_seconds > 10) {
    $.merge(tick_size, [10, "second"]);
      } else {
    $.merge(tick_size, [1, "second"]);
      }
      console.log(tick_size);
      plot = $.plot(placeholder, [data, data2, data3],
        $.extend(true, {}, options, {
            xaxis: { min: ranges.xaxis.from,
               max: ranges.xaxis.to,
               tickSize: tick_size }
        }));
  }
    });

    placeholder.bind("plotunselected", function (event) {
  $("#selection").text("");
    });

    function showChartTooltip(x, y, contents) {
  $('<div id="charttooltip">'+ contents + '</div>').css( {
      position: 'absolute',
      display: 'none',
      top: y - 25,
      left: x + 5,
      border: '1px solid #bfbfbf',
      padding: '2px',
      'background-color': '#ffffff',
      opacity: 1
  }).appendTo("body").fadeIn(200);
    }

    placeholder.bind("plothover", function (event, pos, item) {
  $("#x").text(pos.x.toFixed(2));
  $("#y").text(pos.y.toFixed(2));
  if (item) {
      $("#charttooltip").remove();
      var x = item.datapoint[0].toFixed(2),
      y = item.datapoint[1].toFixed(2);
      showChartTooltip(item.pageX, item.pageY,item.datapoint[1]);
  } else {
      $("#charttooltip").remove();
  }
    });

    var plot = $.plot(placeholder, [data, data2, data3], options);

    $("#clearSelection").click(function () {
  plot.clearSelection();
    });

    $("#setSelection").click(function () {
  plot.setSelection({ xaxis: { from: x_min, to: x_max } });
    });

    $("#refresh").click(function () {
  plot = $.plot(placeholder, [data, data2, data3], options);
    });
};


$(document).ready(function(){

    $.ajax({
        url: "data/metingen3.json",
        method: 'GET',
        dataType: 'json',
        success: onOutboundReceived
    });

});
