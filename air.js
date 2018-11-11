  
var margin = {top:10,bottom:10,left:10,right:10};
var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.left + margin.right).append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var width = 720,
      height = 720,
      start = 0,
      end = 2.35,
      numSpirals = 2
var radius = 500 / 2;

var color_pie = d3.scaleOrdinal()
    .range(["#ECDB84", "#EEC85D", "#EEA760", "#EA753C"]);

var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var labelArc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d; });

function drawair(Month){     

    var theta = function(r) {return numSpirals * Math.PI * r;};
    var color = d3.scaleOrdinal(d3.schemeCategory20);
    var r = d3.min([width, height]) / 2 - 30;
    var radius = d3.scaleLinear().domain([start, end]).range([30, r]);

    var points = d3.range(start, end + 0.001, (end - start) / 1000);

    var spiral = d3.radialLine()
      .curve(d3.curveCardinal).angle(theta)
      .radius(radius);

    var path = d3.select("#chart").append("path").datum(points)
      .attr("id", "spiral").attr("d", spiral)
      .style("fill", "none").style("stroke", "steelblue")
      .attr("transform", "translate(" + (360) + "," + ( 360) + ")");

    var someData = [];
    if(Month==4){
        var spiralLength = path.node().getTotalLength(),
        N = 270,
        barWidth = (spiralLength / N) - 1;
        
    d3.csv("chemical1.csv", function(d, i, columns) {
      for (i = 2, t = 0; i < 6; i++) 
      { t += d[columns[i]] = +d[columns[i]];
          d.total = t;}    
      d.month=d.Date.split(" ")[0].substring(0, 7);
      d.day=d.Date.split(" ")[0].split("/")[2];
      d.monitor=+d.monitor;
   
      var currentDate = new Date();
      currentDate.setDate(d.id);
      someData.push({
       datetime:d.Date,
        date: currentDate,
        value: d.total,
        monitor:d.Monitor,
        group: d.day,
        Methylosmolene:d.Methylosmolene,
        Chlorodinine:d.Chlorodinine,
        AGOC_3A:d["AGOC-3A"],
        Appluimonia:d.Appluimonia,
        day:d.day});
        
      return d;
    },function(error,data){

    var timeScale = d3.scaleTime()
      .domain(d3.extent(someData, function(d){
        return d.date;}))
      .range([0, spiralLength]);
    
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(someData, function(d){
        return d.value;})])
      .range([0, (r / numSpirals) - 30]);

    d3.select('#chart').selectAll("rect")
      .data(someData)
      .enter()
      .append("rect")
      .attr("x", function(d,i){
        
        var linePer = timeScale(d.date),
            posOnLine = path.node().getPointAtLength(linePer),
            angleOnLine = path.node().getPointAtLength(linePer - barWidth);     
        d.linePer = linePer;
        d.x = posOnLine.x+360; 
        d.y = posOnLine.y+360;     
        d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; 
        return d.x;})
      .attr("y", function(d){return d.y;})
      .attr("width", function(d){return barWidth;})
      .attr("height", function(d){return yScale(d.value);})
      .style("fill", function(d){return color(d.group);})
      .style("stroke", "none")
      .on("mouseover",function(d,i){ 
          d3.select(this).style('fill','yellow');
          drawpie(d.Methylosmolene,d.Chlorodinine,d.AGOC_3A,d.Appluimonia);})
      .on("mouseleave", function(d){ 
          d3.select(this).style('fill',function(d){return color(d.group);})})
      .attr("transform", function(d){
        return "rotate(" + d.a + "," + d.x  + "," + d.y + ")"; });

    d3.select("#chart").selectAll("text")
      .data(someData)
      .enter()
      .append("text")
      .attr("dy", 10)
      .style("text-anchor", "start")
      .style("font", "10px arial")
      .append("textPath")
      .text(function(d){
         if(d.monitor==7 && d.day==30)
         {
          return "Date";     
         }
         if(d.monitor == 1){
            return d.day;}    
      })
      .attr("xlink:href", "#spiral")
      .style("fill", "grey")
      .attr("startOffset", function(d){
        return ((d.linePer / spiralLength) * 100) + "%";})
    
    })
  }
    if(Month==8){
        var spiralLength = path.node().getTotalLength(),
        N = 279,
        barWidth = (spiralLength / N) - 1;
        
    d3.csv("chemical2.csv", function(d, i, columns) {
      for (i = 2, t = 0; i < 6; i++) 
      { t += d[columns[i]] = +d[columns[i]];
          d.total = t;}    
      d.month=d.Date.split(" ")[0].substring(0, 7);
      d.day=d.Date.split(" ")[0].split("/")[2];
      d.monitor=+d.monitor;
      var currentDate = new Date();
      currentDate.setDate(d.id);
      someData.push({
        datetime:d.Date,
        date: currentDate,
        value: d.total,
        monitor:d.Monitor,
        group: d.day,
        Methylosmolene:d.Methylosmolene,
        Chlorodinine:d.Chlorodinine,
        AGOC_3A:d["AGOC-3A"],
        Appluimonia:d.Appluimonia,
        day:d.day})       
      return d;
    },function(error,data){

    var timeScale = d3.scaleTime()
      .domain(d3.extent(someData, function(d){
        return d.date;}))
      .range([0, spiralLength]);
    
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(someData, function(d){
        return d.value;})])
      .range([0, (r / numSpirals) - 30]);

    d3.select('#chart').selectAll("rect")
      .data(someData)
      .enter()
      .append("rect")
      .attr("x", function(d,i){
        
        var linePer = timeScale(d.date),
            posOnLine = path.node().getPointAtLength(linePer),
            angleOnLine = path.node().getPointAtLength(linePer - barWidth);     
        d.linePer = linePer;
        d.x = posOnLine.x+360; 
        d.y = posOnLine.y+360;     
        d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; 
        return d.x;})
      .attr("y", function(d){return d.y;})
      .attr("width", function(d){return barWidth;})
      .attr("height", function(d){return yScale(d.value);})
      .style("fill", function(d){return color(d.group);})
      .style("stroke", "none")
      .attr("transform", function(d){return "rotate(" + d.a + "," + d.x  + "," + d.y + ")"; });

      d3.select("#chart").selectAll("text")
      .data(someData)
      .enter()
      .append("text")
      .attr("dy", 10)
      .style("text-anchor", "start")
      .style("font", "10px arial")
      .append("textPath")
      .text(function(d){
         if(d.monitor==7 && d.day==31){return "Date";}
         if(d.monitor == 1){return d.day;}})
      .attr("xlink:href", "#spiral")
      .style("fill", "grey")
      .on("mouseover",function(d,i){ 
          drawpie(d.Methylosmolene,d.Chlorodinine,d.AGOC_3A,d.Appluimonia);})
      .attr("startOffset", function(d){
        return ((d.linePer / spiralLength) * 100) + "%";})
    })}

    if(Month==12){
      var spiralLength = path.node().getTotalLength(),
        N = 279,
        barWidth = (spiralLength / N) - 1;
        
    d3.csv("chemical3.csv", function(d, i, columns) {
      for (i = 2, t = 0; i < 6; i++) 
      { t += d[columns[i]] = +d[columns[i]];
          d.total = t;}    
      d.month=d.Date.split(" ")[0].substring(0, 7);
      d.day=d.Date.split(" ")[0].split("/")[2];
      d.monitor=+d.monitor;
      var currentDate = new Date();
      currentDate.setDate(d.id);
      someData.push({
        datetime:d.Date,
        date: currentDate,
        value: d.total,
        monitor:d.Monitor,
        group: d.day,
        Methylosmolene:d.Methylosmolene,
        Chlorodinine:d.Chlorodinine,
        AGOC_3A:d["AGOC-3A"],
        Appluimonia:d.Appluimonia,
        day:d.day})
      return d;
    },function(error,data){

    var timeScale = d3.scaleTime()
      .domain(d3.extent(someData, function(d){
        return d.date;}))
      .range([0, spiralLength]);
    
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(someData, function(d){
        return d.value;})])
      .range([0, (r / numSpirals) - 30]);

    d3.select('#chart').selectAll("rect")
      .data(someData)
      .enter()
      .append("rect")
      .attr("x", function(d,i){
        
      var linePer = timeScale(d.date),
            posOnLine = path.node().getPointAtLength(linePer),
            angleOnLine = path.node().getPointAtLength(linePer - barWidth);     
        d.linePer = linePer;
        d.x = posOnLine.x+360; 
        d.y = posOnLine.y+360;     
        d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; return d.x;})
      .attr("y", function(d){return d.y;})
      .attr("width", function(d){return barWidth;})
      .attr("height", function(d){return yScale(d.value);})
      .style("fill", function(d){return color(d.group);})
      .style("stroke", "none")
      .attr("transform", function(d){
        return "rotate(" + d.a + "," + d.x  + "," + d.y + ")"; })
      .on("mouseover",function(d,i){ 
          drawpie(d.Methylosmolene,d.Chlorodinine,d.AGOC_3A,d.Appluimonia);})

    d3.select("#chart").selectAll("text")
      .data(someData).enter()
      .append("text")
      .attr("dy", 10)
      .style("text-anchor", "start")
      .style("font", "10px arial")
      .append("textPath")
      .text(function(d){
         if(d.monitor==7 && d.day==31){return "Date";}
         if(d.monitor == 1){return d.day;}})
      .attr("xlink:href", "#spiral")
      .style("fill", "grey")
      .attr("startOffset", function(d){
        return ((d.linePer / spiralLength) * 100) + "%";})
    })
    
  } 

  }
  function drawpie(a,b,c,d)
  {
    d3.select("#chart").selectAll(".arc").remove();
    d3.select("#chart").selectAll(".text1").remove();
    d3.select("#chart").selectAll(".rect1").remove();
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
      .attr("transform", "translate(" + (1000) + "," + ( 360) + ")");
    g.append("text")
      .classed("class","text_data")
      .attr("transform", function(d) { var f=labelArc.centroid(d);
        return "translate(" + (f[0]+1000)+","+(f[1]+360) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.toFixed(2); });
  for(i=0;i<4;i++)
  {
  g.append("rect")
  .attr("x", width+200)
  .attr("y",height-360-20*i)
  .attr("width", 19)
  .attr("height", 19)
  .classed("class","rect1")
  .style("fill", color_pie(data[i]));

  g.append("text")
  .attr("x", width+260)
  .attr("y",height-350-20*i)
  .attr("dy", "0.32em")
  .classed("class","text1")
  .text(name[i])
  g.append("text")
  .attr("x", width+320)
  .attr("y",height-350-20*i)
  .attr("dy", "0.32em")
  .classed("class","text1")
  .text(percent[i].toFixed(2)+"%")
}
   
  }
  

function CLICK()
{
  Month=document.getElementById("sel1").value;
  d3.select("#chart").selectAll('rect').remove();
  d3.select("#chart").selectAll(".arc").remove();
    d3.select("#chart").selectAll(".text1").remove();
    d3.select("#chart").selectAll(".rect1").remove();
  d3.select("#chart").selectAll('text').remove();

  drawair(Month);
}
   
    