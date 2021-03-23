const express=require('express');
const app=express();
const bp=require('body-parser');
const mysql=require('mysql');
const adminRoutes=require('./routes/admin');
const adminCurdRoutes=require('./routes/adminCurd');
const adminUserInfoRoute=require('./routes/adminUserInfo');
var nodemailer=require('nodemailer');

var sucins="";
var roomNumMat=[];
var roomExst='';
var ins1={};
var ins2={};
var ins3={};
var ins4=[];
var userDetails=[];
var roomCount=[];
var bode={}
var usrinfo={}
var otp;

app.set('view engine','ejs');
app.use(bp.urlencoded({extended:false}));
app.use(express.static('public'));

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'hotl'
});
db.connect((err)=>{
    if(err)throw err;
    console.log('sucessfully connected');
});

function Quer(x,res){
    let sql1=`SELECT * FROM roomVariant`;
    db.query(sql1,(err,result)=>{
        if(err)throw err;
        ins1=result;
        if(x==0)res.render('home',{inse1:ins1});
        let sql=`SELECT * FROM rooms`;
        db.query(sql,(error,resu)=>{
            if(error)throw error;
            ins2=resu;
            if(x==2)res.render('adminLogInSuccessfull',{inse1:ins1,inse2:ins2});
            else if(x==3){
                let sql4=`SELECT * FROM booking`;
                db.query(sql4,(err4,result4)=>{
                    if(err4)throw err4;
                    bode=result4;
                    let sql5=`SELECT * FROM userDetails`;
                    db.query(sql5,(err5,result5)=>{
                        if(err5)throw err5;
                        usrinfo=result5;
                        console.log('userinfo',usrinfo);
                        res.render('adminUsersInfo',{inse1:ins1,inse2:ins2,bookDet:bode,userInfo:usrinfo});
                    });
                });
            }
            else if(x==1){
                ins4=[];
                for(let i=0;i<ins1.length;i++){
                    let sql3=`SELECT roomNumber FROM rooms WHERE roomVariantId=${i+1} AND roomStatusId=${1}`;
                    db.query(sql3,(erro,resl)=>{
                        if(erro)throw erro;
                        ins4.push(resl.length);
                        if(i==ins1.length-1)dis(res);
                    });  
                }   
                function dis(res){
                  res.render('roombooking',{inse1:ins1,inse4:ins4});  
                }
            }
      
        });
    });
}

app.get('/home',(req,res)=>{ 
    Quer(0,res);
});

app.get('/roomBooking',(req,res)=>{
   Quer(1,res);
});

//otp page
function mailIt(otp,ud){
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'chpprshm@gmail.com',
        pass: 'Preethamreddy@12'
      }
    });
    if(otp==1){
        let s=''
        console.log(ud[2]);
        for(let k=0;k<ud[2].length;k++){
            let a='Non AC';
            if(ud[0][ud[2][k].roomVariantId-1].roomTypeId==1)a='AC'
            s+=ud[0][ud[2][k].roomVariantId-1].variant+' '+a+'    '+'Room '+ud[2][k].roomNumber+' '+ins1[ud[2][k].roomVariantId-1].price+'<br><br>';
        }
        console.log('s',s);
        var mailOptions = {
            from: 'chpprshm@gmail.com',
            to: `${ud[1][1]}`,
            subject: 'Successfully Booked',
            html: `<body style='background: linear-gradient(90deg, rgb(6, 65, 121) 0%, rgb(11, 118, 151) 42%, rgb(6, 192, 145) 100%);height:800px;text-align:center;color:white'>
                    <h1 style='color:goldenrod'>PR Hotels</h1><br>
                    <h3 style='color:black;font-size:30px;'>Booked Rooms<h3>
                    <h3>${s}</h3>
                    <h3><h3 style="color:black;font-size:20px;">Booked On :</h3> ${ud[3][ud[3].length-1].bookingDate}</h3>
                    <h3><h3 style="color:black;font-size:20px;">From :</h3> ${ud[3][ud[3].length-1].fromd}</h3>
                    <h3><h3 style="color:black;font-size:20px;">To :</h3> ${ud[3][ud[3].length-1].tod}</h3>
                    </body>`      
        };       
    }
    else{
        var mailOptions = {
        from: 'chpprshm@gmail.com',
        to: `${ud[1]}`,
        subject: 'OTP Verification',
        html: `<div style="text-align:center;margin:5%;"><h3 style='color:purple'> Hi , ${ud[0]} Your OTP for Booking The Room in PR hotel is.</h3>
            <h2 style='color:green;border-color:black;'>${otp}</h2></div>`      
    };    
    }

    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}
