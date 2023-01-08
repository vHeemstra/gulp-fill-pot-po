<p align="center">
    <img height="257" width="114" src="https://raw.githubusercontent.com/vheemstra/gulp-fill-pot-po/main/logo.svg">
</p>

<h1 align="center">
gulp-fill-pot-po<br/>

[![GitHub release (latest SemVer)][release-image]][release-url] [![NPM version][npm-image]][npm-url]
</h1>
<div align="center">

[![Build Status][ci-image4]][ci-url]
[![Coverall Coverage Status][coverage-image]][coverage-url]
[![Dependencies Status][deps-image]][deps-url]
[![Downloads][downloads-image]][npm-url]

</div>

> Gulp wrapper for [**fill-pot-po**][fpp-url]. Generates pre-filled PO files from POT file, using source PO files.
> 
> *Based on the POT filename or set options, it looks for source PO files. For each PO file, it will create a new one, based on the contents of the POT file. The source PO file is used to fill in the matching translated strings.*
> 
> *For more information, details and all options, see [documentation of **fill-pot-po**][fpp-url].*


## Install

```bash
npm install --save-dev gulp-fill-pot-po
```


## Example usage

### Basic

```js
const { src, dest } = require('gulp');
const fillPotPo = require('gulp-fill-pot-po');

const defaultTask = () => {
    return src('src/languages/*.pot')
        .pipe( fillPotPo() )
        .pipe( dest('dist/languages/') );
};

exports.default = defaultTask;
```

### Continue pipe with POT files

```js
const { src, dest } = require('gulp');
const fillPotPo = require('gulp-fill-pot-po');

const defaultTask = () => {
    return src('src/languages/*.pot')
        .pipe( fillPotPo({
            returnPOT: true,
            writeFiles: true,
            destDir: 'dist/languages/',
        }) )
        // Continue processing POT files
        .pipe( /* ... */ );
};

exports.default = defaultTask;
```

### Use with [gulp-wp-pot][gwpp-url]
> This example uses [**gulp-wp-pot**][gwpp-url] to extract all translation strings from a WordPress project and generate a POT file.
> 
> The POT file is then used to create PO files with the translated strings pre-filled from detected source PO files.
> 
> For each detected PO source file, it will generate a matching new one, based on the POT file contents and filled using the source PO file.
```js
const { src, dest } = require('gulp');
const wpPot = require('gulp-wp-pot');
const fillPotPo = require('gulp-fill-pot-po');

const defaultTask = () => {
    return src('src/**/*.php')
        
        // Extract all translation strings from code base
        // and generate a POT file.
        .pipe( wpPot() )
        
        // Save POT file to disk.
        .pipe( dest('dist/language/text-domain.pot') )
        
        // Look for matching (prior) PO translation files (e.g. text-domain-en_EN.po)
        // and use them to fill in translated strings in the new POT content.
        .pipe( fillPotPo( {
            srcDir: 'src/language/'
        } ) )
        
        // Save the new pre-filled PO files to disk (one for each source PO file).
        .pipe( dest('dist/language/') );
};

exports.default = defaultTask;
```


## `fillPotPo( options )`

