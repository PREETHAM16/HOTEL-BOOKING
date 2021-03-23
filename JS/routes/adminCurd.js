const express=require('express');
const router1=express.Router();
const mysql=require('mysql');

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'hotl'
});

var c;
var r='numOfVariant';
router1.post('/curd/insert/VPF',(req,res)=>{
let sq=`SELECT * FROM roomVariant`;
db.query(sq,(erro,resu)=>{
let sql=`INSERT INTO roomVariant VALUES (${resu.length+1},${req.body.typeId},'${req.body.variant}',${req.body.price},'${req.body.description}','${req.body.facilities}')`;
db.query(sql,(err,result)=>{
    c=r+(resu.length+1);
    if(err)throw err;
    let sql1=`ALTER TABLE booking ADD COLUMN ${c} VARCHAR(50)`;
    db.query(sql1,(error,resul)=>{
        if(error)throw error;
    });
     res.redirect('/homeAdmin/next/ins');
    }); 
});
});

router1.post('/curd/insert/roomNumber',(req,res)=>{
    let s=req.body.roomNo.split(",");
    let l=s.length;
    let c=0;
    s.forEach(room => {
        let n=parseInt(room);
        let sql=`INSERT INTO rooms (roomNumber,roomVariantId,roomStatusId) VALUES (${n},${req.body.variantId},${1})`;
        db.query(sql,(err,result)=>{
            if(err)throw err;
            c++;
            if(c==l)res.redirect('/homeAdmin/next/ins');
        });
});
    
});


     

//curd Update
router1.post('/curd/update/variantPrice',(req,res)=>{
    let sql=`UPDATE roomVariant SET price=${req.body.price} WHERE variantId=${req.body.variantId}`;
     db.query(sql,(err,result)=>{
         if(err)throw err;
         res.redirect('/homeAdmin/next/ins');
     });
});

router1.post('/curd/update/roomNumberVariant',(req,res)=>{
    let s=req.body.roomNo.split(",");
    let l=s.length;
    let c=0;
    s.forEach(room => {
        n=parseInt(room);
   let sql=`UPDATE rooms SET roomVariantId=${req.body.variantId} where roomNumber=${n}`;
db.query(sql,(err,result)=>{
    if(err)throw err;
    c++;
    if(c==l)res.redirect('/homeAdmin/next/ins');
        });     
    });
});

router1.post('/curd/update/facilities',(req,res)=>{
    let sql=`UPDATE roomVariant SET description='${req.body.description}',facilities='${req.body.facilities}' where variantId=${req.body.variantId}`;
    db.query(sql,(err,result)=>{
        if(err)throw err;
        res.redirect('/homeAdmin/next/ins');
    });
});

router1.post('/curd/delete/VPF',(req,res)=>{
    let sql=`DELETE FROM roomVariant where variantId=${parseInt(req.body.variantId)}`;
    db.query(sql,(err,result)=>{
        if(err)throw err;
        let rv='numOfVariant'+req.body.variantId;
        let sql1=`ALTER TABLE booking DROP COLUMN ${rv}`;
        db.query(sql1,(err1,result1)=>{
            if(err1)throw err1;
            let sql2=`DELETE FROM rooms WHERE roomVariantId=${parseInt(req.body.variantId)}`;
            db.query(sql2,(err2,result2)=>{
                if(err2)throw err2;
                res.redirect('/homeAdmin/next/ins');
            });
        });
    });
});

router1.post('/curd/delete/roomNumber',(req,res)=>{
    let s=req.body.roomNumber.split(",");
    let l=s.length;
    let c=0;
    s.forEach(room =>{
        let n=parseInt(room);
let sql=`DELETE FROM rooms where roomNumber=${n}`;
db.query(sql,(err,result)=>{
    if(err)throw err;
    c++;
    if(c==l)res.redirect('/homeAdmin/next/ins');
    });
    });
});

module.exports=router1;