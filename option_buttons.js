/*********************************
*    initialization
***********************************/

function initOptionButtons(){
    //selected_main_button :null,
    //selected_sv_button :null,
    //selected_av_button :null

    // is this our first time?
    bfc_context.selected_main_button = document.getElementById("sv-main");
    bfc_context.selected_main_button.classList.remove("inactive");
    bfc_context.selected_main_button.classList.add("active");

    bfc_context.selected_sv_button = document.getElementById("sv-fat");
    bfc_context.selected_sv_button.classList.remove("inactive");
    bfc_context.selected_sv_button.classList.add("active");

}

/*********************************
*    process options
***********************************/

function optionButtonSelected(id){
    //selected_main_button :null,
    //selected_sv_button :null,
    //selected_av_button :null

    // is this our first time?
    // possible ids - sv-main,av-main,sv-fat,sv-calories,sv-sodium,sv-sugars,sv-cholesterol
    temp_selected = document.getElementById(id);

    // nothing to do if the same options were selected
    if (id == bfc_context.selected_main_button.id || id == bfc_context.selected_sv_button.id)
        return;

    // a different option was selected - was it a top level or the second level button?
    if ( id == "sv-main" || id =="av-main")
    {
        bfc_context.selected_main_button.classList.remove("active");
        bfc_context.selected_main_button.classList.add("inactive");
        temp_selected.classList.add("active");

        bfc_context.selected_main_button = temp_selected;

    }
    else {
        // a second level button was selected
        var viewOption="None";

        if (bfc_context.selected_main_button.id ==  "sv-main")
        {
            // look to see which one changed
            if (temp_selected.id == "sv-fat")
                viewOption = "fat_100g";
            else if (temp_selected.id == "sv-sugars")
                viewOption = "sugars_100g";
            else if (temp_selected.id == "sv-proteins")
                viewOption = "proteins_100g";
            else if (temp_selected.id == "sv-sodium")
                viewOption = "sodium_100g";
            else if (temp_selected.id == "sv-fiber")
                viewOption = "fiber_100g";

            // change button colors
            bfc_context.selected_sv_button.classList.remove("active");
            bfc_context.selected_sv_button.classList.add("inactive");
            temp_selected.classList.add("active");

            bfc_context.selected_sv_button = temp_selected;

            // invoke changes in chart
            $("#chart1").empty();
            $("#nutfacts_panel").empty();
            var uc1=parallel_chart("#chart1");
            var uc2=nutrition_facts("#nutfacts_panel")
            filterText = d3.select('#search-text').property('value');
            productCode = onFilter(filterText);
            filtered = find_and_rank_comparables(data.data, productCode,viewOption);
            uc1.update(filtered);
            uc2.update(filtered, viewOption)
        }
        else{
            alert("In advanced sub level - not supposed to be getting here now");
        }
    }


}
