const express = require("express")
const router= express.Router();


//index-users
router.get("/",(req,res)=>{
    res.send("GET for users");

})
//show-users
router.get("/:id",(req,res)=>{
    res.send("GET for users");

})
//post users
router.post("/",(req,res)=>{
    res.send("post for users")
})
//delete user
router.delete("/:id",(req,res)=>{
    res.send("DEELTE for user ids")
})

module.exports = router;