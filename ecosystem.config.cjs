module.exports = {
    apps: [
        {
            name: 'DansQuelBarJeVaisCeSoir',
            port: '3630',
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs'
        }
    ]
}