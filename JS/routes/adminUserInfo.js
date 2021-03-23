const express=require('express');
const router2=express.Router();
const mysql=require('mysql');

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'hotl'
});

router2.get('/adminUserInfo/delete/:roomNo/:uid/:roomVar',(req,res)=>{
    let uid=parseInt(req.params.uid);
    let roomNo=parseInt(req.params.roomNo);
    let roomVar=req.params.roomVar;
    let sql=`UPDATE rooms SET roomStatusId=${1},userId=NULL WHERE roomNumber=${roomNo}`;
    db.query(sql,(err,result)=>{
        let sql1=`SELECT * FROM rooms WHERE userId=${uid}`;
        db.query(sql1,(err1,result1)=>{
            console.log('in sql1');
            if(err1)throw err1;
            if(result1.length==0){
                console.log('in IF block');
                let sql3=`DELETE FROM booking WHERE userId=${uid}`;
                db.query(sql3,(err3,result3)=>{
                    console.log('in sql3');
                    if(err3)throw err3;
                    let sql4=`DELETE FROM userDetails WHERE userId=${uid}`;
                    db.query(sql4,(err4,result4)=>{
                        console.log('in sql4');
                        if(err4)throw err4;
                        let sql5=`UPDATE booking SET userId=userId${-1} WHERE userId>${uid}`;
                        db.query(sql5,(err5,result5)=>{
                            console.log('in sql5');
                            if(err5)throw err5;
                            let sql6=`UPDATE userDetails SET userId=userId${-1} WHERE userId>${uid}`;
                            db.query(sql6,(err6,result6)=>{
                                console.log('in sql6');
                                if(err6)throw err6; 
                                let sql7=`UPDATE rooms SET userId=userId${-1} WHERE userId>${uid}`;
                                db.query(sql7,(err7,result7)=>{
                                    if(err7)throw err7;
                                    return  res.redirect('/homeAdmin/usersInfo');
                                });
                            });
                        });
                    });
                });
            }
            else{
                console.log('in Else block');
                let sql2=`UPDATE booking SET ${roomVar}=${roomVar}${-1} WHERE userId=${req.params.uid}`;
                db.query(sql2,(err2,result2)=>{
                    console.log('in sql2');
                    if(err2)throw err2;
                    res.redirect('/homeAdmin/usersInfo');
                });
            }

        });
    });
});

router2.post('/adminUserInfo/extend/:uid',(req,res)=>{
    let sql=`UPDATE booking SET tod='${req.body.date}' WHERE userId=${req.params.uid}`;
    db.query(sql,(err,result)=>{
        if(err)throw err;
        res.redirect('/homeAdmin/usersInfo');
    });
});

module.exports=router2;