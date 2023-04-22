var nodemailer =  require('nodemailer');

function sendMail (email, name, subject, message) {
    var transporter =  nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'arialcloudservice@gmail.com',
            pass: 'stkhddggiaafriii'
        }
    });
    var mainOptions = { 
        from: 'WEB XEM PHIM HAYPHIM.COM',
        to: email,
        subject: subject,
        html: message
    }
    transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log(err);
            return false
        } else {
            console.log('Message sent: ' +  info.response);
            return true
        }
    });
}
module.exports = {sendMail}

