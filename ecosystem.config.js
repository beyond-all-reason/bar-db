module.exports = {
    apps: [{
        name: "bar-db",
        script: "npm",
        args: "start",
        restart_delay: 60000
    }]
}