var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;
var xmls = new XMLSerializer();
var qr = require('qr-image');
var fs = require('fs');
var base64 = require('base64-stream');

var data = fs.readFileSync("invitation.svg", 'utf8');
var doc = new DOMParser().parseFromString(data);

var title = "Dear Troels";
var code = "12345678";
var link = "https://www.married.dk?key=" + code;


var te = doc.getElementById("tspan4277");
te.textContent = "Dear Troels";

var ce = doc.getElementById("tspan4759");
ce.textContent = "code: " + code;

var qe = doc.getElementById("image166");
var qrcode_stream = qr.image(link, { type: 'png' }).pipe(base64.encode());
var qrcode_base64 = '';
qrcode_stream.on('data', function(data) { qrcode_base64 += data })
qrcode_stream.on('end', function() {
  qe.setAttribute("xlink:href", "data:" + "image/png" + ";base64," + qrcode_base64);  
  // Save the new svg
  fs.writeFileSync("invitation2.svg", xmls.serializeToString(doc), "utf8");
});