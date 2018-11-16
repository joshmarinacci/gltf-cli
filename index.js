class Blob {
    constructor(buffers,options) {
        this.buffers = buffers.map(b => {
            if(b instanceof DataView) return b.buffer
            return b
        })
        this.options = options
        console.log("made a blob",this.buffers)
        // console.log("first is",this.buffers[0])
    }
}
global.Blob = Blob


function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

class FileReader {
    constructor() {
    }
    readAsDataURL(blob) {
        const bufs = blob.buffers.map(b => Buffer.from(new Uint8Array(b)))
        const buf = Buffer.concat(bufs)
        this.result = 'data:application/octet-stream;base64,'+buf.toString('base64')
        setTimeout(()=> this.onloadend(),0)
    }
    readAsArrayBuffer(blob) {
        console.log("reading as an array buffer",blob)
        const bufs = blob.buffers.map(b => {
            return new Uint8Array(b)
        })
        // console.log("convertted to",bufs)
        const buf = Buffer.concat(bufs)
        // console.log("length of final buffer is", buf.length)
        this.result = toArrayBuffer(buf)
        // this.result = buf.buffer
        // console.log("and the result is", this.result)
        setTimeout(()=> this.onloadend(),0)
    }
}
global.window = { FileReader: FileReader }



const THREE = require('three')
const fs = require('fs')

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
eval(fs.readFileSync('./node_modules/three/examples/js/exporters/GLTFExporter.js').toString())

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

console.log('running with options',opts)


if(missing(opts.input)) return console.error("ERROR: 'input' argument is missing!")


if(opts.info) return printInfo(opts)
if(opts.output) return outputGLTF(opts)


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
                // console.log("doing buffered geometry")
                console.log("geo position count: ", obj.geometry.attributes.position.count)
            }
        }
    })
}
function printInfo(opts) {
    const loader = new THREE.GLTFLoader()
    const url = ''+opts.input
    loader.load(url,
        (foo)=>  reallyPrintInfo(foo),
        (bar)=> console.log("prog",bar),
        (err)=> console.log("got ane rror",err)
    )
}
function reallyOutputGLTF(model,opts) {
    const exp = new THREE.GLTFExporter()
    const o = {}
    if(opts.binary) o.binary = true
    exp.parse(model.scene,(data)=>{
        console.log("writing to ",opts.output)
        console.log("array buffer is",data)
        if(opts.binary === true) {
            var dv = new DataView( data );
            for(let i=0; i<20; i++) {
                console.log('value',i,dv.getInt8(i))
            }

            fs.writeFileSync(opts.output,Buffer.from(new Uint8Array(data)))
        } else {
            fs.writeFileSync(opts.output, JSON.stringify(data, null, 2))
        }
    },o)
}
function outputGLTF(opts) {
    const loader = new THREE.GLTFLoader()
    loader.load(opts.input,(loaded)=>reallyOutputGLTF(loaded,opts),undefined,(err)=>console.error(err))
}

/*
//- Input param
- Binary param
- Output name or auto detect. Never overwrite
- Recenter = true
- Info prints vertexes faces animations models lights layers of wrapping around a mesh. Estimated size.

 */
