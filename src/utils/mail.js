import Mailgen from "mailgen";
import nodemailer from "nodemailer"

const sendMail = async (options)=>{
    const mailGenrator = new Mailgen({
        theme : "default",
        products : {
            name : "Task Manager",
            link : "https://mailgen.js/",
        }
    });
    var emailText = mailGenrator.generatePlaintext(options.MailgenContent);
    var emailHTML = mailGenrator.generate(options.MailgenContent);

    const transporter = nodemailer.createTransport({
        host : process.env.MAILTRAP_SMTP_HOST,
        port : process.env.MAILTRAP_SMTP_PORT,
        secure : false, 
        auth : {
            user : process.env.MAILTRAP_SMTP_USER,
            pass : process.env.MAILTRAP_SMTP_PASS,
        },
    });
    const mail = {
        from : 'mail.taskmanager@example.com',
        to : options.email,
        subject : options.subject,
        text : emailText,
        html : emailHTML,
    };
    try {
        await transporter.sendMail(mail)
    } catch (error) {
        console.error("email failed", error)
    }
}

const emailVerificationMailGenContent = (username,verificationUrl)=>{
    return {
        body : {
            name : username,
            intro : "welcome to our App!",
            action : {
                instruction : "To get started with our App, please click here :",
                button : {
                    color : "#22BC66", // Optional action button
                    text : "verify your email",
                    link : verificationUrl,
                },
            },
            outro : "Need any help or have any question ?  Please reply on this mail "
        }
    }
}


const forgotPasswordMailGenContent = (username,passwordResetUrl)=>{
    return {
        body : {
            name : username,
            intro : "We got a request to change your password",
            action : {
                instruction : "to cahnge your password please click on the button :",
                button : {
                    color : "#22BC66", // Optional action button
                    text : "reset password ",
                    link : passwordResetUrl,
                },
            },
            outro : "Need any help or have any question ?  Please reply on this mail "
        }
    }
}