'use strict';

const Vinyl = require('vinyl');
const { Transform } = require('stream');
const PluginError = require('plugin-error');

const fillPotPo = require('fill-pot-po');
const prepareOptions = require('fill-pot-po/src/options');

const PLUGIN_NAME = 'gulp-fill-pot-po';

/**
 * Run the PO generator.
 *
 * @param  {mixed} options
 *
 * @return {object} Writable and readable Node stream.Transform
 */
function gulpFillPotPo(options) {

	options = prepareOptions(options, false);

	// Create Node.js Transform stream
	const transformer = new Transform({
		objectMode: true,
		transform(file, encoding, done) {
			if ( ! (file instanceof Vinyl)) {
				return done(
					new PluginError( PLUGIN_NAME,
						'Only Vinyl objects can be transformed.'
					)
				);
			}

			if (file.isNull()) {
				// return done(
				// 	new PluginError( PLUGIN_NAME,
				// 		'Empty Vinyls are not supported.'
				// 	)
				// );
				return done(null, file);
			}

			if (file.isStream()) {
				return done(
					new PluginError( PLUGIN_NAME,
						'Streams are not supported.'
					)
				);
			}

			// Set filename if none present
			if (0 === file.path.replace(/^\.$/, '').length) {
				file.path = 'translations.pot';
				// Of course, this name has no significance
				if (options.domainFromPOTPath) {
					return done(
						new PluginError( PLUGIN_NAME,
							'Source POT file has no name to get domain from. Provide domain through option domain.\nAlso note: PO files assumed to be in the current working directory unless srcDir is set.'
						)
					);
				}
			}

			options.potSources = [ file ];

			// Sync
			// try {
			// 	const result = fillPotPo.sync(options);
			// 	result.forEach(return_file => {
			// 		this.push(return_file);
			// 	});
			// 	return done();
			// } catch (error) {
			// 	return done(error);
			// }

			// Async
			fillPotPo((result) => {
				if (result[0]) {
					result[1].forEach(return_file => {
						this.push(return_file);
					});
					return done();
				} else {
					return done(
						new PluginError( PLUGIN_NAME,
							result[1]
						)
					);
				}
			}, options);
		},
		flush(done) {
			done();
		},
	});

	return transformer;
}

module.exports = gulpFillPotPo;
