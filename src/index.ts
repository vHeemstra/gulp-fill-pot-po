import Vinyl from 'vinyl';
import { Transform } from 'node:stream';
import PluginError from 'plugin-error';

import fillPotPo from 'fill-pot-po';
// import { sync as fillPotPoSync } from 'fill-pot-po';
import { prepareOptions } from 'fill-pot-po';

const PLUGIN_NAME = 'gulp-fill-pot-po';

/**
 * Run the PO generator.
 *
 * @param  {mixed} options
 *
 * @return {object} Writable and readable Node stream.Transform
 */
const gulpFillPotPo = (options) => {
  options = prepareOptions(options);

  // Create Node.js Transform stream
  const transformer = new Transform({
    objectMode: true,
    transform(file, encoding, done) {
      if (!(file instanceof Vinyl)) {
        return done(
          new PluginError(PLUGIN_NAME, 'Only Vinyl objects can be transformed.')
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
        return done(new PluginError(PLUGIN_NAME, 'Streams are not supported.'));
      }

      // Set filename if none present
      if (0 === file.path.replace(/^\.$/, '').length) {
        file.path = 'translations.pot';
        // Of course, this name has no significance
        if (options.domainFromPOTPath) {
          return done(
            new PluginError(
              PLUGIN_NAME,
              'Source POT file has no name to get domain from. Provide domain through option domain.\nAlso note: PO files assumed to be in the current working directory unless srcDir is set.'
            )
          );
        }
      }

      options.potSources = [file];

      // Sync
      // try {
      // 	const result = fillPotPoSync(options);
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
          result[1].forEach((return_file) => {
            this.push(return_file);
          });
          return done();
        } else {
          return done(new PluginError(PLUGIN_NAME, result[1] as string));
        }
      }, options);
    },
    flush(done) {
      done();
    },
  });

  return transformer;
};

export default gulpFillPotPo;
