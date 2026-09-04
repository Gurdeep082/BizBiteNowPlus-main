const router =
require("express").Router();


const profile =
require("../data/profile");



router.get(
"/:id",
(req,res)=>{

res.json(profile);

});



router.get(
"/addresses/:id",
(req,res)=>{

res.json(
profile.addresses
);

});



router.get(
"/payments/:id",
(req,res)=>{

res.json(
profile.payments
);

});



module.exports=router;