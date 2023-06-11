var express = require('express');
var app = express();
app.use( express.static( 'public' ) );
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
const path = require('path');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
const bcrypt = require('bcrypt');


var server = app.listen(8081, function () {
   	var host = server.address().address
   	var port = server.address().port
   	console.log("Server Connected at http://%s:%s", host, port)
})


app.get('/', function (request, response) {
   	response.sendFile(path.join(__dirname+'/login.html'));
})


app.get('/noentry',function(request,response,next){
    response.clearCookie('name1').send("<h1 style='margin-left:45%; margin-top:400px;'><a href='/'>Please Login</a></h1>");
})


app.post('/register', function (request, response) {
	var mysql = require('mysql');
	var x;
	module.exports.x = request.body.username;
  response.cookie('name1','online');
	 var con = mysql.createConnection({
		    host: "localhost",
		    user: "root",
		    password: "",
		    database: "snakegame"
		    });
	  con.connect(function(err) {
		       	if (err) throw err;
            bcrypt.hash(request.body.pass, 10, function(err, hash) {
		       	var sql = "INSERT INTO users (name, pass) VALUES ('" + request.body.username + "','" + hash + "')";
		       	con.query(sql, function (err, result) {
		          	if (err) throw err;
		          	console.log("user information is obtained");
		          	response.redirect('/jaundra');
		       	});
           });
		    });  	
})


app.post('/postscore', function (request, response) {
  if(request.cookies.name1=='online'){
	var mysql = require('mysql');		
		var conn = mysql.createConnection({
  			host: "localhost",  	
  	 		user: "root",
  	 		password: "",
  	 		database: "snakegame"
		});
		conn.connect(function(err) {
  			if (err) throw err;
  			var Indexjs = require('./index.js');
  	 		var sql = "UPDATE users SET score =" + request.body.score +" WHERE name ='"+Indexjs.x+"'";
  	 		var sql1 = "UPDATE users SET avg = (0.5*(" + request.body.score +"+ tscore)) WHERE name ='"+Indexjs.x+"'";
  	 		conn.query(sql, function (err, result) {
     			if (err) throw err;
     			console.log("score is updated");
  	 		});
  	 		conn.query(sql1, function (err, result) {
     			if (err) throw err;
     			console.log("avg is updated");
  	 		});
        var sql2 = "SELECT * FROM notify WHERE fromuser='"+Indexjs.x+"'";
        conn.query(sql2,function(err,result){
          if(err) throw err;
          if(result.length>0){
          var a=result[0].cscore;
          var s=result[0].coins;
          var q=result[0].touser;
          if(a < request.body.score){
            var sql3 = "SELECT * FROM users WHERE name='"+Indexjs.x+"'";  
            conn.query(sql3,function(err,result1){
              if(err) throw err;
              var m = result1[0].pcoins + s;
              var sql4 = "UPDATE users SET pcoins="+m+" WHERE name='"+Indexjs.x+"'";
              conn.query(sql4,function(err,result){
                if(err) throw err;
              });
            });
            var sql5 = "SELECT * FROM users WHERE name='"+q+"'";  
            conn.query(sql5,function(err,result2){
              if(err) throw err;
              var n = result2[0].pcoins - s;
              var sql6 = "UPDATE users SET pcoins="+n+" WHERE name='"+q+"'";
              conn.query(sql6,function(err,result){
                if(err) throw err;
              });
            });
            var sql12 = "DELETE FROM notify";
            conn.query(sql12,function(err,result){
              if(err) throw err;
              console.log("Chalenge is successfully over");
            });
          }
          else{
            var sql7 = "SELECT * FROM users WHERE name='"+Indexjs.x+"'";  
            conn.query(sql7,function(err,result1){
              if(err) throw err;
              var b = result1[0].pcoins + s;
              var sql8 = "UPDATE users SET pcoins="+b+" WHERE name='"+Indexjs.x+"'";
              conn.query(sql8,function(err,result){
                if(err) throw err;
              });
            });
            var sql9 = "SELECT * FROM users WHERE name='"+q+"'";  
            conn.query(sql9,function(err,result2){
              if(err) throw err;
              var v = result2[0].pcoins - s;
              var sql11 = "UPDATE users SET pcoins="+v+" WHERE name='"+q+"'";
              conn.query(sql11,function(err,result){
                if(err) throw err;
              });
            });
            var sql13 = "DELETE FROM notify where fromuser='"+Indexjs.x+"'";
            conn.query(sql13,function(err,result){
              if(err) throw err;
              console.log("Challenge is successfully over");
            });
          }
        }
      });
  	});
	    }
  	else{
      response.redirect('/noentry');
    }
})


