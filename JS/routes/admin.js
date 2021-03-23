const express=require('express');
const router=express.Router();
const mysql=require('mysql');

var incrct=''; 
var sucins='';

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'hotl'
});

router.get('/homeAdmin',(req,res)=>{
    let sql=`CREATE TABLE IF NOT EXISTS admin (name VARCHAR(50),password VARCHAR(25),PRIMARY KEY(name))`;
    db.query(sql,(err,result)=>{
        if(err)throw err;
    });
    let sql1=`CREATE TABLE IF NOT EXISTS userDetails (userId INT,name VARCHAR(50),gmail VARCHAR(250),mobileNumber VARCHAR(12),PRIMARY KEY(userId))`;
    let sql2=`CREATE TABLE IF NOT EXISTS roomVariant (variantId INT,roomTypeId INT,variant VARCHAR(25),price INT,description VARCHAR(100),facilities VARCHAR(50),PRIMARY KEY(variantId))`;
    let sql3=`CREATE TABLE IF NOT EXISTS rooms (roomNumber INT,roomVariantId INT,roomStatusId INT,userId INT,PRIMARY KEY(roomNumber))`;
    let sql4=`CREATE TABLE IF NOT EXISTS booking (ID INT AUTO_INCREMENT,userId INT,bookingDate VARCHAR(50),fromd VARCHAR(50),tod VARCHAR(50),PRIMARY KEY(ID))`;
    db.query(sql1,(err,res)=>{if(err) throw err});
    db.query(sql2,(err,res)=>{if(err) throw err});
    db.query(sql3,(err,res)=>{if(err) throw err});
    db.query(sql4,(err,res)=>{if(err) throw err});

res.render('adminlogin',{incorrect:incrct});
incrct='';
});


router.post('/homeAdmin/next',(req,res)=>{
let sql=`SELECT * FROM admin WHERE name='${req.body.user_lname}' and password='${req.body.user_lpassword}'`;
db.query(sql,(err,result)=>{
    if(err)throw err;
    if(result.length>0){ 
        res.redirect('/homeAdmin/next/ins');
        sucins="";
        let sql1=`CREATE TABLE IF NOT EXISTS RoomType (roomTypeId INT,roomType VARCHAR(3),PRIMARY KEY(roomTypeId))`;
        db.query(sql1,(err,result)=>{
            if(err)throw err;
            let sq=`SELECT * FROM RoomType`
            db.query(sq,(err,result)=>{
                if(err)throw err;
                if(result.length==0){
                            let sql2=`INSERT INTO RoomType VALUES ('${1}','AC'),('${2}','NAC')`;
                            db.query(sql2,(err,result)=>{
                                if(err)throw err;
                                console.log('RoomType values inserted');
                                                        });
                            }
            });    
        });
        let sql3=`CREATE TABLE IF NOT EXISTS RoomStatus (roomStatusId INT,roomStatus VARCHAR(15),PRIMARY KEY(roomStatusId))`;
        db.query(sql3,(err,result)=>{
            if(err) throw err;
        });
        let s=`SELECT * FROM Roomstatus`;
        db.query(s,(err,result)=>{
            if(err)throw err;
            if(result.length==0){
                let sql4=`INSERT INTO RoomStatus VALUES ('${1}','AVAILABLE'),('${2}','BOOKED')`;
                db.query(sql4,(err,result)=>{
                    if(err)throw err;
                    console.log('RoomStatus Type values inserted');
                                            }); 
                                    }
        });

    }
        else{
        incrct='Incorrect User Name or Password'
        res.redirect('/homeAdmin');
     }
});
});


module.exports=router;