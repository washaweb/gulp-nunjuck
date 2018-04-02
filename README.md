# Static site generator with gulp, nunjucks, browserify poc

## Features

* Templating thanks to [Nunjucks](https://mozilla.github.io/nunjucks/).
* Custom data for templates in external json files.
* Less compilation.
* Client dependencies also handled with npm in package.json.
* Import dependencies in your scripts with browserify and browserify-css.
* Preview the resutls in real time in your browser thanks to gulp-watch and livereload.


## Requirements

* [Docker](https://docs.docker.com/engine/) and [docker-compose](https://docs.docker.com/compose/)

Install this prerequisites on OSX with [homebrew](https://brew.sh/index_fr):

```
$ brew update
$ brew cask install docker
```


## Install

```
$ docker-compose up -d
$ docker-compose exec app bash
# npm install
```

## Generate site

### Activate local server and build site

```
# gulp
```

Open your browser with http://0.0.0.0:8888/


### Activate local server with livereload

```
$ gulp watch
```


### Build static site

```
$ gulp build
```

End result can be found in `./build` folder.
