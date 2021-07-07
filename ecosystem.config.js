module.exports = {
    apps: [{
        name: 'ndwrtc',
        script: 'npm start sslserver.js',
        instances: 0,
        exec_mode: 'cluster'
    }]
}