$(document).ready(function(){
 
    $.ajax({
        url: "data/metingen.json",
        method: 'GET',
        dataType: 'json',
        success: onOutboundReceived
    });
 
    function onOutboundReceived(series) {
        console.log(series);
        var length = series.length;
        var finalData = series;
        var options = {
            lines: { show: true },
            points: { show: true, hoverable:true },
            grid: { hoverable: true, clickable: true }
        };
        $.plot($("#placeholder"), finalData, options);
    }
});