/* jshint node: true */
'use strict';

var nodemon = require('nodemon');
var Promise = require('ember-cli/lib/ext/promise');
var path = require('path');
var which = require('which');

module.exports = {
  name: 'ember-autoserve',

  includedCommands: function() {
    return {
      autoserve: {
        name: 'autoserve',
        aliases: ['as'],
        description: 'Runs `ember serve` and will automatically restart it when necessary',
        works: 'insideProject',

        validateAndRun: function(rawArgs) {
          return this.run({}, rawArgs);
        },

        run: function(options, rawArgs) {
          return new Promise(function(resolve, reject) {
            nodemon({
              exec: which.sync('ember'),
              args: ['serve'].concat(rawArgs),
              watch: [
                'ember-cli-build.js',
                'package.json',
                'bower.json',
                '.scss-lint.yml',
                'eslint/base.js',
                'config/base.js',
                'config/dev.js',
                'config/local.js'
              ]
            });

            nodemon.on('start', function () {
              // console.log('`ember serve` has started');
            }).on('quit', function () {
              // console.log('`ember serve` has quit');
              resolve();
            }).on('restart', function (files) {
              console.log('Detected changes to: ' + files.map(function(f) { return path.basename(f); }).join(", "))
              console.log('Restarting `ember serve`');
            });
          });
        }
      }
    }
  }
};
