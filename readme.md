<p align="center">
    <img height="257" width="114" src="https://raw.githubusercontent.com/vheemstra/gulp-fill-pot-po/main/logo.svg">
</p>

<h1 align="center">
gulp-fill-pot-po
</h1>

> Gulp wrapper for [fill-pot-po](https://github.com/vheemstra/fill-pot-po). Generates pre-filled PO files from POT file, using source PO files.
> 
> *Based on the POT filename or set options, it looks for source PO files. For each PO file, it will create a new one, based on the contents of the POT file. The source PO file is used to fill in the matching translated strings.*

## Install

```bash
npm install --save-dev gulp-fill-pot-po
```

## Example usage

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

## Example usage with [gulp-wp-pot](http://github.com/wp-pot/gulp-wp-pot)
> This example uses `gulp-wp-pot` to extract all translation strings from a WordPress project and generate a POT file.
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
        
        // Extract all translation strings from code base.
        .pipe( wpPot() )
        
        // Generate a POT file.
        .pipe( dest('dist/language/text-domain.pot') )
        
        // Look for matching (prior) PO translation files (e.g. text-domain-en_EN.po)
        // and use them to fill in translated strings in the new POT content.
        .pipe( fillPotPo( {
            srcDir: 'src/language/'
        } ) )
        
        // Output the new pre-filled PO files (one for each source PO file).
        .pipe( dest('dist/language/') );
};

exports.default = defaultTask;
```

## fillPotPo({options})
See all available options in the [`fill-pot-po` readme](https://github.com/vheemstra/fill-pot-po#options).

All options are passed to `fill-pot-po`, except for `potSources`, which is set by `gulp-fill-pot-po`.

Unlike `fill-pot-po`, for `gulp-fill-pot-po` the default for option `writeFiles` is `false`, since the resulting buffers will probably be `.pipe( dest() )`'d which writes them to disk instead.

## Related
- [fill-pot-po](https://github.com/vheemstra/fill-pot-po) - NodeJS module that does all the work
- [gulp-wp-pot](https://github.com/wp-pot/gulp-wp-pot) - Generate POT files for WordPress projects in gulp

## License
MIT © [Philip van Heemstra](https://github.com/vheemstra)
