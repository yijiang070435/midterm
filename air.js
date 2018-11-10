  
function drawair(Month){
  var width = 720,
      height = 720,
      start = 0,
      end = 2.35,
      numSpirals = 2
      margin = {top:10,bottom:10,left:10,right:10};

    var theta = function(r) {return numSpirals * Math.PI * r;};
    var color = d3.scaleOrdinal(d3.schemeCategory20);
    var r = d3.min([width, height]) / 2 - 30;
    var radius = d3.scaleLinear().domain([start, end]).range([30, r]);

    var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.left + margin.right).append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var points = d3.range(start, end + 0.001, (end - start) / 1000);

    var spiral = d3.radialLine()
      .curve(d3.curveCardinal).angle(theta)
      .radius(radius);

    var path = svg.append("path").datum(points)
      .attr("id", "spiral").attr("d", spiral)
      .style("fill", "none").style("stroke", "steelblue");

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
        day:d.day
      });
        
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
    d3.select("#chart").selectAll("text")
      .attr("transform", "translate(" + (360) + "," + ( 360) + ")")
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
      .attr("startOffset", function(d){
        return ((d.linePer / spiralLength) * 100) + "%";})
    d3.select("#chart").selectAll("text")
      .attr("transform", "translate(" + (360) + "," + ( 360) + ")")})}

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
        return "rotate(" + d.a + "," + d.x  + "," + d.y + ")"; });

    var tF = d3.timeFormat("%b %Y"),firstInMonth = {};

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
    d3.select("#chart").selectAll("text")
      .attr("transform", "translate(" + (360) + "," + ( 360) + ")")})}     
  }

function CLICK()
{
  Month=document.getElementById("sel1").value;
  d3.select("#chart").selectAll('rect').remove();
  d3.select("#chart").selectAll('text').remove();

  drawair(Month);
}
   
    