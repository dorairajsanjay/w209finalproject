/*********************************
*    load data
***********************************/

function loadUSDAData(evt) {

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
            $("#nutfacts_panel").empty();

            var measure = "fat_100g";

            var uc1=bar_chart("#chart1", measure);
            var uc2=nutrition_facts("#nutfacts_panel")

            filtered = find_and_rank_comparables(data.data, "714000000000", measure);

            uc1.update(filtered, measure);
            uc2.update(filtered, measure);

            // update search text with value
            document.getElementById('search-text').value = "Low Sodium Applause Crackers";
        }
    });
}
