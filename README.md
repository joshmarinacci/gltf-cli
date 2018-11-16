## read and write GLTFS

*Note* GLTF-cli does not current load and save models with images

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

