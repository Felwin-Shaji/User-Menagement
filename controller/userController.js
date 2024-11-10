const userSchema = require('../model/userModel');
const bcrypt = require('bcrypt')
const saltround =10;

const registerUser = async (req,res)=>{
    try{
        const {username,email,password} = req.body;
        const user = await userSchema.findOne({email}) 

        if(user) return res.render('user/register',{message:'User already exists'})

            const hashedPassword = await bcrypt.hash(password,saltround)

        const newUser = new userSchema({
                username,
                email,
                password:hashedPassword,

            })

        await newUser.save() // save data to DB
        res.render('user/login',{message:'User created Successfully'});

    }catch(error){
        res.render('user/register',{message:'something went wrong'})
    }
}

const login = async (req, res) => {
    try {
        const {email, password } = req.body; 

        const user = await userSchema.findOne({ email });
        console.log(user);
        

        if (!user) {
            return res.render('user/login', { message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render('user/login', { message: 'Incorrect password' });
        }

        req.session.user=email;

        //res.redirect('/user/home/:email');
        res.redirect('/user/home');

    } catch (error) {
        console.error("Error during login:", error);
        res.render('user/login', { message: 'Something went wrong' });
    }
};


const loadRegister = (req,res)=>{
    res.render('user/register')
}


const loadlogin = (req,res)=>{
    res.render('user/login')
}

const loadHome =(req,res)=>{
    res.render('user/userHome',{email:req.session.user});
}

const logout = (req,res)=>{
    req.session.user=null;
    res.redirect('/user/login')
}


module.exports = {
    registerUser,
    loadRegister,
    loadlogin,
    login,
    loadHome,
    logout,
}