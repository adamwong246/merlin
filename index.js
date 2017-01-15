const fs = require("fs");
var ofx = require('ofx');

fs.readFile('./data/Checking1.qfx', 'utf8', function(err, ofxData) {
    if (err) throw err;

    var data = ofx.parse(ofxData);
    console.log(JSON.stringify(data, null, 2))
    // console.log(data.header)
    // console.log(data.OFX);
    // console.log(data.OFX.SIGNONMSGSRSV1);
    // console.log(data.OFX.BANKMSGSRSV1);
});
