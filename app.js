//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connect to mongo database
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model(
  "Item",
  itemsSchema
);

//created three new documents
const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item"
});

//array of documents
const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {

    //insert items into database
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
  if (err) {
    console.log(err);
  } else {
      console.log("Successfully saved default items to DB.");
  };
});
res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  
  });
});


app.post("/", function(req, res){

  //gets user inputted item
  const itemName = req.body.newItem;
  //push user input into Item model
  const item = new Item({
    name: itemName
  })
  //save items to the database
  item.save();
  //redirect to the home directory and display saved item
  res.redirect("/");
});

app.post("/delete", function(req,res){
  const checkedItemID = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemID, function(err){
    if (!err) {
      console.log("Successfully deleted checked item");
      res.redirect("/");
    } else {
      console.log(err);
    }
  })
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
