# nyc-line-visit-count-reporter

***Note: This project is not yet functional.***

## Installation

```sh
npm i -D nyc-line-visit-count-reporter
```

## Usage

```sh
nyc --reporter-options <option1=val1> --reporter-options <option2=val2> --reporter nyc-line-visit-count-reporter npm run mocha
```

## To-dos

1. Store results in array and print only at end, depending on whether user
    wanted all file data aggregated or not (or wanted a specific file).
1. Document reporter options (`absolutePaths`, `maxItems`, ...)

## Possible to-dos

1. Others data besides on statements:
    1. **Top visited functions** (or the function within which a
        statement occurs) along with the function `name`. `line` and `column`
        of `loc.start` and `loc.end` (or `decl.start` and `decl.end`?)
    1. **Top visited branches**, along with its `type` (e.g., switch) and
        whether it was for an `if` or `else` (the first or second item in
        the `b` array). `line` and `column` of `loc.start` and `loc.end`
        (shouldn't need `locations` which list locations of all branches,
        e.g., of a switch or if-else)
