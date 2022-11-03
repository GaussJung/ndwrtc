module.exports = {
    apps: [{
        name: 'nd_socket',
        script: './server_socket.js',
        instances: 0,
        exec_mode: 'cluster' 
    }]
}