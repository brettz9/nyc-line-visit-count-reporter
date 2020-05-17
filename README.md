# nyc-line-visit-count-reporter

***Note: This project is not yet functional.***

## Installation

```sh
npm i -D nyc-line-visit-count-reporter
```

## Usage

For running tests, e.g., with Mocha:

```sh
nyc --reporter-options <option1=val1> --reporter-options <option2=val2> --reporter nyc-line-visit-count-reporter npm run mocha
```

For reporting on results after the fact:

```sh
nyc report --reporter-options <option1=val1> --reporter-options <option2=val2> --reporter nyc-line-visit-count-reporter
```

## Reporter options

### `absolutePaths`

Whether to show absolute paths instead of paths relative to the current
working directory.

Defaults to `false`.

### `maxItems`

How many items to display. Defaults to `10`.

### `file`

File, comma-separted list of files, or array of files to be reported on.

Defaults to not being used.

### `aggregate`

Whether to calculate `maxItems` relative to the results across files in
aggregate rather than per file.

If `false`, will group the items by file,
with each group listing the number of `maxItems` per file group.

If `true`, will only list one set (limited by `maxItems`), sorting exclusively
by visit count (though listing file name for each entry).

The available file groups will be all covered files unless `file` is set.

Defaults to `true`.

## To-dos

1. Test with full coverage
1. Point to own fork supporting `--reporter-options`

## Possible to-dos

1. Interactive mode where one can selectively open files (with line/column
    as IDEs such as Atom understand) by number.
1. Others data besides on statements:
    1. **Top visited functions** (or the function within which a
        statement occurs) along with the function `name`. `line` and `column`
        of `loc.start` and `loc.end` (or `decl.start` and `decl.end`?)
    1. **Top visited branches**, along with its `type` (e.g., switch) and
        whether it was for an `if` or `else` (the first or second item in
        the `b` array). `line` and `column` of `loc.start` and `loc.end`
        (shouldn't need `locations` which list locations of all branches,
        e.g., of a switch or if-else)
