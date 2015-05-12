var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'wedding'
});

connection.connect();

connection.query('SELECT * from invitation', function(err, rows, fields) {
  if (!err)
    rows.forEach(function(row){
      if(row['language'] === 'English') { 
        generateInvitation("invitation.svg", "tmp/" + row['id'] + ".svg", {
          title: ['tspan4277', row['title']],
          code: ['tspan4759', "code: " +row['key']],
          link: ['image166', "https://www.married.dk/key=" + row['key']]
        });
      } else if(row['language'] === 'Latvian') {
        generateInvitation("invitation.svg", "tmp/" + row['id'] + ".svg", {
          title: ['tspan4277', row['title']],
          code: ['tspan4759', "code: " +row['key']],
          link: ['image166', "https://www.married.dk/?key=" + row['key']]
        });
      }
    });
    
  else
    console.log('Error while performing Query.');
});

connection.end();

function generateInvitation(template, outfile, fields) {
  var DOMParser = require('xmldom').DOMParser;
  var XMLSerializer = require('xmldom').XMLSerializer;
  var xmls = new XMLSerializer();
  var qr = require('qr-image');
  var fs = require('fs');
  var base64 = require('base64-stream');
  var data = fs.readFileSync("invitation.svg", 'utf8');
  var doc = new DOMParser().parseFromString(data);

  var te = doc.getElementById(fields['title'][0]);
  te.textContent = fields['title'][1];

  var ce = doc.getElementById(fields['code'][0]);
  ce.textContent = fields['code'][1];

  var qe = doc.getElementById(fields['link'][0]);
  var qrcode_stream = qr.image(fields['link'][1], { type: 'png' }).pipe(base64.encode());
  var qrcode_base64 = '';
  qrcode_stream.on('data', function(data) { qrcode_base64 += data })
  qrcode_stream.on('end', function() {
    qe.setAttribute("xlink:href", "data:" + "image/png" + ";base64," + qrcode_base64);  
    // Save the new svg
    fs.writeFileSync(outfile, xmls.serializeToString(doc), "utf8");
  });
}