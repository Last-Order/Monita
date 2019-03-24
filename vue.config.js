module.exports = {
    devServer: {
        host: 'localhost',
        disableHostCheck: true
    },
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                appId: 'moe.sound.sora.monita',
                artifactName: "monita-${os}-${version}.${ext}",
                productName: 'Monita',
                win: {
                    target: ['msi'],
                    icon: 'build/icons/icon.ico'
                },
                mac: {
                    category: 'public.app-category.developer-tools',
                    target: ['dmg', 'zip']
                },
                linux: {
                    target: ['deb', 'appImage']
                }
            }
        }
    }
}