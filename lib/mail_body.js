const sign_up = function(email, sv){
    return `
    <div style="padding-top : 5vh ;height : 85vh; padding-bottom : 5vh ;background-color:rgb(70,110,229)">
        <div
            style="
                width:50%; height:75vh; 
                margin:auto;
                background-color:white;
                border-radius: 5px;text-align: center;
                box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
                -webkit-box-shadow:rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;">
                <img src="https://cdn.sforum.vn/sforum/wp-content/uploads/2018/11/2-10.png"
                    width="200px" style="margin-top: 5vh">
                    <h3> <b>Verify Your email address</b> </h3>
                    <p>You"ve entered <b>${email}</b> as the email address for your account </p>
                    <p>Please Verify this email address by clicking button below</p>
                    <a href="http://localhost:5000/api/v1/auth/verify?email=${email}&crb=${sv}" style="background-color: rgb(0,128,255); border: none; color: white; border-radius : 5px;
                        padding: 15px 32px;
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: 16px;
                        margin: 4px 2px;
                        cursor: pointer; margin-top: 5vh;">Verify your email</a>
                        <p> Have a nice day</p>
        </div>
    </div>
    `
}

module.exports = {sign_up}