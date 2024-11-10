const adminModel = require('../model/adminModel')
const bcrypt =require('bcrypt')
const userModel = require('../model/userModel');


const loadLogin = async (req,res)=>{
    res.render('admin/login')
}

const login = async (req,res)=>{
    try{
        const {email,password} = req.body;

        console.log('-----------------')
        console.log(req.body);
        
        console.log('-----------------')

        const admin = await adminModel.findOne({email})

        if(!admin) return res.render('admin/login',{message:"invalid credentiels"});

        const isMatch =await bcrypt.compare(password ,admin.password)

        console.log(isMatch)

        if(!isMatch) return res.render('admin/login',{message:"Wrong password"});

        req.session.admin = true;

        res.redirect('/admin/dashboard');
        
    }catch (error){
        res.send(error)
    }
}

const loadDashboard = async (req, res) => {
    try {
        const admin = req.session.admin;
        if (!admin) return res.redirect('/admin/login');
        const users = await userModel.find({}); 

        res.render('admin/dashboard', { users }); 
    } catch (error) {
        res.status(500).send('Something went wrong');
    }
};

const userEdit = async (req,res)=>{
    try{

        const {email,password,id,username}=req.body

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await userModel.findOneAndUpdate(
            { _id: id },                      // Query filter
            { $set: { email, password:hashedPassword, username } }, // Update operation
            { new: true }                      // Option to return the updated document
        );
        
        //const allUsers = await userModel.find({})
        
        res.redirect('/admin/dashboard')
        

    }catch(error){
        console.log(error);
        
    }
}

const deleteUser = async (req,res)=>{
    try{
        const {id} =req.params
        const user = await userModel.findOneAndDelete({_id:id})

        res.redirect('/admin/dashboard')
    }catch(error){
        console.log(error)
    }
}

const addUser =async (req,res)=>{
    try{

        const {email,username,password} = req.body

        console.log(email)

        const user = await userModel.findOne({ email });
        


        //if(user) return res.redirect('/admin/dashboard')
        if (user) {
            return res.redirect('/admin/dashboard?error=User already exists with this email.');
        }
        

        
        
        
        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = new userModel({
            email,
            username,
            password:hashedPassword,
        }) 

        await newUser.save()

        res.redirect('/admin/dashboard')

    }catch(error){
        console.log(error);
        
    }
}

const logout = async (req,res)=>{
    req.session.admin = null;
    res.redirect('/admin/login')
}

const searchUsers = async (req, res) => {
    try {
        const query = req.query.query; 

        let users = [];
        let isSearch = false;

        if (query) {
            users = await userModel.find({ email: { $regex: query, $options: "i" } });
            console.log(users)
            isSearch = true;
        } else {
            users = await userModel.find({});
        }

        res.render("admin/dashboard", { users, isSearch }); 
    } catch (error) {
        console.error(error);
        res.render("admin/dashboard", { users: [], message: "Error fetching users" });
    }
};




module.exports ={
    loadLogin,
    login,
    loadDashboard,
    userEdit,
    deleteUser,
    addUser,
    logout,
    searchUsers
}