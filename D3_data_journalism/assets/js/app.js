// Chart Params
const svgWidth = 960;
const svgHeight = 500;

const margin = { top: 20, right: 40, bottom: 100, left: 150 };

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;
const circleRad = 15;
// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
let chosenXAxis = "poverty";
let chosenYAxis = "obesity";

  // function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
    // create x scales
    let xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis])*0.9,
            d3.max(censusData, d => d[chosenXAxis])*1.1])
        .range([0, width]);
    return xLinearScale;
  }

  // function used for updating y-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
    // create y scales
    let yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis])*0.8,
        d3.max(censusData, d => d[chosenYAxis])*1.2])
        .range([height, 0]);
    return yLinearScale;
  }
  // function used for updating xAxis upon click on axis label
  function renderXAxes(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
   // function used for updating yAxis upon click on axis label
   function renderYAxes(newYScale, yAxis) {
    let leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }
  
  // function used for updating circles group with a transition to
  // new circles
  function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
  }

  function renderCircleText(circleText, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circleText.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]) + circleRad/2);

    return circleText;
  }

// Pull in CSV data from data.csv
d3.csv("./assets/data/data.csv").then(function(censusData, err) {
    //console.log(censusData);
    if (err) throw err;
    // cast data to number;
    censusData.forEach(function(data) {
        data.age = +data.age;
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
        data.income = +data.income;
    });
    // Create scaling functions
    let xLinearScale = xScale(censusData, chosenXAxis);
    let yLinearScale = yScale(censusData, chosenYAxis);

    // Create axis function
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // Add x-axis
    let xAxis = chartGroup.append("g")
        .attr("transform", `translate (0, ${height})`)
        .classed("text1", true)
        .call(bottomAxis);
    
    // Add yaxis to the left side of the display
    let yAxis = chartGroup.append("g")
        .classed("text1", true)
        .call(leftAxis);

    // Append a initial circles
    
    let circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", circleRad)
        .classed("stateCircle", true);
    
    //Append text to circles
    let circleText = chartGroup.selectAll(".stateText")
        .data(censusData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]) + circleRad/2)
        .attr("value", d => d.abbr)
        .text(d => d.abbr)
        .classed("stateText", true);
    
    // Create group for x-axis labels
    let labelsXGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    
    // Create group for y-axis labels
    let labelsYGroup = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left + 90}, ${(height / 2)})`)
        .attr("y", 0 - (height / 2))
        .attr("dy", "-5em")

    // Append x axes titles
    povertyLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("xAxis aText active", true)
        .text("In Poverty (%)");
    ageLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("xAxis aText inactive", true)
        .text("Age (Median)");
    incomeLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .classed("xAxis aText inactive", true)
        .text("Household Income (Median)");
    
    // Append y axes titles
    healthcareLabel = labelsYGroup.append("text")
        .attr("transform", `rotate(-90)`)
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "healthcare")
        .classed("yAxis aText active", true)
        .text("Lacks Healthcare (%)");
    smokesLabel = labelsYGroup.append("text")
        .attr("transform", `rotate(-90)`)
        .attr("value", "smokes")
        .classed("yAxis aText inactive", true)
        .text("Smokes (%)");
    obesityLabel = labelsYGroup.append("text")
        .attr("transform", `rotate(-90)`)
        .attr("x", 0)
        .attr("y", -20)
        .attr("value", "obesity")
        .classed("yAxis aText inactive", true)
        .text("Obese (%)");

// x axis labels event listener
labelsXGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {
      // replaces chosenXAxis with value
      chosenXAxis = value;
      console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = xScale(censusData, chosenXAxis);

      // updates x axis with transition
      xAxis = renderXAxes(xLinearScale, xAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
      circleText = renderCircleText(circleText, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

      // changes classes to change bold text
      if (chosenXAxis === "age") {
        povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        ageLabel
            .classed("active", true)
            .classed("inactive", false);
        incomeLabel
            .classed("active", false)
            .classed("inactive", true);
      }
      else if (chosenXAxis === "income") {
        povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        ageLabel
            .classed("active", false)
            .classed("inactive", true);
        incomeLabel
            .classed("active", true)
            .classed("inactive", false);
      }
      else {
        povertyLabel
            .classed("active", true)
            .classed("inactive", false);
        ageLabel
            .classed("active", false)
            .classed("inactive", true);
        incomeLabel
            .classed("active", false)
            .classed("inactive", true);
      }
    }
  });

// y axis labels event listener
labelsYGroup.selectAll("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== chosenYAxis) {
    // replaces chosenXAxis with value
    chosenYAxis = value;
    console.log(chosenYAxis)

    // functions here found above csv import
    // updates x scale for new data
    yLinearScale = yScale(censusData, chosenYAxis);

    // updates x axis with transition
    yAxis = renderYAxes(yLinearScale, yAxis);

    // updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
    circleText = renderCircleText(circleText, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

    // changes classes to change bold text
    if (chosenYAxis === "smokes") {
      healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      smokesLabel
          .classed("active", true)
          .classed("inactive", false);
      obesityLabel
          .classed("active", false)
          .classed("inactive", true);
    }
    else if (chosenYAxis === "obesity") {
      healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      smokesLabel
          .classed("active", false)
          .classed("inactive", true);
      obesityLabel
          .classed("active", true)
          .classed("inactive", false);
    }
    else {
      healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
      smokesLabel
          .classed("active", false)
          .classed("inactive", true);
      obesityLabel
          .classed("active", false)
          .classed("inactive", true);
    }
  }
});
}).catch(function(error){
    console.log(error);
});