app.get('/leaderboard', function (request, response) {
  if(request.cookies.name1=='online'){
	var mysql = require('mysql');		
	var con = mysql.createConnection({
  		host: "localhost",  	
  	 	user: "root",
  	 	password: "",
  	 	database: "snakegame"
	});
	con.connect(function(err) {
  		if (err) throw err;
  		con.query("SELECT * FROM users ORDER BY score DESC;", function (err, result, fields) {
     			if (err) throw err;
     	response.write("<table style='background-color:lightblue;border: 1px solid black; width:300px;margin-left:auto; margin-right:auto; margin-top:300px'>");
         response.write("<tr>");
         response.write("<th style='background-color:#4CAF50;height: 20px; padding: 10px;text-align: center;'>NAME</th>");
         response.write("<th style='background-color:#4CAF50;height: 20px; padding: 10px;text-align: center;'>SCORE</th>");
         response.write("<th style='background-color:#4CAF50;height: 20px; padding: 10px;text-align: center;'>COINS</th></tr>");
         for(var i=0; i<result.length;i++){
         	response.write("<tr>");
             response.write("<td style='border: 1px solid black;height: 20px; padding: 10px;text-align: center;'>" + result[i].name + "</td>");
             response.write("<td style='border: 1px solid black;height: 20px; padding: 10px;text-align: center;'>"+ result[i].score + "</td>");
             response.write("<td style='border: 1px solid black;height: 20px; padding: 10px;text-align: center;'>"+ result[i].pcoins + "</td>");
             response.write("</tr>");
         }
         response.write("</table>"); 	
         response.send();	     			
     	});
 	});	  	 		
}
else{
  response.redirect('/noentry');
}
})


app.post('/validate', function (request, response) {
	var mysql = require('mysql');
	var x;
	module.exports.x = request.body.username;
  response.cookie('name1', 'online');
	 var con = mysql.createConnection({
		    host: "localhost",
		    user: "root",
		    password: "",
		    database: "snakegame"
		    });
	  con.connect(function(err) {
		       	if (err) throw err;
		       	var sql = "SELECT * FROM users WHERE name='" + request.body.username + "'";
		       	con.query(sql, function (err, result) {
		          	if (err) throw err;
                if(result.length>0){
                bcrypt.compare(request.body.pass,result[0].pass, function(err, res) {
                  if(res){
						      var sqlll = "SELECT * FROM notify WHERE fromuser ='"+request.body.username+"'";
                  con.query(sqlll, function (err, result) {
                    if (err) throw err;
                    if(result.length>0){
                    if(result[0].status==2){
                      response.redirect('/challenge1')
                    }
                    else{
                      response.redirect('jaundra')
                    }
                  }
                    else{
                      response.redirect('/jaundra')
                    }
                  });
              }
              else{
                response.redirect('/signup')
              }
            });
              }
               else{
                response.redirect('/signup')
              }
		       	});
		    });
})


app.post('/postscore2', function (request, response) {
  if(request.cookies.name1=='online'){
	var mysql = require('mysql');		
		var conn = mysql.createConnection({
  			host: "localhost",  	
  	 		user: "root",
  	 		password: "",
  	 		database: "snakegame"
		});
		conn.connect(function(err) {
  			if (err) throw err;
  			var Indexjs = require('./index.js');
  	 		var sql = "UPDATE users SET tscore =" + request.body.score +" WHERE name ='"+Indexjs.x+"'";
  	 		var sql1 = "UPDATE users SET avg = (0.5*(" + request.body.score +"+ score)) WHERE name ='"+Indexjs.x+"'";
  	 		conn.query(sql, function (err, result) {
     			if (err) throw err;
     			console.log("tscore is updated");
  	 		});
  	 		conn.query(sql1, function (err, result) {
     			if (err) throw err;
     			console.log("avg is updated");
  	 		});
  	    });
  }
  else{
    response.redirect('/noentry');
  }
})


