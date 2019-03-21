module.exports = {
    devServer: {
        host: 'localhost',
        disableHostCheck: true
    },
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                appId: 'moe.sound.sora.monita',
                productName: 'Monita',
                win: {
                    target: 'msi',
                    // icon: 'build/icon.ico'
                }
            }
        }
    }
}