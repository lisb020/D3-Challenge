// Chart Params
const svgWidth = 960;
const svgHeight = 500;

const margin = { top: 20, right: 40, bottom: 60, left: 50 };

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Pull in CSV data from data.csv
d3.csv("./assets/data/data.csv").then(function(censusData) {
    console.log(censusData);
    
    // cast data to number;
    censusData.forEach(function(data) {
        data.age = +data.age;
        data.poverty = +data.poverty;
    });
    // Create scaling functions
    const xAgeScale = d3.scaleLinear()
        .domain(d3.extent(censusData, d => d.age))
        .range([0, width]);
    
    const yLinearScale = d3.scaleLinear()
        .domain(d3.extent(censusData, d => d.poverty))
        .range([height, 0]);

    // Create axis function
    const bottomAxis = d3.axisBottom(xAgeScale);
    const leftAxis = d3.axisLeft(yLinearScale);

    // Add x-axis
    chartGroup.append("g")
        .attr("transform", `translate (0, ${height})`)
        .call(bottomAxis);
    
    // Add yaxis to the left side of the display
    chartGroup.append("g")
        .call(leftAxis);

    // Line generators for line
    // const marker = d3.circle()
    //     .cx(d => xAgeScale(d.age))
    //     .cy(d => yLinearScale(d.poverty));

    // Append a path for line1
    chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xAgeScale(d.age))
        .attr("cy", d => yLinearScale(d.poverty))
        .attr("r", "5")
        .classed("stateCircle", true);
    
    // Append axes titles
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
        .classed("aText", true)
        .text("Age");

}).catch(function(error){
    console.log(error);
});
