module.exports = {
    apps: [{
        name: 'ndwrtc',
        script: './sslserver.js',
        instances: 0,
        exec_mode: 'cluster',
        exec_interpreter:'babel-node', 
        merge_logs: true 
    }]
}