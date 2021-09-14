# condition-filter-loader
## purpose
    1. This plugin serves as a connecting link between the preceding and the following
    2. There is a filtering function during loader execution
    3. When a plugin needs to be executed under certain conditions, but it has no filter conditions, you can use this plugin

## options
    1. config.projectPath
        1. project root dir
            1. 项目根目录
        2. The user-defined directory can be implemented. In principle, it can not be specified, because it will be obtained from the running direc
            1. 可以让你自定义项目目录，但是原则上不需要的，因为会到运行目录下去获取
        3. This parameter is mainly used to execute loader 
            1. 这个参数的目的主要为了执行loader
    2. config.loader
        1. Subsequent loaders to be converted
            1. 后续需要转换的loader
        2. this parameter is required
            1. 这个参数是必须的
    3. config.include
        1. Conditions to include，When the condition is successful, the subsequent conversion loader will not be executed
            1. 需要包含的条件，如果条件成功了筛选成功了不会执行后续条件
        2. Can be string, regular, array, array must be string, regular. The string must be a path
            1. 可以是字符串，正则，数组，数组中必须是字符串，正则. 字符串必须是路径
    4. config.exclude
        1. Conditions to be excluded ,When the condition is successful, the subsequent conversion loader will not be executed
            1. 需要包含的条件，如果条件成功了筛选成功了不会执行后续条件
        1. Can be string, regular, array, array must be string, regular. The string must be a path
            1. 可以是字符串，正则，数组，数组中必须是字符串，正则. 字符串必须是路径
    5. config.loaderPath
        1. Relying on loader to make directory 
            1. 依赖loader所在的目录
        2. default value be project root dir + node_modules
            1. 默认值是项目根目录/node_modules
    6. other config
        1. The parameters required by the conversion plugin can be written in this location，look example for
            1. 转换插件需要的参数可以写在这个。看如下实例
## install
```
    1. npm install condition-filter-loader -D
    2. yarn add condition-filter-loader -D
```
## example for
    1. Business scenario: meet the requirement that image compression is not performed under one path, and image compression is performed for others
    2. 业务场景：满足某个路径下不执行图片压缩，其他的执行图片压缩
### webpack.config.js
```
{
    test: /\.(png|jpe?g|gif|webp)(\?.*)?$/
    use: [
        {
            loader: "url-loader",
            options: {
                limit: 4096,
            },
        },
        {
            loader: 'condition-filter-loader',
            options: {
                config: {
                    loader： “image-webpack-loader”,
                    // When the condition < exclude > is met, you do not want to execute image webpack loader 
                    // 满足条件<exclude>的时候，不想执行image-webpack-loader
                    exclude: path.resolve(__dirname, 'src/assets/img/graph')
                },
                // The following are the parameters required to convert the loader itself
                // 以下是转换loader本身需要参数
                mozjpeg: {
                  progressive: true,
                  quality: 50
                },
                optipng: {
                  enabled: false
                },
                pngquant: {
                  quality: [0.65, 0.9],
                  speed: 4
                },
                gifsicle: {
                  interlaced: false
                },
                webp: {
                  quality: 75
                },
                bypassOnDebug: true
            }
        }
    ]
}
```
### vue.config.js
```
chainWebpack: (config) => {
    config.module
      .rule('images')
      .use('condition-filter-loader')
      .after('url-loader')
      .loader("condition-filter-loader")
      .options({
        config: {
            exclude: path.resolve(__dirname, 'src/assets/img/graph'),
            loader: 'image-webpack-loader',
        },
        mozjpeg: {
          progressive: true,
          quality: 50
        },
        optipng: {
          enabled: false
        },
        pngquant: {
          quality: [0.65, 0.9],
          speed: 4
        },
        gifsicle: {
          interlaced: false
        },
        webp: {
          quality: 75
        },
        bypassOnDebug: true
      })
}
```
## Contact me
[Github]()