# jQuery external link checker

## How to use:

1. Include the script on your page. (The script is located in /dist/jquery_external_link_checker.js)
2. Initiate the plugin:

```javascript
$('a').checkExternalLinks();
// This will add .js-external-link class to all external links and .js-internal-link to all internal links
```
### Using with options:
```javascript
// This is how you can change classes that are added to links
$('a').checkExternalLinks({
  externalLinkClass: "custom-external-class",
  internalLinkClass: "custom-internal-class"
});
```

### List of options:
| Option name | Accepted values | Description |
|:---:|:---:|---|
| externalLinkClass | String | This options overrides the default "js-external-link" class on external links |
| internalLinkClass | String | This options overrides the default "js-internal-link" class on internal links
### Todo:
1. Fix the `gulp scripts-min` task because it doesn't work on `gulp watch`
2. Add documentation in /documentation
3. Add Unit tests
4. Add CommonJS documentation and tests
5. Add AMD documentation and tests
6. Add Gulp task documentation
7. Add the date of generation of the script at the top of the javascript file
8. Add the package version from package.json to the top of the javascript file
9. Implement js statistics (suck as size and gzipped size)
