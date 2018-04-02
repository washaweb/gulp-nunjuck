# Static site generator with gulp, nunjucks, browserify poc

## Features

* Templating thanks to [Nunjucks](https://mozilla.github.io/nunjucks/).
* Custom data for templates in external json files.
* Less compilation.
* Client dependencies also handled with npm in package.json.
* Import dependencies in your scripts with browserify and browserify-css.
* Preview the resutls in real time in your browser thanks to gulp-watch and livereload.


## Requirements

* [Node.js](https://nodejs.org/)
* [gulp](http://gulpjs.com/)


## Install

```
$ sudo npm install --global gulp
$ cd <project_folder>
$ npm install
```

## Generate site

### Activate local server and build site

```
$ gulp
```

Open your browser with http://127.0.0.1:8888/


### Activate local server with livereload

```
$ gulp watch
```


### Build static site

```
$ gulp build
```

End result can be found in `./build` folder.
