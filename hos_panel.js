/********************************
 * Create the Hall of Shame panel
 *********************************/
function drawHOS(svg)
{

    var hosProducts= svg.append("g")
                        .attr("id","hos-products")

    // hall of shame panel config
    var hos_lastButton = null;
    var hos_bWidth= 80; //button width
    var hos_bHeight=80; //button height
    var hos_bSpace= 3; //space between buttons
    var hos_x0= 20; //x offset
    var hos_y0= 20; //y offset
    var hos_borderWidth= 4; // border thickness
    var hos_borderColor = "#999999";
    var hos_focusBorderColor = "#3399ff";
    var hos_focusBorderWidth = 10;

    // filter elements from product set for HOS panel
    var hosData = data.data.filter(function(d) {
        if (d.hos == 1) return d;
    })

    // identify FULL data list for passing to find_and_rank_comparables
    var fullData = data.data

    //groups for each button (which will hold a rect and text)
    var buttonGroups= hosProducts.selectAll("g.button")
                            .data(hosData)
                            .enter()
                            .append("g")
                            .attr("class","button")
                            .style("cursor","pointer")
                            .on("click",function(d,i) {
                                updateButtonColors(d3.select(this), d3.select(this.parentNode));

                            // initialize left charts panel
                            filtered = find_and_rank_comparables(fullData, d.code, getMeasure(bfc_context.selected_submenu_button.id));

                            // update search text with value
                            document.getElementById('search-text').value = d.product_name;

                            // invoke the corresponding chart
                            if (bfc_context.selected_topmenu_button.id == "av-parallel")
                            {
                                $("#chart1").empty();
                                $("#nutfacts_panel").empty();

                                var uc1=parallel_chart("#chart1");
                                var uc2=nutrition_facts("#nutfacts_panel")

                                uc1.update(filtered);
                                uc2.update(filtered, getMeasure(bfc_context.selected_submenu_button.id));
                            }
                            else if (bfc_context.selected_topmenu_button.id == "sv")
                            {
                                $("#chart1").empty();
                                $("#nutfacts_panel").empty();

                                var uc2=nutrition_facts("#nutfacts_panel")
                                var uc1=bar_chart("#chart1");
                                // var uc1=bar_chart("#chart1", getMeasure(bfc_context.selected_submenu_button.id));
                                console.log(filtered);
                                console.log(getMeasure(bfc_context.selected_submenu_button.id));

                                uc1.update(filtered, getMeasure(bfc_context.selected_submenu_button.id));
                                uc2.update(filtered, getMeasure(bfc_context.selected_submenu_button.id));

                            }
                            else{
                                alert("In advanced polygon chart - sorry, this is not yet implemented.");
                            }

                        });

    //adding a rect to each button group
    //rx and ry give the rect rounded corner
    buttonGroups.append("rect")
                .attr("class","buttonRect")
                .attr("width",hos_bWidth)
                .attr("height",hos_bHeight)
                .attr("x",function(d,i) {return hos_x0+(hos_bWidth+hos_bSpace)*i;})
                .attr("y",hos_y0)
                .attr("border",hos_borderWidth)
                .style("stroke", hos_borderColor)
                .style("fill", "none")
                .style("stroke-width", hos_borderWidth);

    //adding image to each toggle button group
    buttonGroups.append("svg:image")
        .attr("class","buttonImage")
        .attr("x",function(d,i) {return hos_x0+(hos_bWidth+hos_bSpace)*i;})
        .attr("y",hos_y0)
        .attr("xlink:href", function(d) {return d.image_url;})
        .attr("dominant-baseline","central")
        .attr("fill","white")
        .attr("width", hos_bWidth)
        .attr("height", hos_bHeight);

    function updateButtonColors(button, parent) {
        if  (hos_lastButton == null){
            hos_lastButton = button;
        }
        else{
            hos_lastButton.select("rect")
                .style("stroke",hos_borderColor)
                .style("stroke-width", hos_borderWidth);
        }

        button.select("rect")
                .style("stroke",hos_focusBorderColor)
                .style("stroke-width", hos_focusBorderWidth);

        // save the last button
        hos_lastButton = button;
    }
}
