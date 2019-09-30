# ios 问题库
## Safari浏览器下载包含中文名的文件文件名会乱码
```java{11,12,13,14,15,16,17,18,19,20}
public void downFile(HttpServletResponse response, HttpServletRequest httpServletRequest) {
        response.setContentType("application/octet-stream");
 
        String path = httpServletRequest.getParameter("file");
        String fileName=path.substring(path.lastIndexOf("/")+1);
        try {
            //bugfix: fileName包含中文导致fileNotFound
            path = path.substring(0,path.lastIndexOf("/")+1) + URLEncoder.encode(fileName, "UTF-8");
 
            String userAgent = httpServletRequest.getHeader("User-Agent").toLowerCase();
            //chrome头也包含safari,需要排除chrome
            if(userAgent.contains("safari") && !userAgent.contains("chrome")){
                //处理safari的乱码问题
                byte[] bytesName = fileName.getBytes("UTF-8");
                fileName = new String(bytesName, "ISO-8859-1");
                response.setHeader("content-disposition", "attachment;fileName="+ fileName);
            }else{
                response.setHeader("content-disposition", "attachment;fileName="+ URLEncoder.encode(fileName, "UTF-8"));
            }
//            //文件名外的双引号处理firefox的空格截断问题
//            response.setHeader("Content-disposition", String.format("attachment; filename=\"%s\"", fileName));
 
            OutputStream output = response.getOutputStream();
            URL url = new URL(path);
            //输入缓冲流
            BufferedInputStream bis=new BufferedInputStream(url.openStream());
            //输出缓冲流
            BufferedOutputStream bos=new BufferedOutputStream(output);
            //缓冲字节数
            byte[] data =new byte[4096];
            int size=0;
            size=bis.read(data);
            while (size!=-1){
                bos.write(data,0,size);
                size=bis.read(data);
            }
            bis.close();
            bos.flush();//清空输出缓冲流
            bos.close();
        } catch (Exception e) {
            logger.error("downFile error",e);
        }
}


```

## ios 单页应用路由跳转地址不改变问题

- 在需要**获取当前地址**的页面采用`location.href`的方式进行跳转
- 不需要获取当前地址的页面采用路由跳转

## ios iframe 问题
- ios中的iframe不支持load事件

## ios vant的滑动选择组件在ios11下不能正常滑动问题

- 系统升级到ios12可以解决
- 用css样式解决
```scss
.van-picker-column {
    position: relative;
    z-index: 1;
    &:before {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      content: "";
    }
    & > ul {
      z-index: -1;
      position: relative;
    }
  }
```

## ios 微信底部历史管理栏遮挡内容问题

给wrapper页面添加padding值就可以了

```scss
#app {
  // 兼容 ios 历史回退栏高度问题
  >div{
    padding-bottom: 1px;
  }
}
```