app.get('/leaderboard2', function (request, response) {
  if(request.cookies.name1=='online'){
	var mysql = require('mysql');		
	var con = mysql.createConnection({
  		host: "localhost",  	
  	 	user: "root",
  	 	password: "",
  	 	database: "snakegame"
	});
	con.connect(function(err) {
  		if (err) throw err;
  		con.query("SELECT * FROM users ORDER BY tscore DESC;", function (err, result, fields) {
     			if (err) throw err;
     	response.write("<table style='background-color:lightblue;border: 1px solid black; width:300px;margin-left:auto; margin-right:auto; margin-top:300px'>");
         response.write("<tr>");
         response.write("<th style='background-color:#437CAE;height: 20px; padding: 5px;text-align: center;'>NAME</th>");
         response.write("<th style='background-color:#437CAE;height: 20px; padding: 5px;text-align: center;'>SCORE</th></tr>");
         for(var i=0; i<result.length;i++){
         	response.write("<tr>");
             response.write("<td style='border: 1px solid black;height: 20px; padding: 5px;text-align: center;'>" + result[i].name + "</td>");
             response.write("<td style='border: 1px solid black;height: 20px; padding: 5px;text-align: center;'>"+ result[i].tscore + "</td>");
             response.write("</tr>");
         }         
         response.write("</table>"); 	
         response.send();	
     	});
 	});	  	 		
}
else{
  response.redirect('/noentry');
}
})


app.get('/leaderboard3', function (request, response) {
  if(request.cookies.name1=='online'){
	var mysql = require('mysql');		
	var con = mysql.createConnection({
  		host: "localhost",  	
  	 	user: "root",
  	 	password: "",
  	 	database: "snakegame"
	});
	con.connect(function(err) {
  		if (err) throw err;
  		con.query("SELECT * FROM users ORDER BY avg DESC;", function (err, result, fields) {
     			if (err) throw err;
     	response.write("<table style='background-color:lightblue;border: 1px solid black; width:300px;margin-left:auto; margin-right:auto; margin-top:300px'>");
         response.write("<tr>");
         response.write("<th style='background-color:#437CAE;height: 20px; padding: 5px;text-align: center;'>NAME</th>");
         response.write("<th style='background-color:#437CAE;height: 20px; padding: 5px;text-align: center;'>AVERAGE</th></tr>");
         for(var i=0; i<result.length;i++){
         	response.write("<tr>");
             response.write("<td style='border: 1px solid black;height: 20px; padding: 5px;text-align: center;'>" + result[i].name + "</td>");
             response.write("<td style='border: 1px solid black;height: 20px; padding: 5px;text-align: center;'>"+ result[i].avg + "</td>");
             response.write("</tr>");
         }
         response.write("</table>"); 	
         response.send();	     			
     	});
 	});	
  }
  else{
    response.redirect('/noentry');
  }  	 		
})


app.get('/challenge', function (request, response) {
  if(request.cookies.name1=='online'){
	var mysql = require('mysql');		
	var con = mysql.createConnection({
  		host: "localhost",  	
  	 	user: "root",
  	 	password: "",
  	 	database: "snakegame"
	});
	con.connect(function(err) {
  		if (err) throw err;
		var Indexjs = require('./index.js');
  		var sql = "SELECT pcoins FROM users WHERE name ='"+Indexjs.x+"'";
  		con.query(sql, function (err, result) {
     			if (err) throw err;
     	var sql1 = "SELECT name, score, pcoins FROM users WHERE pcoins >"+result[0].pcoins;	
     	con.query(sql1, function (err, result) {
     			if (err) throw err;
     			response.send(result);
        });
  	 	});
  	});
}
else{
  response.redirect('/noentry');
}
})


app.get('/challenged', function (request, response) {
  if(request.cookies.name1=='online'){
  var mysql = require('mysql');   
  var con = mysql.createConnection({
      host: "localhost",    
      user: "root",
      password: "",
      database: "snakegame"
  });
  var url = request.url;
  var e=url.split("=");
  var f=e[1].split("&");
  var g=e[2].split("&");
  con.connect(function(err) {
      if (err) throw err;
      var Indexjs = require('./index.js');
      var sql1 = "SELECT * FROM notify WHERE fromuser='"+Indexjs.x+"'";
      con.query(sql1,function(err,result){
        if(err) throw err;
        if(result.length>0){
          response.write("something");
      }
      else{
      var sql = "INSERT INTO notify (fromuser,touser,status,coins,cscore) VALUES ('" + Indexjs.x + "','"+f[0]+"',1,'"+g[0]+"','"+e[3]+"')";   
      con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("challenge information is obtained");
     }); 
    }
     });      
  });  
}
else{
  response.redirect('/noentry');
}
})


