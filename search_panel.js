
/*********************************
*    process key operations on search
***********************************/

function processSearchKey(){
    keyCode = d3.event.keyCode;

    filterText = d3.select('#search-text').property('value');
    if (keyCode == 13) {

            // initialize left charts panel
            filtered = find_and_rank_comparables(data.data, onFilter(filterText,false), getMeasure(bfc_context.selected_submenu_button.id));

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
                var uc1=bar_chart("#chart1", getMeasure(bfc_context.selected_submenu_button.id));

                uc1.update(filtered, getMeasure(bfc_context.selected_submenu_button.id));
                uc2.update(filtered, getMeasure(bfc_context.selected_submenu_button.id));

            }
            else{
                // force back to simple view
                bfc_context.selected_topmenu_button = document.getElementById("sv");
                bfc_context.selected_topmenu_button.classList.remove("inactive");
                bfc_context.selected_topmenu_button.classList.add("active");

                document.getElementById("av-polygon").classList.remove("active");
                document.getElementById("av-polygon").classList.add("inactive");

                $('#measure-buttons').show();

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
    }
    //else{
    //    onFilter(filterText);
   // }
    
}

/*********************************
*    search for matching data
***********************************/

function onFilter(filterText,showRelated=true){

    var filteredData;  

    // if products need to be filtered based on user input, then do that here
    if (filterText !== ""){
        var filteredData = data.data.filter(function(d){
            filteredItems = d.product_name.indexOf(filterText);
            return (filteredItems === 0);
        });
    }

    if (showRelated == true)
    {
        filteredData = filteredData.slice(0,4);
        d3.select('#filteredList').html(
            filteredData.map(function(d){
            return d.product_name;
            }).join(".<br/>")
        );
    }

    return filteredData[0].code;
}
