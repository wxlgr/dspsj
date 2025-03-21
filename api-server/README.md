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


在刚开始安装的过程，并不顺利，每一次npm install FFCreator 的时候控制台就是一篇红，探索半天，发现是因为依赖的canvas和gl每一次拉取都失败，于是找到了镜像源先下载这两个难搞定的依赖再去安装FFcreator。


1 安装Canvas

`npm install canvas --canvas_binary_host_mirror=https://registry.npmmirror.com/-/binary/canvas `


2 安装gl

`npm install gl --gl_binary_host_mirror=https://registry.npmmirror.com/-/binary/gl`


```js
cnpm i
