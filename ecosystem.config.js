module.exports = {
    apps: [{
        name: 'ndwrtc',
        script: './sslserver.js',
        instances: 0,
        exec_mode: 'cluster' 
    }]
}