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

        var uc2=nutrition_facts("#nutfacts_panel")
        var uc1=bar_chart("#chart1", measure);

        filterText = d3.select('#search-text').property('value');
        productCode = onFilter(filterText,false);
        filtered = find_and_rank_comparables(data.data, productCode,measure);

        uc1.update(filtered, measure);
        uc2.update(filtered, measure)

    }
    else{
        alert("In advanced polygon chart - sorry, this is not yet implemented.");
    }
}
