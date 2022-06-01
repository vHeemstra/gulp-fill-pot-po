# gulp-fill-pot-po

## Information

| Package     | gulp-fill-pot-po                                          |
| ----------- | ---------------------------------------------------- |
| Description | Gulp wrapper for [fill-pot-po](https://github.com/vheemstra/fill-pot-po). Generates pre-filled PO files from POT file, using source PO files. |

## Install

```
$ npm install --save-dev gulp-fill-pot-po
```


## Example usage with [Gulp](http://github.com/gulpjs/gulp)

```js
const { src, dest } = require('gulp');
const fillPotPo = require('gulp-fill-pot-po');

const defaultTask = () => {
    return src('src/languages/*.pot')
        .pipe( fillPotPo() )
        .pipe( dest('dist/languages/') );
});

exports.default = defaultTask;
```


## fillPotPo({options})
See available options in the [fill-pot-po readme](https://github.com/vheemstra/fill-pot-po#options).
All options except potSources are passed to fill-pot-po.

## Related
- [fill-pot-po](https://github.com/vheemstra/fill-pot-po) - API for this module
- [gulp-wp-pot](https://github.com/wp-pot/gulp-wp-pot) - For generating POT files for WordPress in gulp

## License

MIT © [Philip van Heemstra](https://github.com/vheemstra)
