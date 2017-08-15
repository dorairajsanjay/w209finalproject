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

var side_padding = 15,
    vert_padding = 10,
    top_row_height = 100
    box_width = 240;



// Main method that can be called to draw the chart given some data
pic.update = function(data, criteria) {

    console.log(extract_one(data, "recommended"));

    selected = extract_one(data, "selected");
    recommended = extract_one(data, "recommended");

    // Add the headings

    nut_frame.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 18)
        .attr("text-anchor", "middle")
        .attr("fill", "#131516")  // very dark gray, but not black) "#131516"
        .attr("font-weight", "bold")
        .attr("x", side_padding + box_width/2)
        .attr("y", 50)
        .attr("dx", 0)
        .attr("dy", 10)
        .text(selected.product_name)
        .call(wrap_nut_facts, 200);

    nut_frame.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 18)
        .attr("text-anchor", "middle")
        .attr("fill", "#131516")  // very dark gray, but not black) "#131516"
        .attr("font-weight", "bold")
        .attr("x", width - box_width/2 - side_padding)
        .attr("y", 50)
        .attr("dx", 0)
        .attr("dy", 10)
        .text(recommended.product_name)
        .call(wrap_nut_facts, 200);

    nut_frame.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 18)
        .attr("text-anchor", "middle")
        .attr("fill", "#131516")  // very dark gray, but not black) "#131516"
        .attr("font-weight", "bold")
        .attr("x", side_padding + box_width/2)
        .attr("y", 30)
        .text("consider replacing...");

    nut_frame.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 18)
        .attr("text-anchor", "middle")
        .attr("fill", "#131516")  // very dark gray, but not black) "#131516"
        .attr("font-weight", "bold")
        .attr("x", width - box_width/2 - side_padding)
        .attr("y", 30)
        .text("...with...");


    // Draw the actual Nutrition Facts boxes

    draw_nf(nut_frame, side_padding, top_row_height + vert_padding, selected);
    draw_nf(nut_frame, width - side_padding - box_width, top_row_height + vert_padding, recommended);


    function draw_nf(svg, x, y, data){

        // Specify parameters for the text box

        var side_padding = 1,
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

        // Specify y position of the different fields and lines.  Also units and display conversion factors
        var text_specs = {"energy_svg": {y :110 , desc : "Calories", unit : "cal", main : 1, factor:0.239},
                          "fat_svg": {y :170, desc : "Total Fat", unit : "g", main : 1, factor:1},
                          "cholesterol_svg": {y :200, desc : "Cholesterol", unit : "mg", main : 1, factor:1000},
                          "carbohydrates_svg": {y :260, desc : "Total Carbohydrates", unit : "g", main : 1, factor:1},
                          "sugars_svg": {y :320, desc : "Sugars", unit : "g", main : 1, factor:1},
                          "proteins_svg": {y :350, desc : "Protein", unit : "g", main : 1, factor:1},
                          "sodium_svg": {y :230, desc : "Sodium", unit : "mg", main : 1, factor:1000},
                          "fiber_svg": {y :290, desc : "Dietary Fiber", unit : "g", main : 1, factor:1},
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

          // Highlight the criteria of main interest

          if (data["selected"] === 1) {
              highlight_color = "#efc42a"; // gold for selected
          } else {
              highlight_color = "#3399ff"; // blue for recommended
          };

          svg.append("rect")
              .attr("fill", highlight_color)  // very dark gray, but not black) "#131516"
              .attr("x", x + side_padding)
              .attr("y", y + text_specs[criteria].y - 25)
              .attr("width", box_width - 2* side_padding)
              .attr("height", 40);


        // Add the lines
          for (const key of Object.keys(line_specs)) {
              svg.append("line")
                  .attr("stroke", "#131516")  // very dark gray, but not black) "#131516"
                  .attr("x1", x+side_padding)
                  .attr("x2", x+ box_width - side_padding)
                  .attr("y1", y + line_specs[key].y)
                  .attr("y2", y + line_specs[key].y)
                  .attr("stroke-width", line_specs[key].main);
              };

        // Add the static text
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

        // Add the values for each attribute
        for (const key of Object.keys(text_specs)) {

            svg.append("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", 16)
                .attr("text-anchor", "start")
                .attr("fill", "#131516")  // very dark gray, but not black) "#131516"
                .attr("font-weight", "bold")
                .attr("x", x+side_padding)
                .attr("y", y + text_specs[key].y)
                .text(text_specs[key].desc + " " + (data[key]*text_specs[key].factor).toFixed(0) + " " + text_specs[key].unit);
            };

        var rda_specs = { "fat_svg": {y :170, rda: 65},
                          "cholesterol_svg": {y :200, rda: 300},
                          "carbohydrates_svg": {y :260, rda: 300},
                          "sodium_svg": {y :230, rda:2.4},
                          "fiber_svg": {y :290, rda:25},
                      };

        // Add RDA values for fields where those apply
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

    };

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

//Label wrap function from "Wrapping Long Labels" - Mike Bostock
function wrap_nut_facts(text, width) {
 text.each(function() {
   var text = d3.select(this),
     words = text.text().split(/\s+/).reverse(),
     word,
     line = [],
     lineNumber = 0,
     lineHeight = 17, //em
     y = text.attr("y"),
     x = text.attr("x"),
     dx = parseFloat(text.attr("dx")),
     dy = parseFloat(text.attr("dy")),
     tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dx", dx).attr("dy", dy);
   while (word = words.pop()) {
     line.push(word);
     tspan.text(line.join(" "));
     if (tspan.node().getComputedTextLength() > width) {
       line.pop();
       tspan.text(line.join(" "));
       line = [word];
       tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dx", dx).attr("dy", ++lineNumber * lineHeight + dy).text(word);
     }
   }
 })
};
