/*********************************
*    initialization
***********************************/

function getMeasure(id)
{
    var viewOption = "None";

    // look to see which one changed
    if (id == "fat")
        viewOption = "fat_svg";
    else if (id == "sugars")
        viewOption = "sugars_svg";
    else if (id == "proteins")
        viewOption = "proteins_svg";
    else if (id == "sodium")
        viewOption = "sodium_svg";
    else if (id == "fiber")
        viewOption = "fiber_svg";

    return viewOption;
}

function initOptionButtons(){
    //selected_main_button :null,
    //selected_sv_button :null,
    //selected_av_button :null

    // is this our first time?
    bfc_context.selected_topmenu_button = document.getElementById("sv");
    bfc_context.selected_topmenu_button.classList.remove("inactive");
    bfc_context.selected_topmenu_button.classList.add("active");

    bfc_context.selected_submenu_button = document.getElementById("fat");
    bfc_context.selected_submenu_button.classList.remove("inactive");
    bfc_context.selected_submenu_button.classList.add("active");

}

/*********************************
*    process options
***********************************/

function optionButtonSelected(id){
    //selected_main_button :null,
    //selected_sv_button :null,
    //selected_av_button :null

    // is this our first time?
    // possible ids - sv,av-parallel,av-polygon,fat,calories,sodium,sugars,cholesterol
    temp_selected = document.getElementById(id);

    // nothing to do if the same options were selected
    if (id == bfc_context.selected_topmenu_button.id || id == bfc_context.selected_submenu_button.id)
        return;

    // a different option was selected - was it a top level or the second level button?
    if ( id == "sv" || id =="av-parallel" || id == "av-polygon")
    {
        // deactivate the previous top-level button
        bfc_context.selected_topmenu_button.classList.remove("active");
        bfc_context.selected_topmenu_button.classList.add("inactive");

        // activate the new top-level button
        temp_selected.classList.add("active");

        bfc_context.selected_topmenu_button = temp_selected;

    }
    else {
            // a second level button was selected
            bfc_context.selected_submenu_button.classList.remove("active");
            bfc_context.selected_submenu_button.classList.add("inactive");
            temp_selected.classList.add("active");
            bfc_context.selected_submenu_button = temp_selected;
    }

    // determine the measure
    if (bfc_context.selected_topmenu_button.id ==  "sv" || bfc_context.selected_topmenu_button.id == "av-parallel" )
    {
        measure = getMeasure(bfc_context.selected_submenu_button.id);
    }


    // invoke the corresponding chart
    if (bfc_context.selected_topmenu_button.id == "av-parallel")
    {
        $("#chart1").empty();
        $("#nutfacts_panel").empty();

        $('#measure-buttons').show();
        //$('measure-buttons').Attributes.Add("style", "visibility:visible");

        var uc1=parallel_chart("#chart1");
        var uc2=nutrition_facts("#nutfacts_panel")

        filterText = d3.select('#search-text').property('value');
        productCode = onFilter(filterText,false);
        filtered = find_and_rank_comparables(data.data, productCode,measure);

        uc1.update(filtered);
        uc2.update(filtered, measure)
    }
    else if (bfc_context.selected_topmenu_button.id == "sv")
    {
        $("#chart1").empty();
        $("#nutfacts_panel").empty();

        $('#measure-buttons').show();
        //$('measure-buttons').Attributes.Add("style", "visibility:visible");

        var uc2=nutrition_facts("#nutfacts_panel")
        var uc1=bar_chart("#chart1", measure);

        filterText = d3.select('#search-text').property('value');
        productCode = onFilter(filterText,false);
        filtered = find_and_rank_comparables(data.data, productCode,measure);

        uc1.update(filtered, measure);
        uc2.update(filtered, measure)

    }
    else{
        // try to launch the polygon chart

        var width = 300;
        var height = 300;

        // Config for the Radar chart
        var config = {
            w: width,
            h: height,
            maxValue: 100,
            levels: 5,
            ExtraWidthX: 300,
            color: function(i) { if(i==0) return "#efc42a"; else return "#3399ff"; },
        }


        // clear the current chart
        $("#chart1").empty();

        $('#measure-buttons').hide();
        //$('#measure-buttons').disabled=true;
        //$('measure-buttons').Attributes.Add("style", "visibility:hidden");

        // update the radarChart

        selected = extract_one(data.data, "selected");  

        //{"area": "Fat ", "value": 0},     // max 31.25
        //{"area": "Sugars", "value": 0},   // max 55.56
        //{"area": "Protein ", "value": 0}, // max 13.33
        //{"area": "Sodium ", "value": 0},  // max 1
        //{"area": "Fiber ", "value": 0},   // max 10.7

        var maxFat      =  31.25;
        var maxSugars   = 55.56;
        var maxProteins = 13.33;
        var maxSodium   = 1;
        var maxFiber    = 10.7;

        radarData[0][0]["value"] = (maxFat - selected["fat_100g"])/maxFat*100;
        radarData[0][1]["value"] = (maxSugars-selected["sugars_100g"])/maxSugars*100;
        radarData[0][2]["value"] = (maxProteins-selected["proteins_100g"])/maxProteins*100;
        radarData[0][3]["value"] = (maxSodium-selected["sodium_100g"])/maxSodium*100;
        radarData[0][4]["value"] = (maxFiber-selected["fiber_100g"])/maxFiber*100;
        
        
        recommended = extract_one(data.data, "recommended");

        radarData[1][0]["value"] = (maxFat - recommended["fat_100g"])/maxFat*100;
        radarData[1][1]["value"] = (maxSugars-recommended["sugars_100g"])/maxSugars*100;
        radarData[1][2]["value"] = (maxProteins-recommended["proteins_100g"])/maxProteins*100;
        radarData[1][3]["value"] = (maxSodium-recommended["sodium_100g"])/maxSodium*100;
        radarData[1][4]["value"] = (maxFiber-recommended["fiber_100g"])/maxFiber*100;

        RadarChart.draw("#chart1", radarData, config);


        var svg = d3.select('body')
            .selectAll('svg')
            .append('svg')
            .attr("width", width)
            .attr("height", height);
    }
}
