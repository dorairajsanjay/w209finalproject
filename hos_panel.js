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
    var hos_bSpace= 2; //space between buttons
    var hos_x0= 20; //x offset
    var hos_y0= 20; //y offset
    var hos_borderWidth= 1; // border thickness
    var hos_borderColor = "#29ABE2";
    var hos_focusBorderColor = "#29ABE2";
    var hos_focusBorderWidth = 4;

    // filter elements from product set for HOS panel
    data = data.data.filter(function(d) {
        if (d.hos == 1) return d;
    })

    //groups for each button (which will hold a rect and text)
    var buttonGroups= hosProducts.selectAll("g.button")
                            .data(data)
                            .enter()
                            .append("g")
                            .attr("class","button")
                            .style("cursor","pointer")
                            .on("click",function(d,i) {
                                updateButtonColors(d3.select(this), d3.select(this.parentNode));

                                $("#chart1").empty();
                                // update left charts panel
                                var uc1=parallel_chart("#chart1");
                                filtered = find_and_rank_comparables(data, d.code, "sugars_100g");
                                uc1.update(filtered);       

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


