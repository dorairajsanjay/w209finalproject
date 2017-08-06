function parallel_chart(eleID) {

pic = {}; // create object for function to return

// initialize the parameters
// frame is for the overall frame including legend
// para is for the part of the chart with the parallel chart

var frame = d3.select(eleID),
    margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = +frame.attr("width") - margin.left - margin.right,
    height = +frame.attr("height") - margin.top - margin.bottom,
    para_w_proportion = .5,
    para_h_proportion = .8,
    para_width = width * para_w_proportion,
    para_height = height *para_h_proportion

//var x = d3.scale.ordinal().rangePoints([0, width], 1),
var x = d3.scalePoint().range([0, para_width]).padding(0.2)
    y = {};

var line = d3.line(),
    axis = d3.axisLeft(),
    background,
    foreground;

var svg = frame
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Main method that can be called to draw the chart given some data
pic.update = function(data) {

    var wanted = ["fat_100g", "sugars_100g", "proteins_100g", "sodium_100g",
                  "fiber_100g"]
    // var wanted = ["cylinders", "year", "economy (mpg)"]

    console.log(d3.keys(data[0]))

    // Extract the list of dimensions and create a scale for each.
    x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
      return wanted.includes(d) && (y[d] = d3.scaleLinear()
          .domain(d3.extent(data, function(p) { return +p[d]; }))
          .range([para_height, 0]));
    }));

    console.log(dimensions)

    // Using D3's built in pastel color scheme
    var color_value = d3.scaleOrdinal(d3.schemeCategory20);

    // Draw the colored lines for each product
    foreground = svg.append("g")
        .attr("class", "foreground")
      .selectAll("path")
        .data(data)
      .enter().append("path")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", function(d) {
                return color_value(d.number)})
        .attr("stroke-width", 6)
        .attr("stroke-linejoin", "round");


    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
      .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

    // Add an axis and title.
    g.append("g")
        .attr("class", "axis")
        .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
      .append("text")
        .style("text-anchor", "middle")
        .attr("y", -15)
        .text(function(d) { return d; })
        .attr("fill", "black")
        .attr("font-size", "11px")
        .attr("font-weight", "bold");

    // Add a legend

    var legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .attr("text-anchor", "start")
      .selectAll("g")
      .data(data)
      .enter().append("g")
        .attr("transform", function(d) { return "translate(0," + (10 + d.number * 25) + ")"; });

    // add text
    legend.append("text")
        .attr("x", width - 300)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d.product_name; });

    // add color

    legend.append("rect")
        .attr("x", width - 320)
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", function(d) {return color_value(d.number)});

    // Returns the path for a given data point.
    function path(d) {
      return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
            }

};

// Return the created object, ready to be called with the update method
return pic;

}

// Simple function to take the full data set and filter down to only
// the rows we want to compare between
// In the big production version this is where the call to the
// API could happen instead, for example.

function get_comparables(data, cat_filter) {
    var filtered = [];
    var eval_count = data.length;
    var comp_count = 0;
    for (var i = 1; i < eval_count; i++) {
        if (data[i].demo_cat === cat_filter) {
            comp_count += 1;
            data[i].number = comp_count;
            filtered.push(data[i]);
        };
    };
    console.log(filtered);
    return filtered;
};
