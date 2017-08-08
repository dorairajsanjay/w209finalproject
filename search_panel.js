
/*********************************
*    process key operations on search
***********************************/

function processSearchKey(){
    keyCode = d3.event.keyCode;

    filterText = d3.select('#search-text').property('value');
    if (keyCode == 13) {
            // initialize left charts panel
            var productCode = onFilter(filterText);
            $("#chart1").empty();
            var uc1=parallel_chart("#chart1");
            filtered = find_and_rank_comparables(data.data, productCode, "sugars_100g");
            uc1.update(filtered);       
    }
    else{
        onFilter(filterText);
    }
    
}

/*********************************
*    search for matching data
***********************************/

function onFilter(filterText){

    filteredData = data;
    var filteredData;

    // if products need to be filtered based on user input, then do that here
    if (filterText !== ""){
        var filteredData = data.data.filter(function(d){
            filteredItems = d.product_name.indexOf(filterText);
            return (filteredItems === 0);
        });
    }

    filteredData = filteredData.slice(0,4)
    d3.select('#filteredList').html(
        filteredData.map(function(d){
        return d.product_name;
        }).join(".<br/>")
    );

    return filteredData[0].code;
}
