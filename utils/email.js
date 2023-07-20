
const nodemailer = require('nodemailer')
const nodemailerSendgrid = require('nodemailer-sendgrid');
const pug = require('pug');
const {htmlToText} = require('html-to-text');

module.exports = class Email {
    constructor(user, url){
        this.to = user.email; 
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Trek Tour <${process.env.EMAIL_FROM}>`;
    }

    newTransport(){
        if(process.env.NODE_ENV === 'production'){
            console.log(process.env.SENDGRID_PASSWORD);
            // Sendgrig
            return  nodemailer.createTransport(
                {service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME, 
                    pass: process.env.SENDGRID_PASSWORD
                }
            }
        
            )  
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST, 
            port:process.env.EMAIL_PORT, 
            auth: {
                user: process.env.EMAIL_USERNAME, 
                pass: process.env.EMAIL_PASSWORD
            },
            tls:{
                rejectUnauthorized:false
            }
    
        }) 
    }

    async send(template, subject) {
        // 1) Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
          firstName: this.firstName,
          url: this.url,
          subject
        });
    
        // 2) Define email options
        const mailOptions = {
          from: this.from,
          to: this.to,
          subject,
          html,
          text: htmlToText(html)
        };
    
        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
      }

    async sendWelcome(){
        await this.send('welcome', 'Welcome to the Trek Tour Family!'); 
    }

    async sendPasswrodReset(){
        await this.send('PasswordReset', 'Your Password Reset token (valid for 10 minutes')
    }
}

