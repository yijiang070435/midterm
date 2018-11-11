var svg = d3.select("#bar"),
margin = {top: 20, right: 40, bottom: 30, left: 30},
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom;
var tooltip = d3.select("body").append("div").attr("class", "toolTip");

var x = d3.scaleBand().range([0, width-15]).padding(0.2).round(true);
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
    

    x.domain(days.map(function(d) { return month.substring(5,7)+"-"+d; }));
    

    var stackGenerator=d3.stack().keys(keys).value((d, key)=>{
      
      
      var i = d.values.length;
      while (i--) 
        if (d.values[i].key == key)  
          {d.type=d.values[i].key;break;}
      

      
      return i!=-1?  d.values[i].values.length : 0;}) (nested);
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
.text("Car Number");

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
    .data(function(d) {return d; })
    .enter().append("rect")
    .attr("x", function(d) { return x(d.data.key.substring(5, 10)); })
    .attr("y", function(d) { return y(d[1]); })
    .attr("height", function(d) { return y(d[0]) - y(d[1]); })
    .attr("width", x.bandwidth()-2)
    .on("mouseover",function(d,i){
      var type=d.data.key.substring(11,13);
      console.log(d.data.values[0].values);
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
function drawpie(data)
  {
    d3.select("#chart").selectAll(".arc").remove();
    d3.select("#chart").selectAll(".text1").remove();
    d3.select("#chart").selectAll(".rect1").remove();
    d3.select("#chart").selectAll(".text2").remove();

    var name=["Methylosmolene","Chlorodinine","AGOC-3A","Appluimonia"];
    var data = [a,b,c,d];
    var total_number=a+b+c+d;
    var percent=[a/total_number*100,b/total_number*100,c/total_number*100,d/total_number*100];
    var g = d3.select("#chart").selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

    g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color_pie(d.data); })
      .attr("transform", "translate(" + (600) + "," + (216) + ")");
    g.append("text")
      .classed("class","text_data")
      .attr("transform", function(d) { var f=labelArc.centroid(d);
        return "translate(" + (f[0]+600)+","+(f[1]+216) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.toFixed(2); });
  for(i=0;i<4;i++)
  {
  d3.select("#chart").append("rect")
  .attr("x", width-110)
  .attr("y",height-160-13*i)
  .attr("width", 11)
  .attr("height", 11)
  .classed("class","rect1")
  .style("fill", color_pie(data[i]));

g.append("text")
  .attr("x", width-90)
  .attr("y",height-155-12*i)
  .attr("dy", "0.35em")
  .style("text-anchor", "start")
  .classed("class","text2")
  .text(name[i])

 g.append("text")
  .attr("x", width+530)
  .attr("y",height-155-12*i)
  .attr("dy", "0.35em")
  .classed("class","text1")
  .text(percent[i].toFixed(2)+"%")
}
   
  }

function Click(){
  month=document.getElementById("sel4").value;
  //type= document.getElementById("sel5").value;
  //gate=document.getElementById("sel6").value;
  d3.select("#bar").selectAll('g').remove();
  console.log(month);
  drawTraffic(data);
}
