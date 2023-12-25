
let id=1
let message_publish={
    device_id: id.toString(),
    info: "haha",
    lat:"52",
    lng:"123",
    alert:"0"
}


const mqtt = require('mqtt')
const client = mqtt.connect("mqtts://t5e95595.ala.cn-hangzhou.emqxsl.cn:8883", {
  clientId:'BS_Devices_generate',
  clean: true,
  connectTimeout: 4000,
  username: "Devices",
  password: "Devices",
  reconnectPeriod: 1000,
});
const topic = "/nodejs/mqtt";
client.on("connect", () => {
  console.log("Connected");
//   client.subscribe([topic], () => {
//     console.log(`Subscribe to topic '${topic}'`);
//   });
  for(let i=0;i<5;i++){

    message_publish["info"]="this is message published by mqtt, "+i.toString()
    message_publish["lat"]=(Math.random()*(50-40)+40).toString()
    message_publish["lng"]=(Math.random()*(130-110)+110).toString()
    message_publish["alert"]=i%3==0?"1":"0"
    client.publish(topic, JSON.stringify(message_publish),{ qos: 0, retain: false }, (error) => {
        if (error) {
          console.error(error)
        }
    })
    console.log("publish: ",message_publish)
  }
});


// client.on("message", (topic, message) => {
//      console.log(message.toString())
// });