app.get('/notify', function (request, response) {
  if(request.cookies.name1=='online'){
  var mysql = require('mysql');   
  var con = mysql.createConnection({
      host: "localhost",    
      user: "root",
      password: "",
      database: "snakegame"
  });
  con.connect(function(err) {
      if (err) throw err;
      var Indexjs = require('./index.js');
      var sqll = "SELECT * FROM notify WHERE touser ='"+Indexjs.x+"'";
      con.query(sqll, function (err, result) {
      if (err) throw err;
      response.send(result);
      });
    });
}
else{
  response.redirect('/noentry');
}
})


app.get('/notify1', function (request, response) {
  if(request.cookies.name1=='online'){
  var mysql = require('mysql');   
  var con = mysql.createConnection({
      host: "localhost",    
      user: "root",
      password: "",
      database: "snakegame"
  });
  con.connect(function(err) {
      if (err) throw err; 
      var Indexjs = require('./index.js');
      var sqll = "UPDATE notify SET status=2 WHERE touser ='"+Indexjs.x+"'";
      con.query(sqll, function (err, result) {
        if (err) throw err;
      });
  });
}
else{
  response.redirect('/noentry');
}
})


app.get('/subscribe', function (request, response) {
  if(request.cookies.name1=='online'){
   var mysql = require('mysql');   
    var conn = mysql.createConnection({
        host: "localhost",    
        user: "root",
        password: "",
        database: "snakegame"
    });
    conn.connect(function(err) {
        if (err) throw err;
        var Indexjs = require('./index.js');
        var sqll = "SELECT subs FROM users WHERE name='"+Indexjs.x+"'";
        conn.query(sqll, function (err, result) {
        if (err) throw err;
        if(result[0].subs==null){
          response.redirect('/select');
        }
        else{
          response.redirect('/games');
        }
      });
    });
  }
  else{
    response.redirect('/noentry');
  }
})


app.get('/allocate', function (request, response) {
  if(request.cookies.name1=='online'){
  var mysql = require('mysql');   
    var conn = mysql.createConnection({
        host: "localhost",    
        user: "root",
        password: "",
        database: "snakegame"
    });
    conn.connect(function(err) {
        if (err) throw err;
        var Indexjs = require('./index.js');
  var xhr=request.url;
  var s=xhr.split("?");
    var d=s[1].split("&");
    if(d.length===1)
    {
      var m=d[0].split("=");
      if(m[1]==="1"){
        var sqll = "UPDATE users SET subs=1 WHERE name='"+Indexjs.x+"'";
        conn.query(sqll, function (err, result) {
        if (err) throw err;
        response.redirect('/games');
      });
      }
      else{
        var sql2 = "UPDATE users SET subs=2 WHERE name='"+Indexjs.x+"'";
        conn.query(sql2, function (err, result) {
        if (err) throw err;
        response.redirect('/games');
      });
      }
    }
    else{
      var sql3 = "UPDATE users SET subs=3 WHERE name='"+Indexjs.x+"'";
        conn.query(sql3, function (err, result) {
        if (err) throw err;
        response.redirect('/games');
      });
    }
  });
  }
  else{
    response.redirect('/noentry');
  }
})


app.get('/ask', function (request, response) {
  if(request.cookies.name1=='online'){
  var mysql = require('mysql');   
    var conn = mysql.createConnection({
        host: "localhost",    
        user: "root",
        password: "",
        database: "snakegame"
    });
    conn.connect(function(err) {
        if (err) throw err;
        var Indexjs = require('./index.js');
        var sqll = "SELECT subs FROM users WHERE name='"+Indexjs.x+"'";
        conn.query(sqll, function (err, result) {
        if (err) throw err;
            response.send(result);
        });
    });
  }
  else{
    response.redirect('/noentry');
  }
})


app.post('/rating', function (request, response) {
  if(request.cookies.name1=='online'){
  var mysql = require('mysql');   
    var conn = mysql.createConnection({
        host: "localhost",    
        user: "root",
        password: "",
        database: "snakegame"
    });
    conn.connect(function(err) {
        if (err) throw err;
        var Indexjs = require('./index.js');
        var sqll = "UPDATE users SET rating='"+request.body.star+"' WHERE name ='"+Indexjs.x+"'";
        conn.query(sqll, function (err, result) {
        if (err) throw err;
      });
    });
  }
  else{
    response.redirect('/noentry');
  }
})


app.post('/ratingg', function (request, response) {
  if(request.cookies.name1=='online'){
  var mysql = require('mysql');   
    var conn = mysql.createConnection({
        host: "localhost",    
        user: "root",
        password: "",
        database: "snakegame"
    });
    conn.connect(function(err) {
        if (err) throw err;
        var Indexjs = require('./index.js');
        var sqll = "UPDATE users SET ratingg='"+request.body.star+"' WHERE name ='"+Indexjs.x+"'";
        conn.query(sqll, function (err, result) {
        if (err) throw err;
      });
    });
  }
  else{
    response.redirect('/noentry');
  }
})


