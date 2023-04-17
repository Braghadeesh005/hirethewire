const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs')
const cookieParser = require("cookie-parser");
router.use(cookieParser());

const authenticate = require("../middleware/authenticate");
const sendEmail = require("../middleware/sendEmail");
const upload = require('../middleware/upload');
const upload1 = require('../middleware/productupload');

//DB
require('../db/conn');

//Schema
const User1 = require('../model/userSchema1');
const User2 = require('../model/userSchema2');
const User3 = require('../model/userSchema3');


//Logout page
router.get("/logout", (req,res) => 
{
    console.log("User Logged Out");
    res.clearCookie('jwtoken', {path: '/'});
    res.status(200).send("User Logout");
});











// Admin Login Page
router.post('/adminsignin', async (req,res)=>{
    try
    {
        let token;
        const { email, password}=req.body;
 
        if(!email || !password){
         console.log("Please fill the data");
         return res.status(400).json({errror:"Please fill the data"})
        }
 
        const userLogin = await User1.findOne({email:email}); 
       
        if(userLogin)
        {
           const isMatch = await bcrypt.compare(password, userLogin.password);
           token = await userLogin.generateAuthToken();
           res.cookie("jwtoken",token,{
             expires:new Date(Date.now()+ 25892000),
             httpOnly:true
           });
           if(!isMatch)
           {
             console.log("Invalid Credentials");
             return res.status(400).json({error:"Invalid Credentials"});
           }
           else
           {
             console.log("Admin SignIn Successful");
           res.json({message:"Admin SignIn Successful"});
           }
        }
        else
        {
         console.log("Email you have entered has not registered or incorrect");
         return res.status(400).json({error:"Email you have entered has not registered or incorrect"});
        }
     }  
     catch(err)
     {
        console.log(err);
     }
 })
 
// admin Registration Page
router.post('/adminregister', async(req,res)=>{
 
    const { email, password, cpassword} = req.body;
   
    if(!email || !password || !cpassword)
    {
        console.log("please fill the field properly");
        return res.status(422).json({error: "please fill the field properly"});
    }
    if(password != cpassword)
    {
        console.log("please confirm the same password");
        return res.status(422).json({error: "please confirm the same password"});
    }

    try{ 

        const userExist = await User1.findOne({ email: email });
      
        if(userExist){
            console.log("Email already exists");
        return res.status(422).json({ error: "Email already exists"});
        }

        const user = new User1({email, password, cpassword}); 

       const userRegister = await user.save();

        if(userRegister){
            console.log(user);
            console.log("user registered successfully");
            res.status(201).json({ message: "user registered successfully"});
        }
        else{
            console.log("failed to register");
            res.status(500).json({error: "failed to register"});
        }
    

    }
    catch(err){
        console.log(err);
    }
 
});

















// Employee Registration Page


router.post('/api/images', upload.single('image'), async (req, res) => {

  const { name, email, phone, work, password, cpassword } = req.body;
  
   
    if(!name || !email || !phone || !work || !password || !cpassword )
    {
        console.log("please fill the field properly");
        return res.status(422).json({error: "please fill the field properly"});
    }
    if(password != cpassword)
    {
        console.log("please confirm the same password");
        return res.status(422).json({error: "please confirm the same password"});
    }
    try{ 

      const userExist = await User2.findOne({ email: email });
    
      if(userExist){
          console.log("Email already exists");
      return res.status(422).json({ error: "Email already exists"});
      }

      
  }
  catch(err){
      console.log(err);
  }


  const image = new User2({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    work: req.body.work,
    password: req.body.password,
    cpassword: req.body.cpassword,
    scrap: req.body.scrap,
    filename: req.file.filename,
    originalName: req.file.originalname,
    path: req.file.path,
  });
   const userimage = await image.save()
    if(userimage){
      console.log(image);
          console.log("user registered successfully");
             res.status(201).json({ message: "user registered successfully"});
    }
    else{
      console.log("failed to register");
          res.status(500).json({error: "failed to register"});
    };
});


//to get all data with images
router.get('/api/images', (req, res) => {
  User2.find()
    .sort('-created')
    .then((images) => {
      res.json(images);
    })
    .catch((err) => {
      res.status(500).json({ success: false, error: err.message });
    });
});

// Employee Login Page

