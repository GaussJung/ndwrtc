module.exports = {
    apps: [{
        name: 'ndwrtc',
        script: './server.js',
        instances: 0,
        exec_mode: 'cluster' 
    }]
}