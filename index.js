//global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
global.XMLHttpRequest = require('xhr2')
const THREE = require('three')
const fs = require('fs')
const path = require('path')


THREE.FileLoader = function(manager) {
    // this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;
}
Object.assign( THREE.FileLoader.prototype, {
    load: function ( url, onLoad, onProgress, onError ) {
        console.log("loading from ",url)
        // console.log("the path is",this.path)
        // console.log("responsetype is",this.responseType)
        fs.readFile(url, (err,data)=>{
            // console.log("loaded up a buffer",data)
            onLoad(data.buffer)
        })
    },

    setPath: function ( value ) {
        this.path = value;
        return this;
    },

    setResponseType: function ( value ) {
        this.responseType = value;
        return this;
    },

    setWithCredentials: function ( value ) {
        this.withCredentials = value;
        return this;
    },

    setMimeType: function ( value ) {
        this.mimeType = value;
        return this;
    },

    setRequestHeader: function ( value ) {
        this.requestHeader = value;
        return this;
    }

})

eval(fs.readFileSync('./node_modules/three/examples/js/loaders/GLTFLoader.js').toString())
// console.log("GLTF CLI",THREE.GLTFLoader)

function processOptions(arr, defaults) {
    // console.log("processing",arr)
    const opts = {}
    Object.assign(opts,defaults)
    arr.map(arg => {
        if(arg.indexOf('--')===0) {
            arg = arg.slice(2)
            if (arg.indexOf('=') > 0) {
                // console.log("splitting", arg)
                const parts = arg.split("=")
                let value = parts[1]
                if(value === 'true') value = true
                if(value === 'false') value = false
                opts[parts[0]] = value
            }
        }
    })
    return opts
}
const missing = (arg) => (typeof arg === 'undefined')



const opts = processOptions(process.argv.slice(2),{
    binary:false,
    info:false,
})

// console.log('running with options',opts)


if(missing(opts.input)) return console.error("ERROR: 'input' argument is missing!")


if(opts.info) return printInfo(opts)


function reallyPrintInfo(model) {
    // console.log("model",model.scene.children[0].geometry.attributes.position)
    console.log("version",model.asset.version)
    console.log("scenes",model.scenes.length)
    console.log("cameras",model.cameras.length)
    console.log("animations",model.animations.length)


    // console.log(model.scene)
    model.scene.traverse((obj)=>{
        console.log("object",obj.type,obj.name,obj.uuid)
        // console.log(obj)
        console.log("position",obj.position)
        console.log("rotation",obj.rotation)
        console.log("scale",obj.scale)

        if(obj.isMesh) {
            // console.log("doing mesh",obj.geometry)
            console.log("geometry type:",obj.geometry.type, " name:",obj.geometry.name, "uuid:",obj.geometry.uuid)
            obj.geometry.computeBoundingSphere()
            console.log("geometery",obj.geometry.boundingSphere)
            if(obj.geometry.isBufferGeometry) {
                console.log("doing buffered geometry")
                console.log("geo position count: ", obj.geometry.attributes.position.count)
            }
        }
    })
}
function printInfo(opts) {
    // console.log("loading",opts.input)
    const loader = new THREE.GLTFLoader()
    // console.log("path is",path.parse(opts.input))
    const parts = path.parse(opts.input);
    // console.log("parts are",parts)
    // const data = fs.readFileSync(opts.input).toString()
    // console.log('data is',data)
    const url = ''+opts.input
    // console.log('loading from the url',url)
    loader.load(url,
        (foo)=>{
            reallyPrintInfo(foo)
        },
        (bar)=>{
            console.log("prog",bar)
        },
        (err)=>{
            console.log("got ane rror",err)
        })
    // loader.load(opts.input,(gltf) =>{
    //     console.log("loaded hte gltf")
    // })
}

/*
//- Input param
- Binary param
- Output name or auto detect. Never overwrite
- Recenter = true
- Info prints vertexes faces animations models lights layers of wrapping around a mesh. Estimated size.

 */
