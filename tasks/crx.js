'use strict';

var fs = require('fs'),
	crypto = require('crypto'),
	forge = require('node-forge');

function generateSignature(zipContents, privateKey) {
	return crypto
		.createSign('sha1')
		.update(zipContents)
		.sign(privateKey);
}

module.exports = function (grunt) {
	grunt.registerMultiTask('crx', 'Create crx extension archive for chrome from zip.', function () {
		var options = this.options({
				key: 'key.pem'
			}),
			done = this.async();

		var privateKeyPEM = fs.readFileSync(options.key, 'utf-8'),
			privateKey = forge.pki.privateKeyFromPem(privateKeyPEM),
			publicKey = forge.pki.setRsaPublicKey(privateKey.n, privateKey.e),
			publicKeyASN1 = forge.pki.publicKeyToAsn1(publicKey),
			publicKeyDER = forge.asn1.toDer(publicKeyASN1),
			key = new Buffer(publicKeyDER.bytes(), 'binary');

		grunt.util.async.forEachSeries(this.files, function (filePair, nextPair) {
			grunt.util.async.forEachSeries(filePair.src, function (src, nextFile) {
				var zip = fs.readFileSync(src),
					sig = generateSignature(zip, privateKeyPEM),
					keyLength = key.length,
					sigLength = sig.length,
					zipLength = zip.length,
					crxLength = 16 + keyLength + sigLength + zipLength,
					crx = new Buffer(crxLength);

				crx.write('Cr24' + new Array(13).join('\x00'), 'binary');

				crx[4] = 2;
				crx[8] = keyLength & 255;
				crx[9] = (keyLength >> 8) & 255;
				crx[12] = sigLength & 255;
				crx[13] = (sigLength >> 8) & 255;

				key.copy(crx, 16);
				sig.copy(crx, 16 + keyLength);
				zip.copy(crx, 16 + keyLength + sigLength);

				fs.writeFileSync(filePair.dest, crx);

				nextFile();
			});

			nextPair();
		}, done);
	});
};
