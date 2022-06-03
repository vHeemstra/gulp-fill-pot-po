'use strict';

const gulpFillPotPo = require('../');

const { readFileSync } = require('fs');
const Vinyl = require('vinyl');

const testDir_in = 'test/examples/input';
const testDir_expected = 'test/examples/output_correct';

const potSource = `${testDir_in}/text-domain.pot`;
const poSources = `${testDir_in}/*.po`;


describe('gulp-fill-pot-po - single POT', () => {

	// Read in POT file
	const potFileBuffer = readFileSync(potSource);
	const thePOTFile = new Vinyl({
		contents: Buffer.from(potFileBuffer),
		path: potSource
	});

	/* eslint-disable jest/no-done-callback */

	describe('< auto domain | auto srcDir | no write >', () => {
		it('should produce 1 correct PO file', done => {
			// Set options
			const options = {
				// poSources: null,             // def: null
				// srcDir: testDir_in,          // def: ''
				// srcGlobOptions: {},          // def: {}
				writeFiles: false,              // def: true
				// destDir: testDir_out,        // def: ''
				// domainInPOPath: false,       // def: true
				// domainFromPOTPath: false,    // def: true
				// domain: 'text-domain',       // def: ''
				// wrapLength: 77,              // def: 77
				defaultContextAsFallback: true, // def: false
				appendNonIncludedFromPO: true,  // def: false
				includePORevisionDate: false,   // def: false
				includeGenerator: false,        // def: true
			};

			// Create the plugin stream
			let fillPotPo;
			expect(() => {
				fillPotPo = gulpFillPotPo(options);
			}).not.toThrow();

			// Read in expected PO file
			const expectedFileBuffer = readFileSync(`${testDir_expected}/text-domain-nl_NL.po`);

			// Keep count of output files
			let cnt = 0;

			// When outputing a new file
			fillPotPo.on('data', file => {
				cnt++;

				// Make sure it came out the same way it went in
				expect(file.isBuffer()).toBeTruthy();

				// Check the contents
				expect(file.contents).toEqual(expectedFileBuffer);

				// done(); // called in the end event listener
			});

			// On error
			fillPotPo.on('error', error => {
				// Fail on error
				expect(error).toEqual(null);

				done();
			});

			// When all is finished
			fillPotPo.on('end', () => {
				// Only one output PO file
				expect(cnt).toEqual(1);

				done();
			});

			// Start processing POT file
			fillPotPo.end(thePOTFile);
		});
	});

	describe('< manual domain | set srcDir | no write >', () => {
		it('should produce 1 correct PO file', done => {
			// Set options
			const options = {
				srcDir: testDir_in,
				writeFiles: false,
				domainFromPOTPath: false,
				domain: 'text-domain',
				defaultContextAsFallback: true,
				appendNonIncludedFromPO: true,
				includePORevisionDate: false,
				includeGenerator: false,
			};

			// Create the plugin stream
			let fillPotPo;
			expect(() => {
				fillPotPo = gulpFillPotPo(options);
			}).not.toThrow();

			// Read in expected PO file
			const expectedFileBuffer = readFileSync(`${testDir_expected}/text-domain-nl_NL.po`);

			// Keep count of output files
			let cnt = 0;

			// When outputing a new file
			fillPotPo.on('data', file => {
				cnt++;

				// Make sure it came out the same way it went in
				expect(file.isBuffer()).toBeTruthy();

				// Check the contents
				expect(file.contents).toEqual(expectedFileBuffer);

				// done(); // called in the end event listener
			});

			// On error
			fillPotPo.on('error', error => {
				// Fail on error
				expect(error).toEqual(null);

				done();
			});

			// When all is finished
			fillPotPo.on('end', () => {
				// Only one output PO file
				expect(cnt).toEqual(1);

				done();
			});

			// Start processing POT file
			fillPotPo.end(thePOTFile);
		});
	});

	describe('< no domain | auto srcDir | no write >', () => {
		it('should produce 1 correct PO file', done => {
			// Set options
			const options = {
				writeFiles: false,
				domainInPOPath: false,
				defaultContextAsFallback: true,
				appendNonIncludedFromPO: true,
				includePORevisionDate: false,
				includeGenerator: false,
			};

			// Create the plugin stream
			let fillPotPo;
			expect(() => {
				fillPotPo = gulpFillPotPo(options);
			}).not.toThrow();

			// Read in expected PO file
			const expectedFileBuffer = readFileSync(`${testDir_expected}/nl_NL.po`);

			// Keep count of output files
			let cnt = 0;

			// When outputing a new file
			fillPotPo.on('data', file => {
				cnt++;

				// Make sure it came out the same way it went in
				expect(file.isBuffer()).toBeTruthy();

				// Check the contents
				expect(file.contents).toEqual(expectedFileBuffer);

				// done(); // called in the end event listener
			});

			// On error
			fillPotPo.on('error', error => {
				// Fail on error
				expect(error).toEqual(null);

				done();
			});

			// When all is finished
			fillPotPo.on('end', () => {
				// Only one output PO file
				expect(cnt).toEqual(1);

				done();
			});

			// Start processing POT file
			fillPotPo.end(thePOTFile);
		});
	});

	describe('< set poSources | no write >', () => {
		it('should produce 2 correct PO files', done => {
			// Set options
			const options = {
				poSources: poSources,
				writeFiles: false,
				defaultContextAsFallback: true,
				appendNonIncludedFromPO: true,
				includePORevisionDate: false,
				includeGenerator: false,
			};

			// Create the plugin stream
			let fillPotPo;
			expect(() => {
				fillPotPo = gulpFillPotPo(options);
			}).not.toThrow();

			// Read in expected PO files
			const expectedFileBuffer = [
				readFileSync(`${testDir_expected}/nl_NL.po`),
				readFileSync(`${testDir_expected}/text-domain-nl_NL.po`),
			];

			// Keep count of output files
			let cnt = 0;

			// When outputing a new file
			fillPotPo.on('data', file => {
				// Make sure it came out the same way it went in
				expect(file.isBuffer()).toBeTruthy();

				// Check the contents
				expect(file.contents).toEqual(expectedFileBuffer[cnt]);

				cnt++;

				// done(); // called in the end event listener
			});

			// On error
			fillPotPo.on('error', error => {
				// Fail on error
				expect(error).toEqual(null);

				done();
			});

			// When all is finished
			fillPotPo.on('end', () => {
				// Only one output PO file
				expect(cnt).toEqual(2);

				done();
			});

			// Start processing POT file
			fillPotPo.end(thePOTFile);
		});
	});

	// TODO? with write
	// TODO? multiple POTs

	/* eslint-enable jest/no-done-callback */

});
