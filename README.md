## read and write GLTFS

load GLTF and print info

```
node index.js --input=foo.gltf --info=true
```

load GLTF and save as GLB (binary)

```
node index.js --input=foo.gltf --output=bar.glb --binary=true
```

load GLTF, recenter, save back out as GLTF

```
node index.js --input=foo.gltf --output=bar.gltf --recenter=true
```

