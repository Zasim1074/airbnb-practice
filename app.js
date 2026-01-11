const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const port = 8080;
const mongo_url = "mongodb://127.0.0.1:27017/wonderlust";

//Connection Route
main()
  .then(() => {
    console.log("Connected to Database.");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongo_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//Root route
app.get("/", (req, res) => {
  res.send("I'm the root");
});

// All Listings route
app.get("/listings", async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
});

// New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Add route
app.post("/listings", async (req, res) => {
  console.log(req.body.listing); // Check what's coming in
  const newListing = new Listing(req.body.listing);
  try {
    await newListing.save();
    res.redirect("/listings");
  } catch (e) {
    console.log("Error saving listing:", e);
    res.send("Save failed");
  }
});

//Edit route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//update route
app.post("/listings/:id", async (req, res) => {
  let { id } = req.params;
  console.log(req.body);
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

app.get("/listings/:id/delete", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

//Show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

//Server route
app.listen(port, () => {
  console.log("Server is listening.");
});
