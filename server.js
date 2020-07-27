let express = require("express");
let database = require("./src/Database");
let User = require("./user");

database._connect();

let app = express();
app.use(express.json());

//Create Many Records with model.create()
app.post("/", (req, res) => {
  User.create(req.body, (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

//Use model.find() to Search Your Database
app.get("/find", (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch((err) => console.log(err));
});

//Use model.findOne() to Return a Single Matching Document from Your Database
app.get("/findOne", (req, res) => {
  User.findOne({ favoriteFoods: req.body.favoriteFoods }, (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

//Use model.findById() to Search Your Database By _id
app.get("/findById/:id", (req, res) => {
  User.findById(req.params.id, (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

//Perform Classic Updates by Running Find, Edit, then Save
app.put("/updateById/:id", (req, res) => {
  User.findById(req.params.id, (err, data) => {
    if (err) throw err;
    User.update(
      data,
      { $push: { favoriteFoods: req.body.favoriteFoods } },
      // data.favoriteFoods.push(req.body.favoriteFoods),
      (err, dat) => {
        if (err) throw err;
        res.send(`${req.body.favoriteFoods} is added to ${data.name}`);
      }
    );
  });
});

//Perform New Updates on a Document Using model.findOneAndUpdate()
app.put("/findOneAndUpdate/:id", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { age: req.body.age } },
    { new: true },
    (err, data) => {
      if (err) throw err;
      res.send(`${data.name}'s age is changed to ${req.body.age}`);
    }
  );
});

//Delete One Document Using model.findByIdAndRemove
app.delete("/findByIdAndRemove/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id, (err, data) => {
    if (err) throw err;
    res.send(data.name + " is removed");
  });
});

//MongoDB and Mongoose - Delete Many Documents with model.remove()
app.delete("/remove/:name", (req, res) => {
  User.remove({ name: req.params.name }, (err, data) => {
    if (err) throw err;
    res.send(`${data.deletedCount} ${req.params.name} is removed`);
  });
});

//Chain Search Query Helpers to Narrow Search Results
app.get("/search/:favoriteFoods", (req, res) => {
  User.find({ favoriteFoods: { $in: req.params.favoriteFoods } })
    .sort("name")
    .limit(2)
    .select("-age")
    .exec((err, data) => {
      if (err) throw err;
      res.send(data);
    });
});

let port = process.env.PORT || 5000;
app.listen(port, () => console.log("server is running on port " + port));