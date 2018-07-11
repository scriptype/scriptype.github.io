# scriptype.github.io

This is the source code of https://enes.in.

# Development notes

- Don't change index.html, it's an output file. Make changes to index.hbs instead.
- If you change index.hbs, make sure to run `npm run dev` to see changes take effect.
- A build script will run after each commit and create another commit for the build.
  You don't need to care about it. When you push the changes, your commits + build commit
  will be pushed.
- You don't need to run `npm run build`. It's for the mentioned build script's use