var errorotp='';
app.get('/otpVerification',(req,res)=>{
    console.log(userDetails);
    res.render('otp',{usersDetails:userDetails,er:errorotp});
    errorotp=''
});

app.get('/successfullyBooked',(req,res)=>{
    console.log(userDetails);
    let sql1=`SELECT * FROM booking`;
    db.query(sql1,(err1,result1)=>{
        if(err1)throw err1;
    let sql=`SELECT * FROM rooms WHERE userId=${result1.length}`;
    db.query(sql,(err,result)=>{
        console.log('result',result);
        console.log('ins1',ins1);
        let fn=[ins1,userDetails,result,result1]
        mailIt(1,fn); 
        console.log(fn)
    });
  });
    res.render('successfullyBooked');
});

function toDaysDate(){
        const monthNames = ['01', '02', '03', '04', '05','06','07', '08', '09', '10', '11','12'];
        const dateObj = new Date(); 
        const month = monthNames[dateObj.getMonth()]; 
        const day = String(dateObj.getDate()).padStart(2, '0'); 
        const year = dateObj.getFullYear(); 
        const date=  year+'-'+month+'-'+day;  
        return date;  
}
app.post('/otpVerification/checked',(req,res)=>{
    if(otp==parseInt(req.body.otp)){
        let date=toDaysDate();
        let sq=`SELECT * FROM userdetails`;
        db.query(sq,(error,resu)=>{
            if(error)throw error;
          
            let sql=`INSERT INTO userDetails VALUES (${resu.length+1},'${userDetails[0]}','${userDetails[1]}',${parseInt(userDetails[2])})`;
            db.query(sql,(err,result)=>{
                if(err)throw err;
              
                let sql1=`INSERT INTO booking (userId,bookingDate,fromd,tod) VALUES (${resu.length+1},'${date}','${userDetails[3]}','${userDetails[4]}')`;
                db.query(sql1,(err1,result1)=>{
                  
                    if(err1)throw err1;
                    for(let nv=0;nv<ins1.length;nv++){
                        let nr='numOfVariant'+(nv+1)
                        let sql2=`UPDATE booking SET ${nr}=${userDetails[nv+5]} where userId=${resu.length+1}`;
                        db.query(sql2,(err2,result2)=>{
                            
                        if(err2)throw err2;
                         });
                    let sql4=`UPDATE rooms SET roomStatusId=${2},userId=${resu.length+1} WHERE roomVariantId=${nv+1} AND roomStatusId=${1} LIMIT ${userDetails[nv+5]}`;
                    db.query(sql4,(err3,result3)=>{
                        console.log('In sql4');
                        if(err3)throw err3;
                        if(nv==ins1.length-1) rend()
                         });
                     }      
                     function rend(){
                        res.redirect('/successfullyBooked');
                    }

            });
      });
    });
    
    }
    else{
        errorotp='Entered Wrong OTP';
        res.redirect('/otpVerification');
    }
});
app.post("/otpVerification/again",(req,res)=>{
    otp=Math.floor(100000+Math.random()*900000);
    mailIt(otp,userDetails);
    res.redirect('/otpVerification');
});

app.post('/confirmationPage',(req,res)=>{
    userDetails=[];
    for(var propt in req.body){
        let ch=req.body[propt];
        if(propt.includes('room'))ch=parseInt(ch);
        userDetails.push(ch);
    }
    res.render('confirmation',{inse1:ins1,usersDetails:userDetails});
});
//admin
app.use(adminRoutes);

//adminHome
app.get('/homeAdmin/next/ins',(req,res)=>{
    Quer(2,res);
});
//adminUserInfo
app.get('/homeAdmin/usersInfo',(req,res)=>{
    Quer(3,res);
});

//adminUserInfoRoute
app.use(adminUserInfoRoute);

//Curd Route
app.use(adminCurdRoutes);

app.listen(3210);