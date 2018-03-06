var express = require("express"),
    app = express(),
    //fs = require("fs"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override");
    
mongoose.connect("mongodb://localhost/kawa");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('views/public'));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

//SCHEMA
var kawaSchema = new mongoose.Schema({
    name: String,
    img: String,
    content: String,
    namecatch: String
});

var kawa = mongoose.model("kawa", kawaSchema);


app.get("/", function(req, res) {
  kawa.find({}, function(err, task){
      if (err) {
          console.log(err);
      } else {
        res.render("landing", {task: task} );
      }
  });
});

app.post("/", function(req, res){
    var namecatch = req.body.namecatch;
    var name = req.body.name;
    var img = req.body.img;
    var content = req.sanitize(req.body.content);
    var newTask = {name: name, img : img, content : content, namecatch : namecatch};
    // Create new save to db
    kawa.create(newTask, function(err, newKawa) {
        if (err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

app.get("/kawa/:id", function(req, res) {
    kawa.findById(req.params.id, function(err, found){
        if(err) {
            console.log(err);
        } else {
            res.render("show", {kawa: found});
        }
    });
});


app.get("/login", function(req, res) {
   res.render("login");
});


app.get("/new", function(req, res){
    res.render("new");
});

app.put("/kawa/:id", function(req, res) {
    kawa.findByIdAndUpdate(req.params.id, req.body, function(err, updated) {
        if (err) {
            res.redirect("/");
            console.log(err);
        } else {
            res.redirect("/kawa/" + req.params.id);
        }
    });
});


app.get("/kawa/:id/edit", function(req, res){
    kawa.findById(req.params.id, function(err, found) {
        if (err) {
            res.redirect("/");
        } else {
            res.render("edit", {kawa : found});
        }
    });
});

app.delete("/kawa/:id", function(req, res) {
    kawa.findByIdAndRemove(req.params.id, function(err){
       if(err) {
           res.redirect("/");
       }  else {
           res.redirect("/");
       }
    });
});


app.listen(process.env.PORT, 8888, function(){
    console.log("Logged");
});
