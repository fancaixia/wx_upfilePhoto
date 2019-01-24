
var chooseImage = (t, count) =>{

  //选择图片时判断已选几张  更改可选数量
  if (t.data.uploadArr){
    let newchooseCount = count - t.data.uploadArr.length;
    t.setData({
      chooseCount: newchooseCount
    })

   }

    wx.chooseImage({
        count: t.data.chooseCount,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
            var imgArr = t.data.uploadArr || [];
            let arr = res.tempFiles;
            // console.log(res, " 选择图片列表")
            arr.map(function(v,i){
                v['progress'] = 0;
                imgArr.push(v)
            })
            t.setData({
                uploadArr: imgArr
            })

            let upFilesArr = getPathArr(t);
            if (upFilesArr.length > count-1) {
                let imgArr = t.data.uploadArr;
                let newimgArr = imgArr.slice(0, count)
                t.setData({
                    uploadBtn: false,
                    uploadArr: newimgArr
                })
            }
        },
    });
}

// 获取 图片数组
var getPathArr = t => {
    let imgarr = t.data.uploadArr || [];
    let upVideoArr = t.data.upVideoArr || [];
    let imgPathArr = [];
    let videoPathArr = [];
    imgarr.map(function (v, i) {
        imgPathArr.push(v.path)
    })
    upVideoArr.map(function (v, i) {
        videoPathArr.push(v.tempFilePath)
    })
    let filesPathsArr = imgPathArr.concat(videoPathArr);
    return filesPathsArr;
}

/**
 * upFilesFun(this,object)
 * object:{
 *    url     ************   上传路径 (必传)
 *    filesPathsArr  ******  文件路径数组
 *    name           ******  wx.uploadFile name
 *    formData     ******    其他上传的参数
 *    startIndex     ******  开始上传位置 0
 *    successNumber  ******     成功个数
 *    failNumber     ******     失败个数
 *    completeNumber  ******    完成个数
 * }
 * progress:上传进度
 * success：上传完成之后
 */

var upFilesFun = (t, data, progress, success) =>{
    let _this = t;
    let url = data.url;
    let filesPath = data.filesPathsArr ? data.filesPathsArr : getPathArr(t);
    let name = data.name || 'file';
    let formData = data.formData || {};
    let startIndex = data.startIndex ? data.startIndex : 0;
    let successNumber = data.successNumber ? data.successNumber : 0;
    let failNumber = data.failNumber ? data.failNumber : 0;
    if (filesPath.length == 0) {
      success([]);
      return;
    }

    const uploadTask = wx.uploadFile({
        url: url,
        filePath: filesPath[startIndex],
        name: name,
        formData: formData,
        success: function (res) {
          console.log(res, " :res")
            // var data = res.data
            successNumber++;
            // console.log('success',res)
            // 把后台返回的地址链接存到一个数组  通过setData 返回页面
            let uploaded = t.data.uploadedPathArr || [];
            // var da = JSON.parse(res.data);
            // console.log(da)
            // if (da.code == 1001) {
            //     // ### 此处可能需要修改 以获取图片路径
            //     uploaded.push(da.data)

                t.setData({
                    uploadedPathArr: uploaded
                })
            // }
        },
        fail: function(res){
            failNumber++;
            // console.log('fail', res)
            
        },
        complete: function(res){

            if (startIndex == filesPath.length - 1 ){
                // console.log('completeNumber', startIndex)
                // console.log('over',res)
                let sucPathArr = t.data.uploadedPathArr;
                success(sucPathArr);
                t.setData({
                    uploadedPathArr: []
                })
                console.log('成功：' + successNumber + " 失败：" + failNumber)
            }else{
                startIndex++;
                // console.log(startIndex)
                data.startIndex = startIndex;
                data.successNumber = successNumber;
                data.failNumber = failNumber;
                upFilesFun(t, data, progress, success);
            }
        }
    })

    uploadTask.onProgressUpdate((res) => {
        res['index'] = startIndex;
        // console.log(typeof (progress));
        if (typeof (progress) == 'function') {
            progress(res);
        }
        // console.log('上传进度', res.progress)
        // console.log('已经上传的数据长度', res.totalBytesSent)
        // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    })

}
module.exports = { chooseImage, upFilesFun, getPathArr}