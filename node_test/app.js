/**
 * Created by Lenovo on 2018/11/14.
 */

const express= require('express');
const multiparty=require('multiparty')
const fs = require('fs');
const path= require("path");
const uuid=require('uuid')
const app=express();

//读取图片目录
app.use(express.static('public'))
//上传文件目录
app.use('/upload',express.static('upload'))

app.post('/adddata',function (req,res) {
   
    const form = new multiparty.Form();
    //设置单文件大小限制 2M 
    form.maxFieldsSize = 2 * 1024 * 1024;
    form.uploadDir='upload'   

   
    form.parse(req,function (err,flields,files) {
        // console.log(files, " :files")
        //拿到扩展名
        const extname = path.extname(files.file[0].originalFilename);
        //uuid生成 图片名称
        const nameID = (uuid.v4()).replace(/\-/g,'');
        const oldpath = path.normalize(files.file[0].path);

        //新的路径
        let newfilename = nameID+extname;
        var newpath =  './upload/'+newfilename;
        //改名
        fs.rename(oldpath,newpath,function(err){
            if(err){
       
                res.send({ msg: '文件上传失败:' }).end();
            }else{
                res.send({ msg: '文件上传成功:' }).end();
            }

            
            
        })


    })

})

app.listen(8090)