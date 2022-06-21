module.exports = ( { github, context, core, glob, io, exec, require } ) => {
	const { SOME_ENV } = process.env;
	let result = {
		ar: [
			{ text: 't1' },
			{ text: 't2' },
			{ text: 't3' },
		],
		some: 'lala',
		other: true,
		nope: false,
		env: SOME_ENV,
	};
	core.exportVariable('TEST2', 'hoi');
	return result;
};
