const express = require('express');
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
router.post('/register' , async(req,res) => {
    try{
        const userExists = await User.findOne({email : req.body.email});
        if(userExists){
            return res.status(200).send({message : "user already exists" , success:false});
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        req.body.password = hashedPassword;
        const newuser = new User(req.body);

        await newuser.save();
        res.status(200).send({message : "user created successfully" , success:true});
    }catch(error){
        res.status(500).send({message : "Error creating user" , success:false,error});
    }
})

router.post('/login' , async(req,res) => {
    try{
        const user = await User.findOne({email:req.body.email});
        if(!user){
            return res.status(200).send({message : "User does not exits",success:false});
        }
        const isMatch = await bcrypt.compare(req.body.password,user.password);
        if(!isMatch){
            return res.status(200).send({message : "Password is incorrect",success:false});
        }else{
            const token = jwt.sign({id : user._id},process.env.JWT_SECRET);
        }
    }catch(error){
        
    }
})
module.exports = router;