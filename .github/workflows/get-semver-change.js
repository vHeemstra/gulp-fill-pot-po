module.exports = (
	{ github, context, core, glob, io, exec, require },
	commit_messages,
	pr_labels = [],
	pr_files = []
) => {
	let pr_semver_change = [ false, false, false ];

	let skip = false;
	if ( pr_labels.includes('semver-major') ) {
		pr_semver_change[0] = true;
		skip = true;
	}
	if ( pr_labels.includes('semver-minor') ) {
		pr_semver_change[1] = true;
		skip = true;
	}
	if ( pr_labels.includes('semver-patch') ) {
		pr_semver_change[2] = true;
		skip = true;
	}

	// If PR is not a GitHub Action dependency version bump
	if ( ! skip && ! (
		pr_labels.includes('dependencies')
		&& pr_labels.includes('github actions')
	) ) {

		// Pre-process messages
		commit_messages = commit_messages.map( m => {
			m = m.split(/\r?\n/);
			return {
				title: m[0],
				body: ( m.slice(2) || [''] ).join('\n'),
			};
		} );

		// Get semver change according to commit messages
		pr_semver_change = commit_messages
			.reduce( ( semver, commit ) => {
				const title = commit.title;
				const body = commit.body;

				// NPM dependencies version bumps
				if ( pr_labels.includes('dependencies') ) {

					// Development dependency bumps don't warrant a version bump of package
					if ( body.match(/^\s*dependency-type: direct:development/m) ) {
						return semver;
					}

					// Production dependency bumps on their own are patch only
					if ( body.match(/^\s*update-type: version-update:semver-(?:major|minor|patch)/m) ) {
						semver[2] = true;
						return semver;
					}

				} else {

					// If not a dependency version bump, check for keywords.

					if (
						title.match(/^\s*(?:major|breaking)/i)
						// || body.match(/^\s*(?:major|breaking)/mi)
					) {
						semver[0] = true;
						return semver;
					}

					if (
						title.match(/^\s*(?:minor|feat)/i)
						// || body.match(/^\s*(?:minor|feat)/mi)
					) {
						semver[1] = true;
						return semver;
					}

					// Whether or not it's a patch, depends on effected files.
				}

				return semver;
			}, pr_semver_change );

		// If not yet determined and not a dependency version bump,
		// check effected filenames.
		if (
			! pr_labels.includes('dependencies')
			&& ! pr_semver_change[0]
			&& ! pr_semver_change[1]
			&& ! pr_semver_change[2]
		) {
			// Main package files should always warrant patch version bump.
			if (
				pr_files
				.filter( filename => {
					return filename.match(/^(?:index\.js|\.npmignore|LICENSE)/);
				} )
				.length > 0
			) {
				pr_semver_change[0] = true;
			}
		}
	}

	if ( pr_semver_change[0] ) {
		return [3, 'major'];
	} else if ( pr_semver_change[1] ) {
		return [2, 'minor'];
	} else if ( pr_semver_change[2] ) {
		return [1, 'patch'];
	} else {
		return [0, ''];
	}
};
