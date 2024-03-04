const userModel = require('../models/userModels')
const bcrypt = require('bcryptjs')

//register callback
const registerController = async(req,res) => {
     try{
        const existingUser = await userModel.findOne({email:req.body.email})
        if(existingUser){
            return res.status(200).send({message:'User Already Exist', success:false});
        }
        else{

          const password = req.body.password;
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password , salt);
          req.body.password = hashedPassword;
          const newUser = new userModel(req.body);
          await newUser.save();
          res.status(201).send({message: "Registered Sucessfully" , success: true});
          

        }

     }
     catch(error){
        console.log(error);
        res.status(500).send({success:false, message: `register Controller ${error.message}`})
     }
};

//loginController
const loginController = async(req , res) => {
    try{
      const user = await userModel.findOne({email:req.body.email})
      if(!user){
         return res.status(200).send({message:'user not found', success:false})
      }
      const isMatch = await bcrypt.compare(req.body.password , user.password)
       if(!isMatch){
         return res.status(200).send({message:'Invalid email or Password', success:false})
       }
       
    }catch(error){
      console.log(error)
      res.status(500).send({message: `Error in Login CTRL ${error.message}`})
    }

};

module.exports = { loginController , registerController }