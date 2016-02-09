[![Build Status](https://travis-ci.org/tandrewnichols/grunt-md.png)](https://travis-ci.org/tandrewnichols/grunt-md) [![downloads](http://img.shields.io/npm/dm/grunt-md.svg)](https://npmjs.org/package/grunt-md) [![npm](http://img.shields.io/npm/v/grunt-md.svg)](https://npmjs.org/package/grunt-md) [![Code Climate](https://codeclimate.com/github/tandrewnichols/grunt-md/badges/gpa.svg)](https://codeclimate.com/github/tandrewnichols/grunt-md) [![dependencies](https://david-dm.org/tandrewnichols/grunt-md.png)](https://david-dm.org/tandrewnichols/grunt-md)

[![NPM info](https://nodei.co/npm/grunt-md.png?downloads=true)](https://nodei.co/npm/grunt-md.png?downloads=true)


# grunt-md

Compile markdown files with yml view context into html

## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```bash
npm install grunt-md --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```javascript
grunt.loadNpmTasks('grunt-md');
```

Alternatively, install [task-master](http://github.com/tandrewnichols/task-master) and let it manage this for you.

## The "md" task

The `md` task is not much different than any other grunt markdown task out there. It uses `marked` for compiling markdown, so it's fast, and allows for code fences, etc. What's different about `grunt-md` is that it wraps the [marky-mark](https://github.com/rickbergfalk/marky-mark) library, which allows for a view context (data to be used when compiling a template) to be specified via yml "front-matter." Say you're writing a blog, and you want, as you reasonable should, to incoporate SEO elements. With most other markdown compilers, you'll have to do some shenanigans to get it working. With `grunt-md`, just write your blog post like this:

```
---
title: Five reasons to use grunt-md
description: Well, or at least one reason. YML front-matter.
author: Andrew Nichols
---

# Reason 1

You can use yml to specify variables to insert into your html template.
```

Then just add interpolation variables (in whatever view compiler format you prefer) to the template you specify in the configuration:

```html
<title><%= title %></title>
<!-- etc. -->
```

### Overview

In your project's Gruntfile, add a section named `md` to the data object passed into `grunt.initConfig()`. Again, I recommend [task-master](https://github.com/tandrewnichols/task-master) as it makes grunt configuration much cleaner. `grunt-md` supports all the normal grunt file-specification formats.

```javascript
grunt.initConfig({
  md: {
    posts: {
      src: 'posts/**/*.md',
      dest: 'views/posts'
    }
  }
});
```

### Options

All of the following options are optional. Defaults are indicated where applicable.

#### Wrapper

The html template in which to embed the compiled markdown. If supplied, the compiled markdown will be available as `content`, and any yml front-matter will be available as defined above.

```javascript
grunt.initConfig({
  md: {
    options: {
      wrapper: 'views/wrapper.html'
    },
    src: 'posts/**/*.md',
    dest: 'views/posts'
  }
});
```

A simple wrapper might look like:

```html
<!DOCTYPE html>
<html>
  <head>
    <title><%= title %></title>
    <meta name="description" content="<%= description %>">
    <meta name="keywords" content="<%= keywords %>">
  </head>
  <body>
    <div class="container content"><%= content %></div>
  </body>
</html>
```

`wrapper` can also be an object with different wrappers specified by file path or file name. Use `*` for any files that are using a default wrapper.

```javascript
grunt.initConfig({
  md: {
    options: {
      wrapper: {
        'posts/fruits/banana.md': 'views/banana-wrapper.html', // Matches the file at "posts/fruits/banana.md"
        'apple': 'views/apple-wrapper.html', // Matches any file named "apple.md"
        '*': 'views/wrapper.html' // All other files
      }
    },
    src: 'posts/**/*.md',
    dest: 'views/posts'
  }
});
```

#### Flatten

In addition, to the normal grunt file-specification formats, you can specify `dest` as a directory, in which to put all compiled templates. By default (`flatten: false`), the directory structure is preserved. With `flatten: true`, files are all placed at the top level of the destination directory. This is identical to the way `flatten` works when using the file array format built-in to grunt.

#### Event

A grunt event to emit for each file. The event data will be the object returned by `marky-mark` (plus a couple extra fields):

```js
{
  filenameExtension: '.md',
  filename: "a-dazzling-post",
  yaml: "title: How to be awesome: 3 easy steps",
  markdown: "## Step 1\n\nUse grunt-md",
  content: "<h2>Step 1</h2><p>Use grunt-md",
  meta: {
    title: "How to be awesome: 3 easy steps",
  },
  dest: 'views/posts',
  origPath: 'posts'
}
```

Set this in the config with something like

```js
grunt.initConfig({
  md: {
    options: {
      event: 'post'
    },
    src: 'posts/**/*.md',
    dest: 'views/posts'
  }
});
```

and then just listen for the event, possibly in another task:

```js
grunt.event.on('post', function(post) {
  // Do something with the post data structure
});
```

#### Config

Like `event`, this exposes the `marky-mark` object to other tasks, but this does via grunt's internal config mechanism. Just add a config property under options,

```js
grunt.initConfig({
  md: {
    options: {
      config: 'posts'
    },
    src: 'posts/**/*.md',
    dest: 'views/posts'
  }
});
```

and then in a task that follows `md`, access via `grunt.config.get`. Note each `marky-mark` object will be in a separate sub-object with the filename as a key. So if you process a `banana.md` and an `apple.md`, you can get them like this:

```js
var posts = grunt.config.get('posts');
for (var k in posts) {
  console.log(k); // "banana", "apple"
  console.log(posts[k]); // marky-mark style object
}
```

#### Mm

`marky-mark` itself accepts a variety of options, including:

* preCompile: A function that accepts and returns markdown. Use this if you need to manipulate the markdown prior to compiling it to html.
* postCompile: A function that accepts and returns html. Use this if you need to manipulate the resultant html before writing it to a file.
* context: Additional view context variables to provide to the wrapper.
* marked: Options to pass on to the `marked` module. See [marked](https://github.com/chjj/marked) for more details.

Example:

```js
grunt.initConfig({
  md: {
    options: {
      mm: {
        postCompile: function(html) {
          return html.replace(/h1/g, 'h2');
        },
        context: {
          author: 'Andrew Nichols'
        }
      }
    },
    src: 'posts/**/*.md',
    dest: 'views/posts'
  }
});
```

## Contributing

Please see [the contribution guidelines](CONTRIBUTING.md).
