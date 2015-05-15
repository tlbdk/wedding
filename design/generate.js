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
    rows.every(function(row){
      if(row['language'] === 'English') { 
        generateInvitation("invitation_en.svg", "tmp/" + row['id'] + ".svg", {
          title: ['tspan4678', row['title']],
          code: ['tspan4682', row['key']],
          link: ['image232', "https://www.married.dk/#?key=" + row['key']]
        });
        return false;
      } else if(row['language'] === 'Latvian') {
        /* generateInvitation("invitation_lv.svg", "tmp/" + row['id'] + ".svg", {
          title: ['', row['title']],
          code: ['', row['key']],
          link: ['', "https://www.married.dk/?key=" + row['key']]
        }); */
      }
      
      return true;
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
  var data = fs.readFileSync(template, 'utf8');
  var doc = new DOMParser().parseFromString(data);

  var te = doc.getElementById(fields['title'][0]);
  //console.log(d);
  te.textContent = fields['title'][1];

  var ce = doc.getElementById(fields['code'][0]);
  ce.textContent = fields['code'][1];

  var qe = doc.getElementById(fields['link'][0]);
  var qrcode_stream = qr.image(fields['link'][1], { 
    type: 'png', ec_level: 'H', margin: 0, parse_url: false, size: 100,
    customize: function(bitmap) {
      console.log(bitmap.data.length);
      for(var i = 0; i < bitmap.data.length; i++) {
        if(bitmap.data[i] === 0) {
          bitmap.data[i] = 160;
        }
      }
    }
  }).pipe(base64.encode());
  var qrcode_base64 = '';
  qrcode_stream.on('data', function(data) { qrcode_base64 += data })
  qrcode_stream.on('end', function() {
    qe.setAttribute("xlink:href", "data:" + "image/png" + ";base64," + qrcode_base64);  
    // Save the new svg
    fs.writeFileSync(outfile, xmls.serializeToString(doc), "utf8");
    // TODO: Convert to PDF, remember to convert to paths for the fonts
  });
}