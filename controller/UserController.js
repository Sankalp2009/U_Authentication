// Controller for Logic Purpose
const User = require ('../Model/UserModel.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const SECRET_KEY = process.env.JWT_SECRET;
// This is Basically we register user on the basis of email and password not OAuth token
exports.Register = async(req,res)=>
{
    const {name,email, password:plainTextPassword} = req.body;
    //  Here we basically checking for whether name email and password we are sending are valid or not By Manually
    if(!name || typeof name !== 'string')
    {
        return res.json({message:'Valid name is required'})
    }
    if(!email || typeof email !== 'string')
    {
        return res.json({message:'Valid Email is required'})
    }
    if(!plainTextPassword || typeof plainTextPassword !== 'string')
    {
        return res.json({message:'Valid plainTextPassword is required'})
    }
    const password = await bcrypt.hash(plainTextPassword,8)
    try 
    {
        const response = await User.create({
            name,
            email,
            password
        })
        return res.status(200).json({
            message:'User Created Successfully',
            data:response
        })
    } 
    catch (error) 
    {
        if(error.code === 11000)
        {
            //Duplicate Data
            return res.status(409).json({
                message:'User Already Exists'
            })
        }else
        {
            return res.status(300).json({
            message:"Something went wrong"
        })
        }
        
    }
}
exports.Login = async(req,res)=>
{
    /* Destructuring the req.body object. */
    const {email,password} = req.body;
    /* Basically checking whether user is present or not. */
    const user = await User.findOne({email});
    console.log(user);
    if(!user)
    {
        return res.status(404).json({
            message:'User Not Found'
            })
    }
   /* This is basically checking whether the password is correct or not. */
   try {
    if(await bcrypt.compare(password,user.password))
    {
     /* This is basically creating a token for the user. */
      const Token = jwt.sign({
        email:user.email,
        id:user._id
      },SECRET_KEY)
      
     return res
      .status(200)
      .json({
        status:'ok',
        message: "Login successfully",
        accessToken: Token,
    })
    }
    else{
     return    res
    .status(401)
    .json({
    message:'Invalid Password'
    }) 
    }
   } catch (error) {
    return res.status(300).json({
        message:"Something went wrong"
    })
   }
    
      
}

exports.changePassword = async(req, res)=>{
const {token , newpassword:plainTextPassword} = req.body;
if(!plainTextPassword || typeof plainTextPassword !== 'string')
    {
        return res.json({message:'Valid plainTextPassword is required'})
    }
try { 
    const user = jwt.verify(token,SECRET_KEY);
    const _id = user.id;
    const password = await bcrypt.hash(plainTextPassword,8)
    // This is basically over a Defined UserModel where we update the password on existing user 
   await User.updateOne( 
    {_id},
    {
    $set:{password}
  })
 res
    .status(200)
    .json({
      status:'ok',
      message: "Password Updated successfully",
  })
} 
catch (error) 
{
 res.json({message:"Something went wrong"})
}}