app.get('/sgamerating', function (request, response) {
  if(request.cookies.name1=='online'){
  var mysql = require('mysql');   
    var conn = mysql.createConnection({
        host: "localhost",    
        user: "root",
        password: "",
        database: "snakegame"
    });
    conn.connect(function(err) {
        if (err) throw err;
        var Indexjs = require('./index.js');
        var sqll = "SELECT AVG(rating) AS avg FROM users";
        conn.query(sqll, function (err, result) {
        if (err) throw err;
        response.send(result);        
      });
    });
  }
  else{
    response.redirect('/noentry');
  }
})


app.get('/tgamerating', function (request, response) {
  if(request.cookies.name1=='online'){
  var mysql = require('mysql');   
    var conn = mysql.createConnection({
        host: "localhost",    
        user: "root",
        password: "",
        database: "snakegame"
    });
    conn.connect(function(err) {
        if (err) throw err;
        var Indexjs = require('./index.js');
        var sqll = "SELECT AVG(ratingg) AS avg FROM users";
        conn.query(sqll, function (err, result) {
        if (err) throw err;
        response.send(result);        
      });
    });
  }
  else{
    response.redirect('/noentry');
  }
})


app.get('/jaundra', function (request, response) {
    if(request.cookies.name1=='online'){  
    response.sendFile(path.join(__dirname+'/jaundra.html'));
  }
  else{
    response.redirect('/noentry');
  }
})


app.get('/signup', function (request, response) {
    response.sendFile(path.join(__dirname+'/signup.html'));
})


app.get('/challenge1', function (request, response) {
  if(request.cookies.name1=='online'){
    response.sendFile(path.join(__dirname+'/challenge1.html'));
  }
  else{
    response.redirect('/noentry');
  }
})


app.get('/coins', function (request, response) {
  if(request.cookies.name1=='online'){
    response.sendFile(path.join(__dirname+'/coins.html'));
  }
  else{
    response.redirect('/noentry');
  }
})


app.get('/oops', function (request, response) {
  if(request.cookies.name1=='online'){
    response.sendFile(path.join(__dirname+'/oops.html'));
  }
  else{
    response.redirect('/noentry');
  }
})


app.get('/games', function (request, response) {
  if(request.cookies.name1=='online'){
    response.sendFile(path.join(__dirname+'/games.html'));
  }
  else{
    response.redirect('/noentry');
  }
})


app.get('/flapbird', function (request, response) {
  if(request.cookies.name1=='online'){
    response.sendFile(path.join(__dirname+'/flapbird.html'));
  }
  else{
    response.redirect('/noentry');
  }
})


app.get('/dots', function (request, response) {
  if(request.cookies.name1=='online'){
    response.sendFile(path.join(__dirname+'/dots.html'));
  }
  else{
    response.redirect('/noentry');
  }
})


app.get('/snake', function (request, response) {
  if(request.cookies.name1=='online'){
    response.sendFile(path.join(__dirname+'/snake.html'));
  }
  else{
    response.redirect('/noentry');
  }
})


app.get('/typeracer', function (request, response) {
  if(request.cookies.name1=='online'){
    response.sendFile(path.join(__dirname+'/typeracer.html'));
  }
  else{
    response.redirect('/noentry');
  }
})


app.get('/challenges', function (request, response) {
  if(request.cookies.name1=='online'){
    response.sendFile(path.join(__dirname+'/challenge.html'));
  }
  else{
    response.redirect('/noentry');
  }
})


app.get('/select', function (request, response) {
  if(request.cookies.name1=='online'){
    response.sendFile(path.join(__dirname+'/select.html'));
  }
  else{
    response.redirect('/noentry');
  }
})


app.get('/feedback', function (request, response) {
  if(request.cookies.name1=='online'){
    response.sendFile(path.join(__dirname+'/feedback.html'));
  }
  else{
    response.redirect('/noentry');
  }
})


app.get('/lead', function (request, response) {
  if(request.cookies.name1=='online'){
    response.sendFile(path.join(__dirname+'/lead.html'));
  }
  else{
    response.redirect('/noentry');
  }
})


app.get('/leadt', function (request, response) {
  if(request.cookies.name1=='online'){
    response.sendFile(path.join(__dirname+'/leadt.html'));
  }
  else{
    response.redirect('/noentry');
  }
})
