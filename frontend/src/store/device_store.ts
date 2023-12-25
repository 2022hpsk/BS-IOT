export interface device_type{
    device_id:number,
    name:string,
    type:number,
    type_name:string,
    description:string
    state:number,
    state_name:string
}
const type_class = ['其他','智能家居设备','智能医疗设备','可穿戴设备','智能车载设备','工业物联网设备']
const state_class = ['离线','在线']
export let device_list:device_type[] = [];
export let _device_id:number = 1
export const Use_Device=(data:number)=>{
    _device_id=data
}
// export let device:device_type;

export const Set_Device=(data:any[])=>{//参数类型为any
    device_list=[]//先清空
    for(let i:number = 0;i<data.length;i++){
        device_list.push({
            device_id:data[i].device_id,
            name:data[i].name,
            type:data[i].type,
            type_name:type_class[data[i].type],
            description:data[i].description,
            state:data[i].state,
            state_name:state_class[data[i].state]

        })
    }
}

