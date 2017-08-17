/*********************************
*    load data
***********************************/

function loadUSDAData(evt) {

    Papa.parse(url, {
        header: true,
        download:true,
        dynamicTyping: true,
        skipEmptyLines: true,  // need this because can get empty last line in csv
        complete: function(results) {

            console.log(results);
            data = add_data_per_serving(results);

            // console.log(data);

            /*** file is loaded - launch dependent charts */

            // register keys on search panel
            d3.select('#search-text').on('keyup', processSearchKey);

            // initialize left charts panel
            $("#chart1").empty();
            $("#nutfacts_panel").empty();

            var measure = "fat_svg";

            var uc1=bar_chart("#chart1", measure);
            var uc2=nutrition_facts("#nutfacts_panel");

            filtered = find_and_rank_comparables(data.data, "N713733903387", measure);

            console.log(filtered);

            uc1.update(filtered, measure);
            uc2.update(filtered, measure);

            // update search text with value
            document.getElementById('search-text').value = "Low Sodium Applause Crackers";
        }
    });
}



// Append values for key measure per serving size rather than per 100g
function add_data_per_serving(data) {

    for (i = 0; i<data.data.length;i++) {

        serving = parseFloat(data.data[i].serving_size.substring(0, data.data[i].serving_size.indexOf("g")));
        serv_factor = serving / 100

        fields_to_convert = ["energy_100g", "fat_100g", "cholesterol_100g", "carbohydrates_100g",
                            "sugars_100g", "proteins_100g", "sodium_100g", "fiber_100g"];

        for (j = 0; j<fields_to_convert.length;j++) {
            var val_100g = data.data[i][fields_to_convert[j]];
            var old_name = fields_to_convert[j];
            var new_name = old_name.substring(0, old_name.indexOf("_"))+"_svg";
            data.data[i][new_name] = val_100g * serv_factor;
        };

    };

    return data;
}
