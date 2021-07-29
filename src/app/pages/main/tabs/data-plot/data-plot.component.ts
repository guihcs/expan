import { Component, OnInit } from '@angular/core';
import {ExperimentService} from "../../../../services/experiment/experiment.service";
import * as shape from 'd3-shape';

@Component({
  selector: 'app-date-plot',
  templateUrl: './data-plot.component.html',
  styleUrls: ['./data-plot.component.css']
})
export class DataPlotComponent implements OnInit {

  lineRelation = [];
  ensembles = [];
  curve: any = shape.curveLinear;
  selectedValue;
  metric = 'mcc';

  constructor(private experimentService: ExperimentService) { }

  ngOnInit(): void {
    this.ensembles = this.experimentService.getAllClassifiers();
  }

  setSelectedValue(cl){
    this.selectedValue = cl;
    this.lineRelation = this.getRelations()
  }

  getRelations(){
    let res = this.experimentService
      .getExperimentResults([this.selectedValue], this.metric);


    res = res.slice(1);
    let data = [];

    ['dataSize', 'features', 'targetCount', 'outlierCount'].forEach(n => {

      let min = Math.log(this.getMin(n, res));
      let max = Math.log(this.getMax(n, res));


      let r = res.map(r => {
        return {name:  (Math.log(r['0'][n]) - min) / (max - min), value: r[this.selectedValue.id].value}
      });


      data.push({
        name: n,
        series: r
      })
    });

    ['mean', 'std', 'mode'].forEach(n => {

      let min = Math.log(this.getArrMin(n, res));
      let max = Math.log(this.getArrMax(n, res));

      let r = res.map(r => {

        let mean = this.getArrMean(r[0][n]);
        return {name: (Math.log(mean) - min) / (max - min), value: r[this.selectedValue.id].value};
      })

      data.push({
        name: n,
        series: r
      })

    })




    return data;
  }

  getArrMean(data){
    let reduce = data.reduce((previousValue, currentValue) => previousValue + currentValue);
    return reduce / data.length;
  }

  getArrMin(f, d){
    let max = +Infinity;

    d.forEach(v => {
      let dataset = v['0'];
      let mean = this.getArrMean(dataset[f]);
      if(mean < max) max = mean;
    })

    return max;
  }
  getArrMax(f, d){
    let max = -Infinity;

    d.forEach(v => {
      let dataset = v['0'];
      let mean = this.getArrMean(dataset[f]);
      if(mean > max) max = mean;
    })

    return max;
  }



  getMin(f, d: any[]){

    let max = +Infinity;

    d.forEach(v => {
      let dataset = v['0'];

      if(dataset[f] < max) max = dataset[f];
    })

    return max;
  }

  getMax(f, d: any[]){

    let max = -Infinity;

    d.forEach(v => {
      let dataset = v['0'];
      if(dataset[f] > max) max = dataset[f];
    })

    return max;
  }

  setSelectedMetric(m){
    this.metric = m;
    this.lineRelation = this.getRelations();
  }
}
