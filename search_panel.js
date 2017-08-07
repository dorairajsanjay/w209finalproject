/*********************************
*    load data for search panel
***********************************/

function handleFileSelect(evt) {
    url = "http://localhost:8080/demo_food_data_sd.csv";

    Papa.parse(url, {
        header: true,
        download:true,
        dynamicTyping: true,
        complete: function(results) {
            data = results;
            d3.select('#search-text').on('keyup', processSearchKey);
        }
    });
}

/*********************************
*    process key operations on search
***********************************/

function processSearchKey(){
    keyCode = d3.event.keyCode;

    filterText = d3.select('#search-text').property('value');
    if (keyCode == 13) {
        alert(onFilter(filterText));
    }
    else{
        onFilter(filterText);
    }
    
}

/*********************************
*    search for matching data
***********************************/

function onFilter(filterText){

    filteredData = data.data;
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
