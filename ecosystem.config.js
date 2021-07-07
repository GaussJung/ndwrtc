module.exports = {
    apps: [{
        name: 'ndwrtc',
        script: './server-startup.js',
        instances: 0,
        exec_mode: 'cluster',
        merge_logs: true,
        env: {
            COMMON_VARIABLE: 'true'
          },
        env_production : {
            NODE_ENV: 'production'
        }
    }]
}