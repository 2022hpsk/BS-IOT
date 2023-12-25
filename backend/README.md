# 本地运行步骤

1、先调整app.js中的数据库账号密码，改为你自己的数据库账号密码。
2、在你的数据库执行source.sql脚本
3、运行命令
```
npm install

node app.js 
```

#mqtt模拟终端发送数据
另开一个命令行，运行命令
```
node message_publish.js
```
该命令通过mqtt向后端发送某台设备的模拟消息，可以通过更改message_publish.js里的第一行（id的值）来选择设备。