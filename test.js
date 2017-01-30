'use strict';

if (!process.env.SENDGRID_API_KEY) {
    console.error("SENDGRID_API_KEY isn't set.");
    return;
}

let helper = require('sendgrid').mail;
let sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
let fs = require('fs');

var mail = new helper.Mail();
var email = new helper.Email('test@example.com', 'Example User');
mail.setFrom(email);

mail.setSubject('Hello World from the SendGrid Node.js Library');

var personalization = new helper.Personalization();
email = new helper.Email('jjgjoojis@gmail.com', 'JinGyeong Jeong');
personalization.addTo(email);
mail.addPersonalization(personalization);

var content = new helper.Content('text/html', '<html><body>some text here</body></html>')
mail.addContent(content);

var attachment = new helper.Attachment();
var file = fs.readFileSync('758C_test.pdf');
var base64File = new Buffer(file).toString('base64');
attachment.setContent(base64File);
attachment.setType('application/pdf');
attachment.setFilename('758C.pdf');
attachment.setDisposition('attachment');
mail.addAttachment(attachment);

var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mail.toJSON(),
});

sg.API(request, function(err, response) {
  console.log(response.statusCode);
  console.log(response.body);
  console.log(response.headers);
});