See all available options in the [**fill-pot-po** readme](https://github.com/vHeemstra/fill-pot-po#options).

All options are passed to **fill-pot-po**, but there are a few differences:

### potSources
> Will be set by **gulp-fill-pot-po** internally.

### writeFiles
> The default value for `writeFiles` is `false`, because the resulting buffers will probably be `.pipe( dest() )`'d which writes them to disk instead.

### returnPOT
`boolean`
> Whether the plugin should return the source POT file(s) (`true`) or the generated PO file(s) (`false`).
> 
> By default, it will return the generated PO files for further processing, like `.pipe( dest('./') )`.
> 
> In cases where you want to continue processing the source POT files, you can set this to `true`. Note, that in this case you need to set `writeFiles` to `true` or no PO files will be generated and the plugin throws an error.

Default: `false`


## Related
- [fill-pot-po][fpp-url] - NodeJS module that does all the work
- [gulp-wp-pot][gwpp-url] - Generate POT files for WordPress projects in gulp


## License
MIT © [Philip van Heemstra](https://github.com/vHeemstra)

[fpp-url]: http://github.com/vHeemstra/fill-pot-po
[gwpp-url]: http://github.com/wp-pot/gulp-wp-pot

[release-url]: https://github.com/vHeemstra/gulp-fill-pot-po/releases
[release-image]: https://img.shields.io/github/v/release/vHeemstra/gulp-fill-pot-po?sort=semver&logo=github&logoColor=959DA5&labelColor=444D56

[ci-url]: https://github.com/vHeemstra/gulp-fill-pot-po/actions/workflows/ci_push_on_main.yml
[ci-image]: https://img.shields.io/github/actions/workflow/status/vHeemstra/gulp-fill-pot-po/ci_push_on_main.yml?branch=main&label=lint%20%26%20test&logo=github&logoColor=959DA5&labelColor=444D56
[ci-image2]: https://github.com/vHeemstra/gulp-fill-pot-po/actions/workflows/ci_push_on_main.yml/badge.svg
[ci-image3]: https://img.shields.io/static/v1?logo=github&logoColor=959DA5&label=lint%20%26%20tests&labelColor=444D56&message=passing&color=34D058
[ci-image4]: https://img.shields.io/github/workflow/status/vHeemstra/gulp-fill-pot-po/Lint%20%7C%20Test%20%7C%20Release?label=lint%20%26%20test&logo=github&logoColor=959DA5&labelColor=444D56

[coverage-url]: https://coveralls.io/github/vHeemstra/gulp-fill-pot-po?branch=main
[coverage-image]: https://img.shields.io/coveralls/github/vHeemstra/gulp-fill-pot-po?logo=coveralls&logoColor=959DA5&labelColor=444D56
[coverage-image_]: https://coveralls.io/repos/github/vHeemstra/gulp-fill-pot-po/badge.svg?branch=main

[coverage-url2]: https://codecov.io/gh/vHeemstra/gulp-fill-pot-po
[coverage-image2]: https://codecov.io/gh/vHeemstra/gulp-fill-pot-po/branch/main/graph/badge.svg?token=sZaKGStMXg

[deps-url]: https://libraries.io/npm/gulp-fill-pot-po
[deps-image]: https://img.shields.io/librariesio/release/npm/gulp-fill-pot-po?logo=libraries.io&logoColor=959DA5&labelColor=444D56
[deps-image2]: https://img.shields.io/librariesio/github/vHeemstra/gulp-fill-pot-po?logo=libraries.io&logoColor=959DA5&labelColor=444D56

[npm-url]: https://www.npmjs.com/package/gulp-fill-pot-po
[npm-image]: https://img.shields.io/npm/v/gulp-fill-pot-po.svg?color=cb0000&labelColor=444D56&logo=data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsPSIjOTU5REE1IiBkPSJNMS43NjMgMEMuNzg2IDAgMCAuNzg2IDAgMS43NjN2MjAuNDc0QzAgMjMuMjE0Ljc4NiAyNCAxLjc2MyAyNGgyMC40NzRjLjk3NyAwIDEuNzYzLS43ODYgMS43NjMtMS43NjNWMS43NjNDMjQgLjc4NiAyMy4yMTQgMCAyMi4yMzcgMHpNNS4xMyA1LjMyM2wxMy44MzcuMDE5LS4wMDkgMTMuODM2aC0zLjQ2NGwuMDEtMTAuMzgyaC0zLjQ1NkwxMi4wNCAxOS4xN0g1LjExM3oiPjwvcGF0aD48L3N2Zz4=
[downloads-image]: https://img.shields.io/npm/dm/gulp-fill-pot-po.svg?labelColor=444D56&logo=data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsPSIjOTU5REE1IiBkPSJNMS43NjMgMEMuNzg2IDAgMCAuNzg2IDAgMS43NjN2MjAuNDc0QzAgMjMuMjE0Ljc4NiAyNCAxLjc2MyAyNGgyMC40NzRjLjk3NyAwIDEuNzYzLS43ODYgMS43NjMtMS43NjNWMS43NjNDMjQgLjc4NiAyMy4yMTQgMCAyMi4yMzcgMHpNNS4xMyA1LjMyM2wxMy44MzcuMDE5LS4wMDkgMTMuODM2aC0zLjQ2NGwuMDEtMTAuMzgyaC0zLjQ1NkwxMi4wNCAxOS4xN0g1LjExM3oiPjwvcGF0aD48L3N2Zz4=
