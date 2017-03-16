$(document).ready(function(){
    //dynamically populate dropdowns
    var newSelectDate = document.createElement('select'),
        newSelectSeries = document.createElement('select'),
        selectDateHTML = "",
        selectSeriesHTML = "";

    newSelectDate.className = "form-control";
    newSelectSeries.className = "form-control";
    newSelectDate.id = "chooseDate";
    newSelectSeries.id = "chooseSeries";

    $.getJSON("/columns", function(data){

        var columns =  data.columns;
            timeseries = data.timeseries,
            columnsLen = columns.length,
            timeseriesLen = timeseries.length

        for(i = 0; i < columnsLen; i++){
            selectDateHTML += "<option value='" + columns[i] + "'>" + columns[i]+"</option>";
        };

        for(i = 0; i < timeseriesLen; i++){
            selectSeriesHTML += "<option value='" + timeseries[i] + "'>" + timeseries[i]+"</option>";
        };
        newSelectSeries.innerHTML = selectSeriesHTML;
        newSelectDate.innerHTML = selectDateHTML;
        document.getElementById('chooseSeriesDiv').appendChild(newSelectSeries);
        document.getElementById('chooseDateDiv').appendChild(newSelectDate);
    });

});

function buttonVizPressed() {


  
  var date_col = document.getElementById("chooseDate").value,
      series = document.getElementById("chooseSeries").value,
      periods = document.getElementById("choosePeriods").value

  var params = {"series": series, "date_col": date_col, "periods": periods}

  $.get("/graph", params, function(d){
      var d_array = JSON.parse(d);
      var new_data = d_array.map(function(arg) {
        arg["ds"] = new Date(arg["ds"]);
        return arg;
      });

      var chart = d3.timeseries()
                .addSerie(new_data,
                  {x : "ds",
                   y : "yhat",
                   diff:'n1'},
                   {interpolate:'monotone',color:"#333"})
                .width(900);


      $('#graph-container').empty();
      chart('#graph-container');

  })
};