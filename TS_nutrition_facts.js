/////
//
// Main chart function
//
/////

function nutrition_facts(eleID) {

pic = {}; // create object for function to return

// initialize the parameters
// frame is for the overall frame including legend

var nut_frame = d3.select(eleID),
    width = +nut_frame.attr("width"),
    height = +nut_frame.attr("height");

// Now initialize the parameters for where the labels will be drawn

var side_padding = 10,
    box_width = 240,
    box_height = 380,
    indent = 3,
    margin = {top: 75, right: 10, bottom: 10, left: 10},
    line_width = {thick: 4, regular:1};


// Main method that can be called to draw the chart given some data
pic.update = function(data) {

    // var wanted = ["fat_100g", "sugars_100g", "proteins_100g", "sodium_100g",
    //               "fiber_100g"]

    console.log("I am at the start of updating nutrition facts")
    nut_frame.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .attr("text-anchor", "start")
        .attr("fill", "#131516")  // very dark gray, but not black) "#131516"
        .attr("font-weight", "bold")
        .attr("x", 50)
        .attr("y", 50)
        .text("Nutrition Facts")

    // // Add a legend
    // var legend = svg.append("g")
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", 12)
    //     .attr("text-anchor", "start")
    //     .attr("fill", "#131516")  // very dark gray, but not black) "#131516"
    //     .attr("font-weight", "bold")
    //   .selectAll("g")
    //   .data(data)
    //   .enter().append("g")
    //     .attr("transform", function(d) {
    //          return "translate(" + para_width +"," + (margin.top + d.number * legend_step) + ")"; });
    //
    // // add text
    // legend.append("text")
    //     .attr("dx", legend_text.dx)
    //     .attr("dy", legend_text.dy)
    //     .text(function(d) { return d.product_name; })
    //     .call(wrap_parallels, legend_text_width);
    //
    // // add colored squares
    // legend.append("rect")
    //     .attr("width", function(d) {
    //         if (d.selected ===1 || d.recommended ===1){
    //             return legend_rect.big;
    //         } else {
    //             return legend_rect.small;
    //         };
    //     })
    //     .attr("height", function(d) {
    //         if (d.selected ===1 || d.recommended ===1){
    //             return legend_rect.big;
    //         } else {
    //             return legend_rect.small;
    //         };
    //     })
    //     .attr("fill", function(d) {return get_parallel_color(d)});

};

// Return the created object, ready to be called with the update method
return pic;

};
