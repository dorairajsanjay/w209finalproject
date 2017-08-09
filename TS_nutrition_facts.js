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

        var side_padding = 4,
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
            .attr("fill", "none");

        // Header

        svg.append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", 33)
            .attr("text-anchor", "start")
            .attr("fill", "#131516")  // very dark gray, but not black) "#131516"
            .attr("font-weight", "bold")
            .attr("x", x+side_padding)
            .attr("y", y+vert_padding)
            .attr("dy", 20)
            .text("Nutrition Facts");

        // get the serving size in g
        serving = parseFloat(data.serving_size.substring(0, data.serving_size.indexOf("g")));
        console.log(serving);

        serv_factor = serving / 100


        var wanted = ["energy","fat", "cholesterol",
                      "carbohydrates", "sugars", "proteins", "sodium",
                      "fiber"];

        // Specify y position of the different fields


        var text_specs = {"energy_100g": {y :110 , desc : "Calories", unit : "cal", main : 1, factor:1},
                          "fat_100g": {y :170, desc : "Total Fat", unit : "g", main : 1, factor:1},
                          "cholesterol_100g": {y :200, desc : "Cholesterol", unit : "mg", main : 1, factor:1000},
                          "carbohydrates_100g": {y :260, desc : "Total Carbohydrates", unit : "g", main : 1, factor:1},
                          "sugars_100g": {y :320, desc : "Sugars", unit : "g", main : 1, factor:1},
                          "proteins_100g": {y :350, desc : "Protein", unit : "g", main : 1, factor:1},
                          "sodium_100g": {y :230, desc : "Sodium", unit : "mg", main : 1, factor:1000},
                          "fiber_100g": {y :290, desc : "Dietary Fiber", unit : "g", main : 1, factor:1},
                         };

         var line_specs = { 1: {y :60 , main : 7},
                            2: {y :90 , main : 0.5},
                            3: {y :120 , main : 4},
                            4: {y :150 , main : 0.5},
                            5: {y :180 , main : 0.5},
                            6: {y :210 , main : 0.5},
                            7: {y :240 , main : 0.5},
                            8: {y :270 , main : 0.5},
                            9: {y :300 , main : 0.5},
                            10: {y :330 , main : 0.5},
                            11: {y :365 , main : 7},
                          };

          for (const key of Object.keys(line_specs)) {
              console.log(key);
              svg.append("line")
                  .attr("stroke", "#131516")  // very dark gray, but not black) "#131516"
                  .attr("x1", x+side_padding)
                  .attr("x2", x+ box_width - side_padding)
                  .attr("y1", y + line_specs[key].y)
                  .attr("y2", y + line_specs[key].y)
                  .attr("stroke-width", line_specs[key].main);
              };


        console.log(text_specs["energy_100g"].desc);

        svg.append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .attr("text-anchor", "start")
            .attr("fill", "#131516")  // very dark gray, but not black) "#131516"
            .attr("x", x+side_padding)
            .attr("y", y + 48)
            .text("Serving size" + " " + data.serving_size);


        svg.append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .attr("text-anchor", "start")
            .attr("fill", "#131516")  // very dark gray, but not black) "#131516"
            .attr("x", x+side_padding)
            .attr("y", y + 80)
            .text("Amount per serving");

        svg.append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .attr("text-anchor", "end")
            .attr("fill", "#131516")  // very dark gray, but not black) "#131516"
            .attr("x", x + box_width - side_padding)
            .attr("y", y + 138)
            .attr("font-weight", "bold")
            .text("% Daily Value*");

        for (const key of Object.keys(text_specs)) {

            svg.append("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", 16)
                .attr("text-anchor", "start")
                .attr("fill", "#131516")  // very dark gray, but not black) "#131516"
                .attr("font-weight", "bold")
                .attr("x", x+side_padding)
                .attr("y", y + text_specs[key].y)
                .text(text_specs[key].desc + " " + (data[key]*serv_factor*text_specs[key].factor).toFixed(0) + " " + text_specs[key].unit);
            };

        var rda_specs = { "fat_100g": {y :170, rda: 65},
                          "cholesterol_100g": {y :200, rda: 300},
                          "carbohydrates_100g": {y :260, rda: 300},
                          "sodium_100g": {y :230, rda:2.4},
                          "fiber_100g": {y :290, rda:25},
                      };

        for (const key of Object.keys(rda_specs)) {

            svg.append("text")
             .attr("font-family", "sans-serif")
             .attr("font-size", 16)
             .attr("text-anchor", "end")
             .attr("fill", "#131516")  // very dark gray, but not black) "#131516"
             .attr("font-weight", "bold")
             .attr("x", x + box_width - side_padding)
             .attr("y", y + text_specs[key].y)
             .text((100 * data[key] / rda_specs[key].rda).toFixed(0) + "%");

         };




            //
            // svg.append("text")
            //     .attr("font-family", "sans-serif")
            //     .attr("font-size", 16)
            //     .attr("text-anchor", "end")
            //     .attr("fill", "#131516")  // very dark gray, but not black) "#131516"
            //     .attr("font-weight", "bold")
            //     .attr("x", x + box_width - side_padding)
            //     .attr("y", y + text_specs[key].y)
            //     .text((data[key]*serv_factor).toFixed(0) + "%");
            // };


    function extract_nf_fields(data){

        var wanted = ["serving_size", "energy_100g","fat_100g", "cholesterol_100g",
                      "carbohydrates_100g", "sugars_100g", "proteins_100g", "sodium_100g",
                      "fiber_100g"]

        serving = data.serving_size;
        console.log(serving);

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
