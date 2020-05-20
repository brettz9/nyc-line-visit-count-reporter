# nyc-line-visit-count-reporter

***Note: This project is somewhat unstable. It also requires use of an [nyc fork](https://github.com/brettz9/nyc.git#reporter-options) in order to get options passed to it.***

## Installation

```sh
npm i -D nyc-line-visit-count-reporter
```

## Usage

Note that for this reporter to work, you cannot set `instrument` to `false`.

For running tests, e.g., with Mocha:

```sh
nyc --reporter-options <option1=val1> --reporter-options <option2=val2> --reporter nyc-line-visit-count-reporter npm run mocha
```

For reporting on results after the fact:

```sh
nyc report --reporter-options <option1=val1> --reporter-options <option2=val2> --reporter nyc-line-visit-count-reporter
```

For example, running the this command:

```sh
nyc --reporter nyc-line-visit-count-reporter mocha --recursive --require @babel/register --reporter progress --timeout 9000
```

...against the project `eslint-plugin-jsdoc` currently gives:

[![screenshot.png](https://raw.githubusercontent.com/brettz9/nyc-line-visit-count-reporter/master/images/screenshot.png?sanitize=true)](images/screenshot.png)

## Reporter options

### `absolutePaths`

Whether to show absolute paths instead of paths relative to the current
working directory.

Defaults to `false`.

### `maxItems`

How many items to display. Defaults to `10`.

### `outputFile`

A single relative file path (relative to the coverage directory) to which to
write the output. Defaults to `null` (i.e., writes to console.

### `file`

File, semi-colon-separated list of files, or array of files to be reported on.

Defaults to not being used.

### `noAggregate`

Whether to avoid calculating `maxItems` relative to the results across
files in aggregate rather than per file.

If `true`, will group the items by file, with each group listing the
number of `maxItems` per file group.

If `false`, will only list one set (limited by `maxItems`), sorting
exclusively by visit count (though listing file name for each entry).

The available file groups will be all covered files unless `file` is set.

Defaults to `false`.

## To-dos

1. Get tests working consistently with coverage
1. See about avoiding need for fork `--reporter-options`; see
    [nyc PR# 1312](https://github.com/istanbuljs/nyc/pull/1312).

## Possible to-dos

1. Interactive mode where one can selectively open files (with line/column
    as IDEs such as Atom understand) by number.
1. Could add `es6-template-strings` to allow user to control appearance
1. Others data besides on statements:
    1. **Top visited functions** (or the function within which a
        statement occurs) along with the function `name`. `line` and `column`
        of `loc.start` and `loc.end` (or `decl.start` and `decl.end`?)
    1. **Top visited branches**, along with its `type` (e.g., switch) and
        whether it was for an `if` or `else` (the first or second item in
        the `b` array). `line` and `column` of `loc.start` and `loc.end`
        (shouldn't need `locations` which list locations of all branches,
        e.g., of a switch or if-else)