router.post('/employeesignin', async (req,res)=>{
    try
    {
        let token;
        const { email, password}=req.body;
 
        if(!email || !password){
         console.log("Please fill the data");
         return res.status(400).json({errror:"Please fill the data"})
        }
 
        const userLogin = await User2.findOne({email:email}); 
       
        if(userLogin)
        {
           const isMatch = await bcrypt.compare(password, userLogin.password);
           token = await userLogin.generateAuthToken();
           res.cookie("jwtoken",token,{
             expires:new Date(Date.now()+ 25892000),
             httpOnly:true
           });
           if(!isMatch)
           {
             console.log("Invalid Credentials");
             return res.status(400).json({error:"Invalid Credentials"});
           }
           else
           {
             console.log("Employee SignIn Successful");
           res.json({message:"Employee SignIn Successful"});
           }
        }
        else
        {
         console.log("Email you have entered has not registered or incorrect");
         return res.status(400).json({error:"Email you have entered has not registered or incorrect"});
        }
     }  
     catch(err)
     {
        console.log(err);
     }
 })
 
//to get data for employee
 router.get("/getData1",authenticate, (req,res) => 
 {
     res.send(req.rootUser);
 });

// handle GET request for all users
router.get('/users', (req, res) => {
  User2.find((err, users) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(users);
      }
    });
  });

// handle PUT request for editing a user
router.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    
    // find and update the user in the database
    User2.findByIdAndUpdate(userId, updatedUser, { new: true }, (err, user) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(`User ${user.name} updated successfully!`);
      }
    });
  });  

// handle DELETE request for deleting a user
router.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    
    // find and remove the user from the database
    User2.findByIdAndRemove(userId, (err, user) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(`User ${user.name} deleted successfully!`);
      }
    });
  });

  //sending gmail
  router.post('/send-notification', (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const work = req.body.work;
    const subject = 'WireHub-Job Appointment';
    const message = `
    Dear ${name},
    
    I am pleased to inform you that you have been selected for the position of ${work} at WireHub Company. We were impressed with your qualifications, experience, and enthusiasm for the role, and believe that you would be a great addition to our team.
    
    Your interview and application stood out among a competitive pool of candidates, and we are excited to offer you the job. Joining date will be revealed in upcoming mail.
    
    Once again, congratulations on your appointment to this exciting position at WireHub Company. We look forward to welcoming you to our team and working with you towards our mutual success.
    
    Best regards,
    
    Manager - WireHub
    Wirehub Company
    `;
  
    sendEmail(email, subject, message);
    res.send('Email sent');
  });
















//Add Product

router.post('/addproduct', upload1.single('image'), async (req, res) => {

  const { name, type, core, weight, price, discount, quantity } = req.body;
 
  if(!name || !type || !core || !weight || !price || !discount || !quantity)
  {
      console.log("please fill the field properly");
      return res.status(422).json({error: "please fill the field properly"});
  }

  try{
      const userExist = await User3.findOne({ name: name });
    
      if(userExist){
          console.log("Product already exists");
          return res.status(422).json({ error: "Product already exists"});
      }
  }
  catch(err){
    console.log(err);
  }

  const image = new User3({
    name: req.body.name,
    type: req.body.type,
    core: req.body.core,
    weight: req.body.weight,
    price: req.body.price,
    discount: req.body.discount,
    quantity: req.body.quantity,
    filename: req.file.filename,
    originalName: req.file.originalname,
    path: req.file.path,
  });
   const userimage = await image.save()
    if(userimage){
      console.log(image);
          console.log("Product Added successfully");
             res.status(201).json({ message: "Product Added successfully"});
    }
    else{
      console.log("failed to add Product");
          res.status(500).json({error: "failed to add Product"});
    };
});

//to get all data with images
router.get('/product/images', (req, res) => {
  User3.find()
    .sort('-created')
    .then((images) => {
      res.json(images);
    })
    .catch((err) => {
      res.status(500).json({ success: false, error: err.message });
    });
});

// handle GET request for all Products
router.get('/products', (req, res) => {
  User3.find((err, users) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(users);
    }
  });
});

// handle PUT request for editing a Products
router.put('/products/:id', (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;
  
  // find and update the Products in the database
  User3.findByIdAndUpdate(userId, updatedUser, { new: true }, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(`User ${user.name} updated successfully!`);
    }
  });
});  

// handle DELETE request for deleting a Products
router.delete('/products/:id', (req, res) => {
  const userId = req.params.id;
  
// find and remove the Products from the database
  User3.findByIdAndRemove(userId, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(`User ${user.name} deleted successfully!`);
    }
  });
});


//Export to app.js
module.exports = router;