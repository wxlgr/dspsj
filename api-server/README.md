# 一、初始化git仓库

```js
git init
```

1. 根目录下添加`.gitignore`文件

   ```js
   node_modules
   static/ffout
   static/uploads
   ```

   

# 二 、安装依赖
> 由于镜像原因，这里安装ffcreator必须使用cnpm，已配置可以忽略安装cnpm
>
> `npm install -g cnpm --registry=https://registry.npmmirror.com`


C:\Users\用户名  目录下，修改。npmrc 追加canvas 和gl 的二进制文件的镜像配置，否则npm i ffcreator 会报错
```js
canvas_binary_host_mirror=https://registry.npmmirror.com/-/binary/canvas
gl_binary_host_mirror=https://registry.npmmirror.com/-/binary/gl
