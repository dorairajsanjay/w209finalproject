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

var side_padding = 30,
    vert_padding = 10
    top_row_height = 100;

// Main method that can be called to draw the chart given some data
pic.update = function(data) {

    // var wanted = ["fat_100g", "sugars_100g", "proteins_100g", "sodium_100g",
    //               "fiber_100g"]

    console.log("I am at the start of updating nutrition facts");

    console.log("extracting");
    console.log(extract_one(data, "recommended"));

    draw_nf(nut_frame, side_padding, top_row_height + vert_padding,
            extract_one(data, "selected"));
    draw_nf(nut_frame, width/2 + side_padding, top_row_height + vert_padding,
            extract_one(data, "recommended"));


    function draw_nf(svg, x, y, data){

        // Specify parameters for the text box

        var side_padding = 10,
            vert_padding = 10,
            box_width = 240,
            box_height = 380,
            indent = 3,
            margin = {top: 75, right: 10, bottom: 10, left: 10},
            line_width = {thick: 4, regular:1};

        // Box outline

        svg.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", box_width)
            .attr("height", box_height)
            .attr("stroke-width", 1)
            .attr("stroke", "#131516")
            .attr("fill", "none")

        // Header

        svg.append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", 33)
            .attr("text-anchor", "start")
            .attr("fill", "#131516")  // very dark gray, but not black) "#131516"
            .attr("font-weight", "bold")
            .attr("x", x+indent)
            .attr("y", y+30)
            .text("Nutrition Facts")




    function extract_nf_fields(data){

        var wanted = ["serving_size", "energy_100g","fat_100g", "cholesterol_100g",
                      "carbohydrates_100g", "sugars_100g", "proteins_100g", "sodium_100g",
                      "fiber_100g"]

    };


    };



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

/////
//
// Utility functions
//
/////

function extract_one(data, which){
    // just pull out one object based on criteria
    // can pass either a string for recommended or selected
    // or just an index number
    var eval_count = data.length;
    var picked;

    for (var i = 0; i < eval_count; i++) {
        if (which === "selected") {
            if (data[i].selected === 1) {picked = data[i]};}
        else if (which === "recommended") {
            if (data[i].recommended === 1) {picked = data[i]};}
        else {
            if (i === which) {picked = data[i]};}
        };

    return picked;
};
