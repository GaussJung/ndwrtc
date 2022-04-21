module.exports = {
    apps: [{
        name: 'ndwrtcSSL',
        script: './sslserver.js',
        instances: 0,
        exec_mode: 'cluster'
    }]
}