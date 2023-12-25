export interface message_type{
    device_id:number,
    info: string,
    lat: number,
    lng: number,
    time: Date,
    alert: number,
    alert_name: string
}
export let message_id:number=0
export const set_message_id=(id:number)=>{
    message_id=id
}
export let message_list:message_type[]=[]
const alert_type=['正常消息','报警消息']
export const Set_Message=(data:any[])=>{
    message_list=[]
    for(let i:number=0;i<data.length;i++){
        message_list.push({
            device_id: data[i].device_id,
            info: data[i].info,
            lat: data[i].lat,
            lng: data[i].lng,
            time: data[i].time,
            alert: data[i].alert,
            alert_name: alert_type[data[i].alert]
        })
    }
    message_list.sort((m1,m2)=>{
        if(m1.time>m2.time)
            return -1;
        else return 1;
    })
    console.log(message_list)
}

