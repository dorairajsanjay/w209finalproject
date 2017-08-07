/////
//
// Main chart function
//
/////

function parallel_chart(eleID) {

pic = {}; // create object for function to return

// initialize the parameters
// frame is for the overall frame including legend
// para is for the part of the chart with the parallel chart

var frame = d3.select(eleID),
    margin = {top: 75, right: 10, bottom: 75, left: 10},
    width = +frame.attr("width"),
    height = +frame.attr("height"),
    para_w_proportion = .5, // proportion of frame for parallels
    para_width = width * para_w_proportion,
    para_height = height  - margin.bottom

var x = d3.scalePoint().range([margin.left, para_width]).padding(0.25),
    y = {}


var line = d3.line(),
    axis = d3.axisLeft(),
    background,
    foreground;

var svg = frame;
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  // .append("g")
  //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Main method that can be called to draw the chart given some data
pic.update = function(data) {

    var wanted = ["fat_100g", "sugars_100g", "proteins_100g", "sodium_100g",
                  "fiber_100g"]

    // Extract the list of dimensions and create a scale for each.
    x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
      return wanted.includes(d) && (y[d] = d3.scaleLinear()
          .domain(d3.extent(data, function(p) { return +p[d]; }))
          .range([para_height, margin.top]));
    }));

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
        .style("text-anchor", "start")
        .text(function(d) { return d.substring(0, d.indexOf("_"));})
        .attr("dy", -10)
        .attr("stroke", "none")
        .attr("fill", "#131516")  // very dark gray, but not black
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("transform", "translate(0,"+margin.top+") rotate(-45)");

    // Draw the colored lines for each product
    foreground = svg.append("g")
        .attr("class", "foreground")
      .selectAll("path")
        .data(order_for_plot(data))
      .enter().append("path")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", function(d) {
                return get_parallel_color(d)})
        .attr("stroke-width", function(d) {
            if (d.selected === 1) {
                return 6;
            } else if (d.recommended === 1) {
                return 6;
            } else {
                return 3;
            };
        })
        .attr("stroke-linejoin", "round")
        .attr("opacity", function(d) {
            if (d.selected === 1) {
                return 1;
            } else if (d.recommended === 1) {
                return 1;
            } else {
                return 0.9;
            };
        });

    legend_step = (height - margin.top - margin.bottom) / data.length

    // Add a legend
    var legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .attr("text-anchor", "start")
      .selectAll("g")
      .data(data)
      .enter().append("g")
        .attr("transform", function(d) {
             return "translate(" + para_width +"," + (margin.top + d.number * legend_step) + ")"; });

    // add text
    legend.append("text")
        .attr("dy", "10")
        .attr("dx", "25")
        .attr("fill", "#131516")  // very dark gray, but not black)
        .text(function(d) { return d.product_name; });

    // add colored squares
    legend.append("rect")
        .attr("width", function(d) {
            if (d.selected ===1 || d.recommended ===1){
                return 18;
            } else {
                return 12;
            };
        })
        .attr("height", function(d) {
            if (d.selected ===1 || d.recommended ===1){
                return 18;
            } else {
                return 12;
            };
        })
        .attr("fill", function(d) {return get_parallel_color(d)});

    // Returns the path for a given data point.
    function path(d) {
      return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
            }

};

// Return the created object, ready to be called with the update method
return pic;

}


/////////
//
// Other functions
//
/////////


// Simple function to pick a nice color for the line
// Basing off muted colors in Cat20b and Cat20c, but custom picked
// Returns a brighter color if the item is selected or recommended

function get_parallel_color(d) {
    if (d.selected === 1) {
        return "#d62728";
    } else if (d.recommended === 1) {
        return "#1f77b4";
    } else {
        muteds = ["#9c9ede","#cedb9c","#e7cb94","#e7969c","#de9ed6",
                  "#c6dbef","#fdd0a2","#c7e9c0","#dadaeb","#d9d9d9",
                  "#b5cf6b","#e7cb94"]
        return muteds[d.number];
    };
};

// Function to order the data for plotting the lines, so that the most
// important lines for the selected and recommended products are drawing
// last and therefore will paint over the others
function order_for_plot(data) {
    var ordered = [],
    selected,
    recommended;
    for (i = 0; i <data.length; i++){
        if (data[i].selected === 1) {
            selected = data[i];
        } else if (data[i].recommended === 1) {
            recommended = data[i];
        } else {
            ordered.push(data[i])
        };
    };
    ordered.push(recommended);
    ordered.push(selected);
    return ordered;
};

// Function to take the full data set and filter down to only
// the rows we want to compare between.

// In the big production version this is where the call to the
// API could happen instead, for example.

// Takes a reference to the data, a specific product id and a ranking criteria.
// Finds all products in the data that have a matching demo_cat attribute to
// to selected productid.
// Returns a filtered array of objects, with 'selected' and 'recommended'
// attributes appended to the objects.  Recommended is based on sorting by the
// specified criteria.  Also appends a 'number' attribute to the objects
// representing their position in the sort order, starting from 1,
//  (to make color indexing a bit easier in the drawing functions).

function find_and_rank_comparables(data, productid, criteria) {

    // scan through data to find what the category is the for selected productid
    var eval_count = data.length;
    var cat_filter;
    for (var i = 0; i < eval_count; i++) {
        if (data[i].code == productid) {cat_filter = data[i].demo_cat;};
        };

    // now go through and select all the objects that match the category
    // also adding an attribute to mark which is the selected one
    var filtered = [];
    var comp_count = 0;
    for (var i = 0; i < eval_count; i++) {
        if (data[i].demo_cat == cat_filter) {
            comp_count += 1;
            if (data[i].code == productid) {
                data[i].selected = 1;}
            else {
                data[i].selected = 0;
            }
            filtered.push(data[i]);
        };
    };

    // Now sort the objects based on the specified criteria
    filtered.sort(function(a, b) { return parseFloat(a[criteria]) -
                                          parseFloat(b[criteria])} );

    // Now flag which one is the recommended, based on the sort

    for (var i = 0; i < comp_count; i++) {
        filtered[i].number = i;
        if (i === 0) {
            filtered[i].recommended = 1;}
        else {
            filtered[i].recommended = 0;}
        };
    console.log("after adding all tags")
    console.log(filtered);
    return filtered;
};
