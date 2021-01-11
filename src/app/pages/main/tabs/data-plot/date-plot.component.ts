import { Component, OnInit } from '@angular/core';
import {ExperimentService} from "../../../../services/experiment/experiment.service";
import * as shape from 'd3-shape';

@Component({
  selector: 'app-date-plot',
  templateUrl: './data-plot.component.html',
  styleUrls: ['./data-plot.component.css']
})
export class DatePlotComponent implements OnInit {

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
    let data = [];
    ['dataSize', 'features', 'targetCount', 'outlierCount'].forEach(n => {
      let res = this.experimentService
        .getExperimentResults([this.selectedValue], this.metric);
      let min = Math.log(this.getMin(n, res.slice(1)));
      let max = Math.log(this.getMax(n, res.slice(1)));

      let r = res
        .slice(1)
        .map(r => {
        return {name:  (Math.log(r.dataset[n]) - min) / (max - min), value: r[this.experimentService.getClassifierIndexName(this.selectedValue)].value}
      });

      data.push({
        name: n,
        series: r
      })
    })
    return data;
  }

  getMin(f, d: any[]){

    let max = +Infinity;

    d.forEach(v => {
      if(v.dataset[f] < max) max = v.dataset[f];
    })

    return max;
  }

  getMax(f, d: any[]){

    let max = -Infinity;

    d.forEach(v => {
      if(v.dataset[f] > max) max = v.dataset[f];
    })

    return max;
  }

  setSelectedMetric(m){
    this.metric = m;
    this.lineRelation = this.getRelations();
  }
}
