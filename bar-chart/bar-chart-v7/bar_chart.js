/////
//
// Bar chart function
//
/////

function bar_chart(eleID, measure) {

pic = {}; // create object for function to return

// initialize the parameters

var frame = d3.select(eleID),
    margin = {
        top: 20,
        right: 50,
        bottom: 30,
        left: 150},	
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    maxBarWidth= height - margin.left,
	maxChartHeight=height - (margin.top + margin.bottom)
	maxBarWidth= width - margin.right;

var leftMargin = margin.left;


//Should change on button click
var measure = measure;
	
//Creates rounding for tooltips
var formatter = d3.format("d");

//Create linear scale for data within chart area
var xScale = d3.scaleLinear()
            .range([0, maxBarWidth]);


//Create ordinal scale for x variables
var yScale = d3.scaleBand()
			.domain([0, maxChartHeight]);
	  
var x = d3.scaleLinear()
        .range([0, maxBarWidth]);

var y = d3.scaleBand()
        .range([height, 0]);

var xAxis = d3.axisBottom(x)
        .ticks(0);

var yAxis = d3.axisLeft(y);

var svg = frame
		.append("g")
		  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		  
// Main method that can be called to draw the bar chart
pic.update = function(data, measure) {
	
	//Sort the measure
    data.sort(function(a, b) {
        return a[measure] - b[measure];
      });
	 
	// Extract the measure and create a scale.
    x.domain([-0.25, d3.max(data, function(d) { return d[measure]; })]);
	
	//Extract product names
	y.domain(data.map(function(d) { return d.product_name; }))
        .paddingInner(0.1);
		
		
	//Create the rectangles
	var rects = svg.selectAll(".bar")
			.data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", 0)
          .attr("height", y.bandwidth())
          .attr("y", function(d) {return y(d.product_name); })
          .attr("width", function(d) {return x(d[measure]); })
		   // add this attribute to change the color of the rect
		  .attr("fill", function(d) {
			if (d.recommended == 1) {
			return "yellow";
			} 
			else if (d.selected == 1) {
			return "red";
			} 
			return "#29ABE2";
			})
	      .on("mouseover", function() {
           		 d3.select(this)
            		.attr("fill", "orange");
      			  })
          .on("mouseout", function(d, i) {
          		  d3.select(this).attr("fill", function() {
           	     return "" + color(this.id) + "";
		  })});

	//Append x axis
    svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + -2 + ")")
		  .style("stroke-width", 0)
          .call(xAxis);
	
	//Append y axis
    svg.append("g")
          .attr("class", "y axis")
		  //.attr("dy", "0.35em")
		  .style("font-size", "12px")
          .call(yAxis)
			  .selectAll(".tick text")
					.attr("stroke", "none")
					.attr("fill", "black")
					.call(wrap, leftMargin);

        //Set attributes of SVG rects based
        var rectAttributes = rects
                              .on("mouseover", function(d, i) {								  
                                //Show data value on mouse
                                var xPosition = (parseFloat(d3.select(this).attr("width"))+6);
                                var yPosition = parseFloat(d3.select(this).attr("y")) + (parseFloat(d3.select(this).attr("height")) / 2);
                                svg.append("text")
                                      .attr("id", "tooltip")
                                      .attr("x", xPosition)
                                      .attr("y", yPosition)
                                      .attr("dy", "0.35em")
                                      .attr("text-anchor", "start")
                                      .attr("font-family", "sans-serif")
                                      .attr("font-size", "12px")
                                      .attr("font-weight", "bold")
                                      .attr("fill", "black")
                                      .text(formatter(d[measure]));
                              })                              
                              //Transition on mouseout
                              .on("mouseout", function(d) {
                                d3.select(this)
									d3.select("#tooltip").remove();
                              });	
							  						  
};

// Return the created object, ready to be called with the update method
return pic;

}


/////////
//
// Other functions
//
/////////


//Converts strings to numeric type
function type(d) {
     d.measure = +d.measure;
     return d;
    }	

//Label wrap function from "Wrapping Long Labels" - Mike Bostock
 function wrap(text, width) {
        text.each(function() {
          var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, //em
            y = text.attr("y"),
			x = text.attr("x"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			console.log(words);
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            } 
          }
        })
      }


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

    // now go through and select all the objects that match the category \
	//and have a value greater than zero 
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
    return filtered;
};
