### wx_UploadFile   小程序 + node 实现图片文件上传（附源码可预览上传结果）

![实现效果](https://github.com/fancaixia/wx_UploadFile/blob/master/pic/001.png)

本案例服务端使用node+express简单实现 ，不涉及mysql数据库存储，只为演示，主要偏向与前端页面


### 启动node服务后，上传结果可在node_test/upload 查看 

**（node启动后记得修改上传地址哦）**

1  npm/cnpm install   ( 安装依赖 )

2 node app  （启动服务）


### 本案例简单实现思路

data ：{

    upFilesBtn: true,     //上传数量 >= maxUploadLen  控制 添加按钮 显示隐藏
    upFilesProgress: false,   //上传进度显示隐藏
    maxUploadLen: 6,  //固定不变最多上传数量
    chooseCount:6,    //跟随选择与删除图片事件变化   限制可选图片数量
    upImgArr:null,     //存储选择图片

}



点击添加图片触发  wx.chooseImage ，选择完成后将已选文件列表存入数组 this.data. upImgArr

wx.chooseImage 之前判断是否存在已选图片，存在的话重新计算可选数量（ maxUploadLen - upImgArr.length）

删除已选图片后，更新数组upImgArr  重新计算可选数量（ maxUploadLen - upImgArr.length）

点击上传按钮时判断upImgArr是否为空  不为空则继续上传

上传完成后清空upImgArr
