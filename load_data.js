/*********************************
*    load data 
***********************************/

function loadUSDAData(evt) {
    url = "http://localhost:8080/demo_food_data_sd.csv";

    Papa.parse(url, {
        header: true,
        download:true,
        dynamicTyping: true,
        complete: function(results) {
            data = results;

            /*** file is loaded - launch dependent charts */

            // register keys on search panel
            d3.select('#search-text').on('keyup', processSearchKey);

            // initialize left charts panel
            $("#chart1").empty();
            var uc1=parallel_chart("#chart1");
            filtered = find_and_rank_comparables(data.data, "72030015712", "sugars_100g");
            uc1.update(filtered);       
        }
    });
}
