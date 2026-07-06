var nodemailer  = require('nodemailer');

const sendEmail = (receivers,subject,message)=>{

    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // upgrade later with
        service:'gmail',
        auth:{
            user:'bhuvaharikrushn4315@gmail.com',
            pass: 'tcaxpkljexiotrkl'
        }
    });
    

    var info = {
        from:'bhuvaharikrushn4315@gmail.com', // sender address
        to:receivers,// list of receivers
        subject:subject, // Subject line
        html:message, // plaintext body
    };

    transporter.sendMail(info,(error,result)=>{
        if(error){
            return console.log(error);
        }else{
            return console.log('Email sent: ' + result.messageId);
        }
    });


}

module.exports = sendEmail;