const api = require("../../utils/activity_api.js");
const upFiles = require('../../utils/activity_upFiles.js')

Page({

  data: {
    uploadBtn: true,     //上传数量 >= maxUploadLen  控制 添加按钮 显示隐藏
    uploadProgress: false,   //上传进度显示隐藏
    maxUploadLen: 6,  //固定不变最多上传数量
    chooseCount:6,    //跟随选择与删除图片事件变化   限制可选图片张数 
    uploadArr:null,     //存储选择图片
  },

  onLoad(options){
   
  },
  onShow () {

  },
   
  // 预览图片
  previewImg: function (e) {
    let imgsrc = e.currentTarget.dataset.presrc;
    let _this = this;
    let arr = _this.data.uploadArr;
    let preArr = [];
    arr.map(function (v, i) {
      preArr.push(v.path)
    })
    //   console.log(preArr)
    wx.previewImage({
      current: imgsrc,
      urls: preArr
    })
  },
  // 删除上传图片 
  delFile: function (e) {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '您确认删除吗？',
      success: function (res) {
        if (res.confirm) {
          let delNum = e.currentTarget.dataset.index;
          let delType = e.currentTarget.dataset.type;
          let uploadArr = _this.data.uploadArr;
          let upVideoArr = _this.data.upVideoArr;
  
            uploadArr.splice(delNum, 1)
            _this.setData({
              uploadArr: uploadArr,
            })

          let upFilesArr = upFiles.getPathArr(_this);
          
          if (upFilesArr.length < _this.data.maxUploadLen) {
            _this.setData({
              uploadBtn: true,
              chooseCount: _this.data.maxUploadLen - upFilesArr.length
            })
          }

        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })


  },
  // 选择图片
  uploadFiles: function (e) {
    var _this = this;
    upFiles.chooseImage(_this, _this.data.maxUploadLen)
  },
  // 上传文件
   subFormData  () {
     let _this = this;
     return new Promise(function(resolve,reject){
      
       let upData = {};
       let uploadArr = _this.data.uploadArr;
       let upVideoArr = _this.data.upVideoArr;
       _this.setData({
         uploadProgress: true,
       })
       upData['url'] = api.activity_upFiles.url;
       upFiles.upFilesFun(_this, upData, function (res) {
         // console.log('上传失败001',res)
         if (res.index < uploadArr.length) {
           uploadArr[res.index]['progress'] = res.progress

           _this.setData({
             uploadArr: uploadArr,
           })
         } else {
           let i = res.index - uploadArr.length;
           upVideoArr[i]['progress'] = res.progress
           _this.setData({
             upVideoArr: upVideoArr,
           })
         }
         //   console.log(res)
       }, function (err) {

         resolve({code:1, result: err})
         console.log('上传返回结果002', err)

       })


     })

  },
  
  // 提交评价  next
  saveFiles() {

    if (!this.data.uploadArr || this.data.uploadArr.length <= 0){
            console.log('没选图片')

    }else{
      // console.log('选择图片了', this.data.uploadArr)
        this.subFormData().then((res) => {
          console.log(res, " 上传结果")
          //code 为上传成功 图片
          if (res.code == 1) {
            wx.showToast({
              title: '文件上传成功',
            })
            this.setData({
              uploadProgress: false,
              uploadBtn:true,
              uploadArr:null,
            })

          }
        })

    }

  },


})