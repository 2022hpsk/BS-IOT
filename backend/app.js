// koa框架使用的中间件
const koa = require('koa')
const app = new koa()
// const path = require('path');
const Router=require('koa-router')
const router= new Router()
const bodyParser = require('koa-body')
const Sequelize = require('sequelize')
const cors=require("koa2-cors");

app.use(router.allowedMethods())
app.use(async (ctx, next) => {
  await bodyParser()(ctx, next);
});//这句话要在app.use(router.routes()) 前面！
app.use(router.routes()) 
app.use(cors());
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  // if (ctx.method == 'OPTIONS') {
  //     ctx.body = 200;
  // } else {
  //     await next();
  // }
});
app.listen(5321)
//app.listen(5321,'192.168.112.35')
// 连接数据库
const sequelize = new Sequelize('device_management', 'root', '521zhengjg', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 1000,
        min: 0,
        idle: 30000
    }
});

// 定义数据库表
const User = sequelize.define('user', {
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING(63),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(63),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(63),
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING(63),
        allowNull: false
    }
},{
    timestamps: false,
    freezeTableName:true
});
User.sync({force:false})


const Device = sequelize.define('device', {
    device_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING(63),
        allowNull: false
    },
    description: {
        type: Sequelize.STRING(511),
        allowNull: false
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'user_id'
        }
    },
    type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    state: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
},{
    timestamps: false,
    freezeTableName:true
});
Device.sync({force:false})

const Message = sequelize.define('message', {

    message_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    device_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'device',
            key: 'device_id'
        }
    },
    info: {
        type: Sequelize.STRING(511),
        allowNull: false
    },
    lat: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    lng: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    time: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: 0
    },
    alert: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
},{
    timestamps: false,
    freezeTableName:true
});
Message.sync({force:false})

const mqtt = require('mqtt')
const client = mqtt.connect("mqtts://t5e95595.ala.cn-hangzhou.emqxsl.cn:8883", {
  clientId:'deployment-t5e95595',
  clean: true,
  connectTimeout: 4000,
  username: "zhb",
  password: "zhb",
  reconnectPeriod: 1000,
});
const topic = "/nodejs/mqtt";
client.on("connect", () => {
  console.log("Connected");
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`);
  });
});
client.on("message", (topic, message) => {
    const message_json = JSON.parse(message.toString());
    // console.log(info)
    console.log("Received Message(json):", topic, message_json);
    const date=new Date();
    const date2=date.toISOString().slice(0, 19).replace('T', ' ');

    Message.create({
        device_id: message_json.device_id,
        info: message_json.info,
        lat: message_json.lat,
        lng: message_json.lng,
        time: date2,
        alert: message_json.alert,
    })
});

router.post('/user/Login',async(ctx,next)=>{
    try{
        console.log(ctx.request.body);
        const users = await User.findAll({
            where:{
                name: ctx.request.body.username
            }
        });
        if(users.length === 0){
            ctx.body={
                user_id:0,
                name:'',
                email:'',
                phone:'',
                state:2, //用户不存在
            }
        }else if(users[0].password === ctx.request.body.password  ){
                ctx.body={               
                    user_id: users[0].user_id,
                    name: users[0].name,
                    email: users[0].email,
                    phone: users[0].phone,
                    state:1, //登录成功
                }
        }else{
                ctx.body={
                    user_id:0,
                    name:'',
                    email:'',
                    phone:'',
                    state:3, //密码错误
                }
        }
        await next();
    }catch(e){
        console.log(e);
    }
});

router.post('/user/Register',async(ctx,next)=>{
    try{
        console.log(ctx.request.body);
        const users = await User.findAll({
            where:{
                name: ctx.request.body.username
            }
        });
        const users2 = await User.findAll({
            where:{
                email: ctx.request.body.email
            }
        });
        if(users.length != 0){//用户已经存在
            ctx.body={
                state:2 //2 用户已经存在
            }
        }else if(users2.length!=0){//邮箱已经存在
            ctx.body={
                state:3 //3 邮箱已经存在
            }     
        }else {
            const user = await User.create({
                name: ctx.request.body.username,
                password: ctx.request.body.password,
                email: ctx.request.body.email,
                phone: ctx.request.body.phone
            })
            ctx.body={
                state:1 //1 注册成功
            }     
        }
        await next();
    }catch(e){
        console.log(e);
    }
});


router.post('/user/Update',async(ctx,next)=>{
    console.log(ctx.request.body);
    try{ 
        ctx.body={
            state:4 //4 未知错误
        }  
        const user = await User.findAll({
            where:{
                user_id: ctx.request.body.user_id
            }
        });
       const user2= await User.findAll({
            where:{
                email: ctx.request.body.email
            }
        });

        if(user.email!=ctx.request.body.email && user2.length===0){//修改邮箱了，要改的邮箱可用
            await User.update(
                {email: ctx.request.body.email},
                {where:{user_id: ctx.request.body.user_id}}
                )
            ctx.body={
                state:2  //2 修改成功
            }  
        }
        if(user.password!=ctx.request.body.password){//要修改密码
            await User.update(
                {password: ctx.request.body.password},
                {where:{user_id: ctx.request.body.user_id}}
                )
            ctx.body={
                state:2  //2 修改成功
            }  
        }
        if(user.phone!=ctx.request.body.phone){//要修改手机号
            await User.update(
                {phone: ctx.request.body.phone},
                {where:{user_id: ctx.request.body.user_id}}
                )
            ctx.body={
                state:2  //2 修改成功
            }  
        }
        if((user.email!=ctx.request.body.email )&& user2.length!=0){//修改邮箱了，但要改的邮箱已被占用
            ctx.body={
                state:3  //3 邮箱已被占用
            }  
        }
        await next();
    }catch(e){
        console.log(e);
    }
});




router.post('/device/Add',async(ctx,next)=>{
    try{
        console.log(ctx.request.body);
        const device=await Device.create({
            name: ctx.request.body.name,
            description: ctx.request.body.description,
            user_id: ctx.request.body.user_id,
            type: ctx.request.body.type,
            state: 1  
        })
        ctx.body={
            state:1 //成功
        }
        // console.log(device);

        await next();
    }catch(e){
        console.log(e);
    }
});

router.post('/device/List',async(ctx,next)=>{
    try{
        console.log(ctx.request.body);
        const devices=await Device.findAll({
            where:{
                user_id: ctx.request.body.user_id
            }
        })
        ctx.body={
            data:devices
        }
        console.log(devices);

        await next();
    }catch(e){
        console.log(e);
    }
});

router.post('/device/Delete',async(ctx,next)=>{
    try{
        console.log(ctx.request.body);
        await Device.destroy({
            where:{
                device_id: ctx.request.body.device_id
            }
        })
        ctx.body={state:1//成功删除
        }
        await next();
    }catch(e){
        console.log(e);
    }
})

router.post('/device/Update',async(ctx,next)=>{
    try{
        console.log(ctx.request.body);
        await Device.update({
            name: ctx.request.body.name,
            description: ctx.request.body.description,
            type: ctx.request.body.type,
        },{where:{device_id:ctx.request.body.device_id}})
        ctx.body={
            state:1 //成功
        }
        // console.log(device);

        await next();
    }catch(e){
        console.log(e);
    }
});

router.post('/Message',async(ctx,next)=>{
    try{
        console.log(ctx.request.body);
        const messages=await  Message.findAll({
            where:{
                device_id: ctx.request.body.device_id
            }
        })
        ctx.body={
            data:messages
        }
        console.log(messages);

        await next();
    }catch(e){
        console.log(e);
    }
});