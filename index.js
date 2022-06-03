'use strict';

const Vinyl = require('vinyl');
const { Transform } = require('stream');

const fillPotPo = require('fill-pot-po');
const prepareOptions = require('fill-pot-po/src/options');
const PluginError = require('fill-pot-po/src/plugin-error');

/**
 * Run the PO generator.
 *
 * @param  {mixed} options
 *
 * @return {object} Writable and readable Node stream.Transform
 */
function gulpFillPotPo(options) {

	options = prepareOptions(options, false);

	const transformer = new Transform({
		objectMode: true,
		transform(file, encoding, done) {
			if (file.isNull()) {
				return done(null, file);
			}
			if (file.isStream()) {
				this.emit('error', new PluginError('Streams are not supported.'));
			}

			if (file instanceof Vinyl) {
				// Set filename if none present
				if (0 === file.path.replace(/^\.$/, '').length) {
					file.path = 'translations.pot';
					// Of course, this name has no significance
					if (options.domainFromPOTPath) {
						this.emit('error', new PluginError('Source POT file has no name to get domain from. Provide domain through option domain.'));
					}
				}

				options.potSources = [ file ];
			} else {
				// Fallback
				options.potSources = [ file.path ];
			}

			try {

				// Sync
				// const result = fillPotPo.sync(options);
				// result.forEach(po => {
				// 	const po_file = new Vinyl({
				// 		contents: Buffer.from(po[1]),
				// 		path: po[0]
				// 	});
				// 	this.push( po_file );
				// });
				// return done();

				// Async
				fillPotPo((result) => {
					if (result[0]) {
						result[1].forEach(po => {
							const po_file = new Vinyl({
								contents: Buffer.from( po[1] ),
								path: po[0]
							});
							this.push(po_file);
						});
						return done();
					} else {
						return done(result[1]);
					}
				}, options);

			} catch (error) {
				return done(error);
			}
		},
		flush(done) {
			done();
		},
	});

	return transformer;

}

module.exports = gulpFillPotPo;
