module.exports = {
    apps: [{
        name: "backend",
        script: "./dist/index.js",
        instances: 1,
        exec_mode: "cluster",
        max_memory_restart:"1G",
        
    }]
}