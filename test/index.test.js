'use strict';

const gulpFillPotPo = require('../');
const { testOptions } = require('fill-pot-po');

const { sync: matchedSync } = require('matched');
const fs = require('fs');
const Vinyl = require('vinyl');

const input_dir = 'test/examples/input/';
const expected_dir = 'test/examples/output_correct/';
const test_dir = 'test/examples/output/fa';

const pot_source_path = `${input_dir}text-domain.pot`;
const pot_source_buffer = fs.readFileSync(pot_source_path);
const pot_source_vinyl = new Vinyl({
	contents: Buffer.from(pot_source_buffer),
	path: pot_source_path
});

const po_sources_path = `${input_dir}*.po`;
const expected_po_domain = fs.readFileSync(`${expected_dir}text-domain-nl_NL.po`);
const expected_po_no_domain = fs.readFileSync(`${expected_dir}nl_NL.po`);

/**
 * Delete all temporary testing folders and files.
 *
 * @return {void}
 */
function clearOutputFolder() {
	let files = matchedSync([
		`${test_dir}*`,
	]);
	files.sort((a, b) => {
		const a_len = a.split(/\//);
		const b_len = b.split(/\//);
		return b_len - a_len;
	});
	for (const file of files) {
		fs.rmSync(file, {recursive: true});
	}
}

beforeAll(() => {
	clearOutputFolder();
});

afterAll(() => {
	clearOutputFolder();
});

describe('index.js › single POT', () => {

	let folder_i = 0;

	/* eslint-disable jest/no-done-callback */

	describe('auto domain | auto srcDir | no write', () => {
		it('should produce 1 correct PO file', done => {
			// Set options
			const options = {
				...testOptions,
				// poSources: null,          // def: null
				// srcDir: input_dir,        // def: ''
				// domainInPOPath: false,    // def: true
				// domainFromPOTPath: false, // def: true
				// domain: 'text-domain',    // def: ''
				// srcGlobOptions: {},       // def: {}
				// returnPOT: true,          // def: false
				writeFiles: false,           // def: true
				// destDir: test_dir,        // def: ''
			};

			// Create the plugin stream
			let fillPotPo;
			try {
				expect(() => {
					fillPotPo = gulpFillPotPo(options);
				}).not.toThrow();
			} catch (jest_error) {
				done(jest_error);
			}

			// Keep count of output files
			let cnt = 0;

			// When outputing a new file
			fillPotPo.on('data', file => {
				cnt++;

				try {
					// Make sure it came out the same way it went in
					expect(file.isBuffer()).toBe(true);

					// Check the contents
					expect(file.contents.equals(expected_po_domain)).toBe(true);

					// done(); // called in the end event listener
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// On error
			fillPotPo.on('error', error => {
				try {
					// Fail on error
					expect(error).toEqual(null);

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// When all is finished
			fillPotPo.on('end', () => {
				try {
					// Only one output PO file
					expect(cnt).toEqual(1);

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// Start processing POT file
			fillPotPo.end(pot_source_vinyl);
		});
	});

	describe('manual domain | set srcDir | no write', () => {
		it('should produce 1 correct PO file', done => {
			// Set options
			const options = {
				...testOptions,
				srcDir: input_dir,
				writeFiles: false,
				domainFromPOTPath: false,
				domain: 'text-domain',
			};

			// Create the plugin stream
			let fillPotPo;
			try {
				expect(() => {
					fillPotPo = gulpFillPotPo(options);
				}).not.toThrow();
			} catch (jest_error) {
				done(jest_error);
			}

			// Keep count of output files
			let cnt = 0;

			// When outputing a new file
			fillPotPo.on('data', file => {
				cnt++;

				try {
					// Make sure it came out the same way it went in
					expect(file.isBuffer()).toBe(true);

					// Check the contents
					expect(file.contents.equals(expected_po_domain)).toBe(true);

					// done(); // called in the end event listener
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// On error
			fillPotPo.on('error', error => {
				try {
					// Fail on error
					expect(error).toEqual(null);

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// When all is finished
			fillPotPo.on('end', () => {
				try {
					// Only one output PO file
					expect(cnt).toEqual(1);

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// Start processing POT file
			fillPotPo.end(pot_source_vinyl);
		});
	});

	describe('no domain | auto srcDir | no write', () => {
		it('should produce 1 correct PO file', done => {
			// Set options
			const options = {
				...testOptions,
				writeFiles: false,
				domainInPOPath: false,
			};

			// Create the plugin stream
			let fillPotPo;
			try {
				expect(() => {
					fillPotPo = gulpFillPotPo(options);
				}).not.toThrow();
			} catch (jest_error) {
				done(jest_error);
			}

			// Keep count of output files
			let cnt = 0;

			// When outputing a new file
			fillPotPo.on('data', file => {
				cnt++;

				try {
					// Make sure it came out the same way it went in
					expect(file.isBuffer()).toBe(true);

					// Check the contents
					expect(file.contents.equals(expected_po_no_domain)).toBe(true);

					// done(); // called in the end event listener
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// On error
			fillPotPo.on('error', error => {
				try {
					// Fail on error
					expect(error).toEqual(null);

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// When all is finished
			fillPotPo.on('end', () => {
				try {
					// Only one output PO file
					expect(cnt).toEqual(1);

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// Start processing POT file
			fillPotPo.end(pot_source_vinyl);
		});
	});

	describe('set poSources | no write', () => {
		it('should produce 2 correct PO files', done => {
			// Set options
			const options = {
				...testOptions,
				poSources: po_sources_path,
				writeFiles: false,
			};

			// Create the plugin stream
			let fillPotPo;
			try {
				expect(() => {
					fillPotPo = gulpFillPotPo(options);
				}).not.toThrow();
			} catch (jest_error) {
				done(jest_error);
			}

			// Read in expected PO files
			const expectedFileBuffer = [
				expected_po_no_domain,
				expected_po_domain,
			];

			// Keep count of output files
			let cnt = 0;

			// When outputing a new file
			fillPotPo.on('data', file => {
				try {
					// Make sure it came out the same way it went in
					expect(file.isBuffer()).toBe(true);

					// Check the contents
					expect(file.contents.equals(expectedFileBuffer[cnt])).toBe(true);

					cnt++;

					// done(); // called in the end event listener
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// On error
			fillPotPo.on('error', error => {
				try {
					// Fail on error
					expect(error).toEqual(null);

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// When all is finished
			fillPotPo.on('end', () => {
				try {
					// Only one output PO file
					expect(cnt).toEqual(2);

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// Start processing POT file
			fillPotPo.end(pot_source_vinyl);
		});
	});

	describe('auto domain | auto srcDir | write | return POT', () => {
		it('should write 1 correct PO file and return the POT file', done => {
			// Create test output folder
			folder_i++;
			let folder_path = `${test_dir}${folder_i}`;
			if (!fs.existsSync(folder_path)) {
				fs.mkdirSync(folder_path, {recursive: true});
			}

			// Set options
			const options = {
				...testOptions,
				returnPOT: true,
				writeFiles: true,
				destDir: folder_path,
			};

			// Create the plugin stream
			let fillPotPo;
			try {
				expect(() => {
					fillPotPo = gulpFillPotPo(options);
				}).not.toThrow();
			} catch (jest_error) {
				done(jest_error);
			}

			// Keep count of output files
			let cnt = 0;

			// When outputing a new file
			fillPotPo.on('data', file => {
				cnt++;

				try {
					// Make sure it came out the same way it went in
					expect(file.isBuffer()).toBe(true);

					// Check the contents
					expect(file.contents.equals(pot_source_buffer)).toBe(true);

					// done(); // called in the end event listener
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// On error
			fillPotPo.on('error', error => {
				try {
					// Fail on error
					expect(error).toEqual(null);

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// When all is finished
			fillPotPo.on('end', () => {
				try {
					// Only one output POT file
					expect(cnt).toEqual(1);

					// Check if PO file exist
					const files = matchedSync([`${folder_path}/*`]);
					expect(files).toHaveLength(1);
					expect(files).toEqual([
						`${folder_path}/text-domain-nl_NL.po`
					]);

					// Check contents of file
					expect(
						fs.readFileSync(`${folder_path}/text-domain-nl_NL.po`)
							.equals(expected_po_domain)
					).toBe(true);

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// Start processing POT file
			fillPotPo.end(pot_source_vinyl);
		});
	});
	// TODO-ABOVE: wrap expect()s in try-catch with done()+re-throw

	describe('all defaults | no write | no Vinyl', () => {
		it('should error and not pass data', done => {
			// Set options
			const options = {
				...testOptions,
				writeFiles: false,
			};

			// Create the plugin stream
			let fillPotPo;
			try {
				expect(() => {
					fillPotPo = gulpFillPotPo(options);
				}).not.toThrow();
			} catch (jest_error) {
				done(jest_error);
			}

			// When outputing a new file
			fillPotPo.on('data', () => {
				try {
					// This should not run
					expect('called on data').toEqual('no on data');

					// done(); // called in the end event listener
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// On error
			fillPotPo.on('error', error => {
				try {
					// Error message should match
					expect(error).toMatchObject({
						message: expect.stringMatching(/Only Vinyl objects can be transformed/)
					});

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// When all is finished
			fillPotPo.on('end', () => {
				try {
					// This should not run
					expect('called on end').toEqual('no on end');

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// Start processing POT file
			fillPotPo.end('just a string');
		});
	});

	describe('all defaults | no write | stream Vinyl', () => {
		it('should error and not pass data', done => {
			// Set options
			const options = {
				...testOptions,
				writeFiles: false,
			};

			// Create the plugin stream
			let fillPotPo;
			try {
				expect(() => {
					fillPotPo = gulpFillPotPo(options);
				}).not.toThrow();
			} catch (jest_error) {
				done(jest_error);
			}

			// When outputing a new file
			fillPotPo.on('data', () => {
				try {
					// This should not run
					expect('called on data').toEqual('no on data');

					// done(); // called in the end event listener
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// On error
			fillPotPo.on('error', error => {
				try {
					// Error message should match
					expect(error).toMatchObject({
						message: expect.stringMatching(/Streams are not supported/)
					});

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// When all is finished
			fillPotPo.on('end', () => {
				try {
					// This should not run
					expect('called on end').toEqual('no on end');

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// Start processing POT file
			fillPotPo.end(new Vinyl({
				contents: fs.createReadStream(pot_source_path, 'utf8'),
				path: pot_source_path,
			}));
		});
	});

	describe('all defaults | no write | anonymous Vinyl', () => {
		it('should error and not pass data', done => {
			// Set options
			const options = {
				...testOptions,
				writeFiles: false,
			};

			// Create the plugin stream
			let fillPotPo;
			try {
				expect(() => {
					fillPotPo = gulpFillPotPo(options);
				}).not.toThrow();
			} catch (jest_error) {
				done(jest_error);
			}

			// When outputing a new file
			fillPotPo.on('data', () => {
				try {
					// This should not run
					expect('called on data').toEqual('no on data');

					// done(); // called in the end event listener
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// On error
			fillPotPo.on('error', error => {
				try {
					// Error message should match
					expect(error).toMatchObject({
						message: expect.stringMatching(/Source POT file has no name to get domain from/)
					});

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// When all is finished
			fillPotPo.on('end', () => {
				try {
					// This should not run
					expect('called on end').toEqual('no on end');

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// Start processing POT file
			fillPotPo.end(new Vinyl({
				contents: Buffer.from(pot_source_buffer),
				path: '.',
			}));
		});
	});

	describe('all defaults | no write | anonymous Vinyl | with domain', () => {
		it('should produce 1 correct PO file', done => {
			// Set options
			const options = {
				...testOptions,
				srcDir: input_dir,
				domainFromPOTPath: false,
				domain: 'text-domain',
				writeFiles: false,
			};

			// Create the plugin stream
			let fillPotPo;
			try {
				expect(() => {
					fillPotPo = gulpFillPotPo(options);
				}).not.toThrow();
			} catch (jest_error) {
				done(jest_error);
			}

			// Keep count of output files
			let cnt = 0;

			// When outputing a new file
			fillPotPo.on('data', file => {
				cnt++;

				try {
					// Make sure it came out the same way it went in
					expect(file.isBuffer()).toBe(true);

					// Check the contents
					expect(file.contents.equals(expected_po_domain)).toBe(true);

					// done(); // called in the end event listener
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// On error
			fillPotPo.on('error', error => {
				try {
					// Fail on error
					expect(error).toEqual(null);

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// When all is finished
			fillPotPo.on('end', () => {
				try {
					// Only one output PO file
					expect(cnt).toEqual(1);

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// Start processing POT file
			fillPotPo.end(new Vinyl({
				contents: Buffer.from(pot_source_buffer),
				path: '.',
			}));
		});
	});

	describe('all defaults | no write | empty Vinyl', () => {
		it('should only pass empty Vinyl', done => {
			// Set options
			const options = {
				...testOptions,
				writeFiles: false,
			};

			// Create the plugin stream
			let fillPotPo;
			try {
				expect(() => {
					fillPotPo = gulpFillPotPo(options);
				}).not.toThrow();
			} catch (jest_error) {
				done(jest_error);
			}

			// Keep count of output files
			let cnt = 0;
			const empty_vinyl = new Vinyl({
				contents: null,
				path: pot_source_path,
			});

			// When outputing a new file
			fillPotPo.on('data', file => {
				cnt++;

				try {
					// Should be same as what went in
					expect(file).toEqual(empty_vinyl);

					// done(); // called in the end event listener
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// On error
			fillPotPo.on('error', error => {
				try {
					// Fail on error
					expect(error).toEqual(null);

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// When all is finished
			fillPotPo.on('end', () => {
				try {
					// Only one output PO file
					expect(cnt).toEqual(1);

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// Start processing POT file
			fillPotPo.end(empty_vinyl);
		});
	});

	describe('when error (reading POT file)', () => {
		it('should error and not pass data', _done => {
			// Mock the fs.readFile function
			const readFileSpy = jest.spyOn(fs, 'readFile')
				.mockName('fs.readFile')
				.mockImplementation((path, cb) => {
					cb({message: 'POT_MOCK_FS_READFILE_ERROR'}, '');
				});

			const done = (param) => {
				// Restore the fs.readFile function
				readFileSpy.mockRestore();
				_done(param);
			};

			// Set options
			const options = {
				...testOptions,
				writeFiles: false,
			};

			// Create the plugin stream
			let fillPotPo;
			try {
				expect(() => {
					fillPotPo = gulpFillPotPo(options);
				}).not.toThrow();
			} catch (jest_error) {
				done(jest_error);
			}

			// When outputing a new file
			fillPotPo.on('data', () => {
				try {
					// This should not run
					expect('called on data').toEqual('no on data');

					// done(); // called in the end event listener
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// On error
			fillPotPo.on('error', error => {
				try {
					// Error message should match
					expect(error).toMatchObject({
						message: expect.stringMatching(/POT_MOCK_FS_READFILE_ERROR/)
					});

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// When all is finished
			fillPotPo.on('end', () => {
				try {
					// This should not run
					expect('called on end').toEqual('no on end');

					done();
				} catch (jest_error) {
					done(jest_error);
				}
			});

			// Start processing POT file
			fillPotPo.end(pot_source_vinyl);
		});
	});

	// TODO? with write
	// TODO? multiple POTs

	/* eslint-enable jest/no-done-callback */

	describe('auto domain | auto srcDir | no write | return POT', () => {
		it('should throw error', () => {
			// Set options
			const options = {
				...testOptions,
				returnPOT: true,
				writeFiles: false,
			};

			// Create the plugin stream
			expect(() => {
				gulpFillPotPo(options);
			}).toThrow(new RegExp('If option returnPOT is true, option writeFiles must be true'));
		});
	});

});
