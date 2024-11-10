//require express 
const express = require('express');
const adminModel = require('../model/adminModel');
const adminController = require('../controller/adminController')
const adminAuth = require('../middleware/adminAuth')


const router = express()

router.get('/login',adminAuth.isLogin,adminController.loadLogin)
router.post('/login',adminController.login)

router.get('/dashboard',adminController.loadDashboard)

router.post('/edit-user',adminAuth.checkSession,adminController.userEdit)
router.get('/delete-user/:id',adminAuth.checkSession,adminController.deleteUser)
router.post('/add-user',adminAuth.checkSession,adminController.addUser)
router.get('/logout',adminAuth.checkSession,adminController.logout)
router.get('/search-users', adminController.searchUsers);





//making the routes as public
module.exports = router;
