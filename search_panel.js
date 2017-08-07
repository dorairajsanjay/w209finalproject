/*********************************
*    load data for search panel
***********************************/

function handleFileSelect(evt) {
    url = "http://localhost:8000/demo_food_data_search.csv";

    Papa.parse(url, {
    header: true,
    download:true,
    dynamicTyping: true,
    complete: function(results) {
        data = results;
        d3.select('#search-text').on('keyup', onFilter);
    }
    });
}

/*********************************
*    search for matching data
***********************************/

function onFilter(){

    var filterText = d3.select('#search-text').property('value');

    filteredData = data.data;
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
}
