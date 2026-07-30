const express = require("express")
const router= express.Router();
//index
router.get("/",(req,res)=>{
    res.send("GET for posts");

})
//show-
router.get("/:id",(req,res)=>{
    res.send("GET for posts");

})
//post 
router.post("/",(req,res)=>{
    res.send("post for posts")
})
//delete 
router.delete("/:id",(req,res)=>{
    res.send("DEEL for post ids")
})
module.exports = router