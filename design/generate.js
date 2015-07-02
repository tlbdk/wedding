var mysql = require('mysql');
var async = require('async');
var exec = require('child_process').exec;

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'wedding'
});

connection.connect();

connection.query('SELECT * from invitation', function(err, rows, fields) {
  if (!err) {
    var pdfs = [];
    async.eachLimit(rows, 4, function(row, callback){
      console.log(row['title']);
      if(row['language'] === 'English') { 
        generateInvitation("invitation_en-simple.svg", "tmp/" + row['id'], {
          title: ['tspan4678', row['title']],
          code: ['tspan4682', row['key']],
          link: ['image232', "https://www.married.dk/#?key=" + row['key']]
        }, callback);
      
      } else if(row['language'] === 'Latvian') {
        if(row['conjugation'] === 'Plural') {
          generateInvitation("invitation_lv_plural.svg", "tmp/" + row['id'], {
            title: ['tspan4678', row['title']],
            code: ['tspan4682', row['key']],
            link: ['image254', "https://www.married.dk/#?key=" + row['key']]
          }, callback);
        } else if(row['conjugation'] === 'Plural Female') {
          generateInvitation("invitation_lv_plural_female.svg", "tmp/" + row['id'], {
            title: ['tspan4678', row['title']],
            code: ['tspan4682', row['key']],
            link: ['image254', "https://www.married.dk/#?key=" + row['key']]
          }, callback);
        } else if(row['conjugation'] === 'Singular Female') {
          generateInvitation("invitation_lv_singular_female-simple.svg", "tmp/" + row['id'], {
            title: ['tspan4678', row['title']],
            code: ['tspan4682', row['key']],
            link: ['image256', "https://www.married.dk/#?key=" + row['key']]
          }, callback);
        } else if(row['conjugation'] === 'Singular Male') {
          generateInvitation("invitation_lv_singular_male-simple.svg", "tmp/" + row['id'], {
            title: ['tspan4678', row['title']],
            code: ['tspan4682', row['key']],
            link: ['image256', "https://www.married.dk/#?key=" + row['key']]
          }, callback);
        } else {
          console.log("did not match template conjugation: " + row['conjugation']);
        }
        //return false;
      } else {
        console.log("did not match template language: " + row['language']);
      }
      pdfs.push("tmp/" + row['id'] + ".pdf");
      
    }, function(err){
      if (err) return;
      exec("pdftk " + pdfs.join(" ") + " cat output tmp/invitations.pdf", function (error, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        console.log("done");
      });
    });
    
  } else {
    console.log('Error while performing Query.');
  }
});

connection.end();

function generateInvitation(template, outfile, fields, callback) {
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
      //console.log(bitmap.data.length);
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
    //console.log(template + "\n");
    qe.setAttribute("xlink:href", "data:" + "image/png" + ";base64," + qrcode_base64);  
    // Save the new svg
    fs.writeFileSync(outfile + ".svg", xmls.serializeToString(doc), "utf8");
    exec('inkscape -z --export-dpi=300 --export-text-to-path -f ' + outfile + '.svg --export-pdf=' + outfile + ".pdf", function (error, stdout, stderr) {
      //fs.unlinkSync(outfile + ".svg");
      callback();
    });
  });
}