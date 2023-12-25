
<template>
  <div class="content">
    <div id="char1" style="width: 1000px; height:300px" class="chart"></div>
    <div class="pie-charts-container" >
      <div id="char2" style="width: 500px; height:300px"></div>
      <div id="char3" style="width: 300px; height:300px"></div>
    </div>
  </div>
</template>
      
<script lang="ts" setup>
import { device_list } from '../../store/device_store';
import {onMounted} from 'vue';
// Echarts 为init（dom元素后的类型）
// EChartsOption 为 option 的类型
import {ECharts, EChartsOption, init} from 'echarts';
let num:number=device_list.length
let Types:number[]=[0,0,0,0,0,0]
let online:number=0
onMounted(() => {
      for(let i:number=0;i<num;i++){
        if(device_list[i].state == 1)online++;
        switch(device_list[i].type){
          case 0:{
            Types[0]++;
            break;
          }
          case 1:{
            Types[1]++;
            break;
          }
          case 2:{
            Types[2]++;
            break;
          }
          case 3:{
            Types[3]++;
            break;
          }
          case 4:{
            Types[4]++;
            break;
          }
          case 5:{
            Types[5]++;
            break;
          }
        }
      }
      const charEle1 = document.getElementById('char1') as HTMLElement;
      const charEch1: ECharts = init(charEle1);
      const option1: EChartsOption = {
        xAxis: {
          type: 'category',
          data: ['其他','智能家居设备','智能医疗设备','可穿戴设备','智能车载设备','工业物联网设备']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [Types[0], Types[1], Types[2], Types[3], Types[4], Types[5]],
            type: 'bar',
            itemStyle: {
              borderRadius: 5,
              borderWidth: 1,
              borderType: 'solid',
              borderColor: '#73c0de',
              shadowColor: '#5470c6',
              shadowBlur: 3
            }
          }
        ]
      };
      charEch1.setOption(option1);
      const charEle2 = document.getElementById('char2') as HTMLElement;
      const charEch2: ECharts = init(charEle2);
      const option2: EChartsOption = {
        legend: {
          orient: 'vertical',
          right:'70%',
          data: ['其他','智能家居设备','智能医疗设备','可穿戴设备','智能车载设备','工业物联网设备']
        },
        series: [
          {
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            labelLine: {
              show: false
            },
            emphasis: {
              label: {
      
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            data: [{value:Types[0],name:'其他'}, {value:Types[1],name:'智能家居设备'}, {value:Types[2],name:'智能医疗设备'}, {value:Types[3],name:'可穿戴设备'}, {value:Types[4],name:'智能车载设备'}, {value:Types[5],name:'工业物联网设备'}],
            type: 'pie',

          }
        ]
      };
      charEch2.setOption(option2);
      const charEle3 = document.getElementById('char3') as HTMLElement;
      const charEch3: ECharts = init(charEle3);
      const option3: EChartsOption = {
        legend: {
              orient: 'vertical',
              right:'80%',
              data: ['离线','在线']
            },
        series: [
          {
            data: [{value:num-online,name:'离线'}, {value:online,name:'在线'}],
            type: 'pie',
            radius: '100'
          }
        ]
      };
      charEch3.setOption(option3);
});

</script>
    
    
<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background-color: #f5f5f5; /* 轻色背景 */
}

.chart {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.chart:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
.pie-charts-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 80px; /* 控制两个图表之间的间隔 */
}   
</style>