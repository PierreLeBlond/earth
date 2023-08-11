# Dependencies

The lib build uses 3d-viewer as an external dependency.
Therefor it must be provided via a global variable `VIEWER`:

```js
  const VIEWER = await import('@s0rt/3d-viewer');
  window.VIEWER = VIEWER;
```

before including the lib:

```js
  const Earth = (await import('/PATHTOLIB/index.js')).default;
```

# Deploy

`npm version patch|minor|major -m "chore: vX.X.X"`



