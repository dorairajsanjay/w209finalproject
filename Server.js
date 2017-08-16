var express=require('express');
var app=express();
var  mysql=require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'usdafood'
});

connection.connect();

app.use(express.static(__dirname + '/JS'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/search',function(req,res){
connection.query('SELECT product_name from demo_food_data_latest where product_name like "%'+req.query.key+'%"', function(err, rows, fields) {
	  if (err) throw err;
    var data=[];
    for(i=0;i<rows.length;i++)
      {
        data.push(rows[i].product_name);
      }
      res.end(JSON.stringify(data));
	});
});

app.get('/recommendations',function(req,res){
//SELECT * FROM usda_imports_filtered_brands
//    WHERE MATCH (product_name)
 //   AGAINST ('Organic Medium Shredded Coconut' IN NATURAL LANGUAGE MODE) limit 10
var queryString = 'SELECT * from usda_imports_filtered_brands where match (product_name) against ("' + req.query.key + '" in natural language mode) limit 10';
console.log(queryString);
connection.query(queryString, function(err, rows, fields) {
	  if (err) throw err;
    var data=[];
    for(i=0;i<rows.length;i++)
      {
        data.push(rows);
      }
      res.end(JSON.stringify(data));
	});
});

var server=app.listen(3000,function(){
console.log("We have started our server on port 3000");
});
