const Listing=require("./models/listing.js")
const Review=require("./models/review.js")

module.exports.isLoggedIn = (req,res,next)=>{
    
    if(!req.isAuthenticated()){
        //redirect url save
        req.session.redirectUrl=req.originalUrl
        req.flash("error","you must be logged in to create listing")
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);

    if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to edit this listing.");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id,reviewId } = req.params;

    let review = await Review.findById(reviewId);
    console.log(review);


    if (!res.locals.currUser || !review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't created this review.");
        return res.redirect(`/listings/${id}`);
    }

    next();
};