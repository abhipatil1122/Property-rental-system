const express = require("express")
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner}=require("../middleware.js")

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if (error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next()
    }
}
//Index Route
router.get("/",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))
//New Route
router.get("/new",isLoggedIn,(req,res)=>{
    // console.log(req.user);//in the middleware
    // if(!req.isAuthenticated()){
    //     req.flash("error","you must be logged in to create listing")
    //     return res.redirect("/login");
    // }
    res.render("listings/new.ejs");
})

//Show Route
router.get("/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author",
        }
    })
    .populate("owner");
    if(!listing){
        req.flash("error","this listing is deleted")
        return res.redirect("/listings")
    }
    console.log(listing)
    res.render("listings/show.ejs",{listing});
}));

//Create Route
router.post("/",
    isLoggedIn,
    validateListing,
    wrapAsync(async(req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created")
    res.redirect("/listings");

}))

//Edit Route
router.get("/:id/edit",isLoggedIn,
    isOwner,
    wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
router. put("/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    // if(!currUser && !listing.owner._id.equals(res.locals.currUser._id)){
    //     req.flash("error","You don;t have permision to edit")
    //     return res.redirect(`/listings/${id}`);
    // }implemeted via middlewar

    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","listing updated")
    res.redirect(`/listings/${id}`);
}))
//Delete Route
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted")
    res.redirect("/listings");
}))

module.exports = router;