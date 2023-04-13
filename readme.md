# scriptype.github.io

![Screenshot](screenshot.png)

This is the source code of https://enes.in.

# Build

```
npm i
npm run build
```

# Development

```
npm i
npm start
```

`index.html` is an output file, so don't change it.

## Post-commit hook

To attach the last build info, a post-commit hook is run after each commit.

It looks like this:

```sh
#!/bin/sh
chmod -x .git/hooks/post-commit # disable hook
echo "compiling"
node -e "require('./compile')()"
echo "committing"
git commit -am "Add build info"
chmod +x .git/hooks/post-commit # re-enable hook
```
