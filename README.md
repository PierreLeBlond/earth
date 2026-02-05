# Dependencies

The lib build uses 3d-viewer as an external dependency.
Therefor it must be provided via a global variable `VIEWER`:

```js
const VIEWER = await import("@s0rt/3d-viewer");
window.VIEWER = VIEWER;
```

before including the lib:

```js
const Earth = (await import("/PATHTOLIB/index.js")).default;
```

# Deploy

Change version in package.json

`git commit -a -m "chore: vX.X.X"`
`git tag -a vX.X.X -m "vX.X.X"`
`git push --follow-tags`
