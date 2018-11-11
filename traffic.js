var svg = d3.select("#bar"),
margin = {top: 20, right: 40, bottom: 30, left: 60},
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom;
var tooltip = d3.select("body").append("div").attr("class", "toolTip");

var x = d3.scaleBand().range([0, width-20]).padding(0.2).round(true);
//var x = d3.scaleBand().rangeRound([0, width]).paddingInner(0.05).align(0.1);
//var x = d3.scaleOrdinal().range([0, width], .05);
var y = d3.scaleLinear().rangeRound([height, 0]);
var z = d3.scaleOrdinal()
.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
var data;
d3.csv("Lekagul_Sensor_Data.csv", function(d, i, columns) {
  d.Timestamp=d.Timestamp.split(" ")[0];
  d.month=d.Timestamp.split(" ")[0].substring(0, 7);
  d.day=d.Timestamp.split(" ")[0].split("-")[2];

  //console.log(d);

  return d;
}, function(error, d){data=d;});


function drawTraffic(data) {
  
  var g = svg.append("g").attr("transform", "translate(" + 60 + "," + 20 + ")");

//   if(type!="all types"&&month!=0&&gate!=0){
//     var dataFiltered= data.filter(function (d) { return d.month == month && d["car-type"]==type && d["gate-name"]==gate;});
//     var nested = d3.nest()
//     .key(function(d){return d.Timestamp;})
//     .key(function(d){return d["car-type"];})
//     .key(function(d){return d["gate-name"];})
//     .rollup(function(v) { return v.length; })
//     .entries(dataFiltered);
    
//     console.log(nested);
//     var keys = ["1", "2", "2P", "3", "4", "5", "6"];
//     var days=["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
//     x.domain(days.map(function(d) { console.log(month.substring(5,7)+"-"+d);return month.substring(5,7)+"-"+d; }));
   
//     y.domain([0, d3.max(nested, function(d) { return d.values[0].values[0].value; })+3]);
   
//     z.domain(keys);

//     g.selectAll("bar")
//       .data(nested)
//       .enter().append("rect")
//       .style("fill", "steelblue")
//       .attr("x", function(d) { return x(d.key.substring(5, 10)); })
//       .attr("width", x.bandwidth())
//       .attr("y", function(d) { return y(d.values[0].values[0].value); })
//       .attr("height", function(d) { return height - y(d.values[0].values[0].value); })
//       .on("mouseover",function(d,i){
//                 d3.select(this)
//                 .style('fill','pink')})
//       .on("mouseleave", function(d){ 
//                 d3.select(this)
//                 .style('fill','steelblue')})
//       .on("mousemove", function(d){
//                 tooltip
//                 .style("left", d3.event.pageX - 50 + "px")
//                 .style("top", d3.event.pageY - 70 + "px")
//                 .style("display", "inline-block")
//                 .html(d.key.substring(0, 10)+" : "+d.values[0].values[0].value)})
//        .on("mouseout", function(d){ 
//                 tooltip.style("display", "none");})
//        g.append("g")
// .attr("class", "axis")
// .attr("transform", "translate(0," + height + ")")
// .call(d3.axisBottom(x));

// g.append("g")
// .attr("class", "axis")
// .call(d3.axisLeft(y).ticks(null, "s"))
// .append("text")
// .attr("x", 2)
// .attr("y", y(y.ticks().pop()) + 0.5)
// .attr("dy", "0.3em")
// .attr("fill", "black")
// .attr("font-weight", "bold")
// .attr("text-anchor", "start")
// .text("Car Number");
//   }
  
    var keys = ["1", "2", "2P", "3", "4", "5", "6"];
    var days=["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
    var dataFiltered= data.filter(function (d) { return d.month == month;});
    var nested = d3.nest()
    .key(function(d){return d.Timestamp;})
    .key(function(d){ return d["car-type"];})
    .sortKeys(d3.ascending)
    .key(function(d){return d["gate-name"];})
    //.rollup(function(v) { return {total: v.length}; })
    .entries(dataFiltered);
    
    console.log(nested);

    x.domain(days.map(function(d) { return month.substring(5,7)+"-"+d; }));
    

    var stackGenerator=d3.stack().keys(keys).value((d, key)=>{
      
      console.log(d);
      var i = d.values.length;
      while (i--) 
        if (d.values[i].key == key)  break;
      

      
      return i!=-1?  d.values[i].values.length : 0;}) (nested);
    y.domain([0, d3.max(stackGenerator, function(d){return d3.max(d, function(d){return d3.max(d)})})]);

    
    g.append("g")
    .selectAll("g")
    .data(stackGenerator)
    .enter().append("g")
    .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) {return d; })
    .enter().append("rect")
    .attr("x", function(d) { return x(d.data.key.substring(5, 10)); })
    .attr("y", function(d) { return y(d[1]); })
    .attr("height", function(d) { return y(d[0]) - y(d[1]); })
    .attr("width", x.bandwidth())
    .on("mouseover",function(d,i){
      console.log(d);
                d3.select(this)
                .style('opacity','0.5')})
    .on("mouseleave", function(d,i){ 
                d3.select(this)
                .style('opacity','1')
                })
    .on("mousemove", function(d){
                tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 70 + "px")
                .style("display", "inline-block")
                .html(d.data.key.substring(0, 10)+" : "+(-d[0] + d[1]))})
       .on("mouseout", function(d){ 
                tooltip.style("display", "none");})
      g.append("g")
.attr("class", "axis")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x));

g.append("g")
.attr("class", "axis")
.call(d3.axisLeft(y).ticks(null, "s"))
.append("text")
.attr("x", 1)
.attr("y", y(y.ticks().pop()))
.attr("dy", "0.3em")
.attr("fill", "black")
.attr("font-weight", "bold")
.attr("text-anchor", "start")
.text("Car Number");

  var legend = g.append("g")
  .attr("font-family", "sans-serif")
  .attr("font-size", 10)
  .attr("text-anchor", "end")
  .selectAll("g")
  .data(keys.slice().reverse())
  .enter().append("g")
  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
  .attr("x", width - 10)
  .attr("width", 19)
  .attr("height", 19)
  .attr("fill", z);

  legend.append("text")
  .attr("x", width - 14)
  .attr("y", 9.5)
  .attr("dy", "0.32em")
  .text(function(d) { return d; });

}

function Click(){
  month=document.getElementById("sel4").value;
  //type= document.getElementById("sel5").value;
  //gate=document.getElementById("sel6").value;
  d3.select("#bar").selectAll('g').remove();
  console.log(month);
  drawTraffic(data);
}
