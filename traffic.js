var svg = d3.select("#bar"),
margin = {top: 20, right: 550, bottom: 30, left: 30},
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom;
var tooltip = d3.select("body").append("div").attr("class", "toolTip");

var radius = 270 / 2;
var donutarc = d3.arc()
    .outerRadius(radius )
    .innerRadius(radius-30);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d; });

    var color_pie_donut = d3.scaleOrdinal()
    .range(["#E6E6FA", "#D8BFD8", "#DDA0DD", "#EE82EE","#BA55D3","#663399","#8B008B","#4B0082","#6A5ACD","#7B68EE","#008080","#8FBC8B","#556B2F",
      "#6B8E23","#008000","#3CB371","#98FB98","#87CEEB","#B0E0E6","#4682B4","#DEB887","#BC8F8F","#F4A460","#B8860B","#D2691E"]);

var x = d3.scaleBand().range([0, width-15]).padding(0.3).round(true);
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
  
  var g = svg.append("g").attr("transform", "translate(" + 30 + "," + 20 + ")");

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
    .key(function(d){return [d.Timestamp,d["car-type"]];})
    .key(function(d){ return d["car-type"];})
    .sortKeys(d3.ascending)
    .key(function(d){return d["gate-name"];})
    //.rollup(function(v) { return {total: v.length}; })
    .entries(dataFiltered);
    
    console.log(nested);
    x.domain(days.map(function(d) { return d; }));
    

    var stackGenerator=d3.stack().keys(keys).value((d, key)=>{
      
      
      var i = d.values.length;
      while (i--) 
        if(d.values[i].key==key)break;

      console.log(i);
      t=0;
      if(i!=-1){
        for(j=0;j<d.values[i].values.length;j++)
        {
            t+=d.values[i].values[j].values.length;
        }
        console.log(t);
      }
      return t;}) (nested);
    y.domain([0, d3.max(stackGenerator, function(d){return d3.max(d, function(d){return d3.max(d)})})]);

    g.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x));

g.append("g")
.attr("class", "y axis")
.call(d3.axisLeft(y).ticks(null, "s"))
.append("text")
.attr("x", 4)
.attr("y", y(y.ticks().pop())-3)
.attr("dy", "0.3em")
.attr("fill", "black")
.attr("font-weight", "bold")
.attr("text-anchor", "start")

d3.select("#bar").append("text")
  .attr("x", 5)
  .attr("y",15)
  .attr("dy", "0.25em")
  .style("font-size", "12px")
  .style("text-anchor", "start")
  .text("Car Number")

  d3.select("#bar").append("text")
  .attr("x", 105)
  .attr("y",15)
  .attr("dy", "0.25em")
  .style("font-size", "12px")
  .style("text-anchor", "start")
  .text("Total Car Number In The Boonsong Lekagul Nature Preserve By Car Type In "+month)

d3.selectAll("g.x g.tick") 
      .append("line")       
      .classed("grid-line", true)
      .attr("x1", 0) 
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", -height);  

  d3.selectAll("g.y g.tick") 
      .append("line") 
      .classed("grid-line", true)
      .attr("x1", 0) 
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0);

    g.append("g")
    .selectAll("g")
    .data(stackGenerator)
    .enter().append("g")
    .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) {console.log(d);return d; })
    .enter().append("rect")
    .attr("x", function(d) { return x(d.data.key.substring(8, 10)); })
    .attr("y", function(d) { return y(d[1]); })
    .attr("height", function(d) { return y(d[0]) - y(d[1]); })
    .attr("width", x.bandwidth()-2)
    .on("mouseover",function(d,i){
      var type=d.data.key.substring(11,13);
      var date=d.data.key.substring(0,10)
      drawdonutpie(d.data.values[0].values,date);
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
  .attr("x", width - 16)
  .attr("y", 8)
  .attr("dy", "0.35em")
  .text(function(d) { return d; });

}
function drawdonutpie(data,date)
  {
    console.log(data)
    
    d3.select("#bar").selectAll(".arc").remove();
    d3.select("#bar").selectAll(".text3").remove();
    d3.select("#bar").selectAll(".rect2").remove();
    d3.select("#bar").selectAll(".text4").remove();


    var name=[];
    var number=[];
    var percent=[];
    var total=0;
    for(var i=0;i<data.length;i++)
    {
      name.push(data[i].key);
      number.push(data[i].values.length);
      total=total+data[i].values.length;
      
    }
for(var i=0;i<data.length;i++)
    {
      percent.push(number[i]/total*100);}
   
     var g = d3.select("#bar").selectAll(".arc")
      .data(pie(number))
      .enter().append("g")
      .attr("class", "arc");
    g.append("path")
      .attr("d", donutarc)
      .style("fill", function(d) { return color_pie_donut(d.index); })
      .attr("transform", "translate(" + (1000) + "," + (200) + ")");
    g.append("text")
      .classed("class","text_data")
      .attr("transform", function(d) { var f=labelArc.centroid(d);
        return "translate(" + (f[0]+1000)+","+(f[1]+200) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.value; });
      

  for(i=0;i<number.length;i++)
  {
  g.append("rect")
  .attr("x", 1150)
  .attr("y",30+13*i)
  .attr("width", 11)
  .attr("height", 11)
  .classed("class","rect2")
  .style("fill", color_pie_donut(name[i]));

 g.append("text")
  .attr("x", 1175)
  .attr("y",32+13*i)
  .attr("dy", "0.25em")
  .style("font-size", "10px")
  .style("text-anchor", "start")
  .classed("class","text3")
  .text(name[i])

 g.append("text")
  .attr("x", 1252)
  .attr("y",32+13*i)
  .attr("dy", "0.25em")
  .style("font-size", "10px")
  .classed("class","text4")
  .text(percent[i].toFixed(1)+"%")

  g.append("text")
  .attr("x", 1270)
  .attr("y",32+13*i)
  .attr("dy", "0.25em")
  .classed("class","text4")
  .text(number[i])
  .attr("font-size", "10px")

 
}
 g.append("text")
  .attr("x", 920)
  .attr("y",15)
  .attr("dy", "0.25em")
  .style("font-size", "10px")
  .style("text-anchor", "start")
  .classed("class","text4")
  .text("Position Of Type In "+date)
    
    
    
  }

function Click(){
  month=document.getElementById("sel4").value;
  //type= document.getElementById("sel5").value;
  //gate=document.getElementById("sel6").value;
  d3.select("#bar").selectAll('g').remove();
  console.log(month);
  drawTraffic(data);
}
