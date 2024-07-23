# uts-hk
### 开发文档
[UTS 语法](https://uniapp.dcloud.net.cn/tutorial/syntax-uts.html)
[UTS API插件](https://uniapp.dcloud.net.cn/plugin/uts-plugin.html)
[UTS 组件插件](https://uniapp.dcloud.net.cn/plugin/uts-component.html)
[Hello UTS](https://gitcode.net/dcloud/hello-uts)
#使用说明
###方法以及参数
```javascript
[
	{
					"method":"init",
					"name":"初始化",
					params:"host,appKey,appSecret"
				},
				{
					"method":"getCameras",
					"name":"获取摄像头列表",
					params:"pageNo,pageSize"
				},
				{
					"method":"previewURLs",
					"name":"获取预览地址",
					params:"cameraIndexCode"
				},
				{
					"method":"playbackURLs",
					"name":"获取回放地址",
					params:"cameraIndexCode"
				},
				
				{
					"method":"talkURLs",
					"name":"获取对讲地址",
					params:"cameraIndexCode"
				},
				
				{
					"method":"startVoiceTalk",
					"name":"开启对讲",
					params:"talkUrl"
				},
				{
					"method":"stopVoiceTalk",
					"name":"关闭对讲",
					params:""
				},
				{
					"method":"controlling",
					"name":"云台控制，放大，缩小，拉近，拉远等",
					params:"cameraIndexCode,command"
				},
	]
```
#使用示例
```javascript
import {
	init,
	getCameras			
} from "@/uni_modules/hmj-hk";

var host,appKey,appSecret;
init(host,appKey,appSecret)

var listStr = getCameras(1, 10);
console.log(listStr)
```

