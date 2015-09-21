# grunt-crx

> Create crx archive from zip

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-crx-simple --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-crx');
```

## Bump task
_Run this task with the `grunt crx` command._


### Settings

#### key
Type: `String`  
Default: `'key.pem'`

Path to your private key in PEM format to sign crx with.


## Usage Examples

```js
crx: {
	options: {
		key: 'path/to/my-private-rsa-key.pem'
	},
	extension: {
		src: 'build/extension.zip',
		dest: 'build/extension.crx'
	}
},
```
