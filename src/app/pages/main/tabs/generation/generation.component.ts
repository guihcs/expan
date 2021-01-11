import { Component, OnInit } from '@angular/core';
import {ExperimentService} from "../../../../services/experiment/experiment.service";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-generation',
  templateUrl: './generation.component.html',
  styleUrls: ['./generation.component.css']
})
export class GenerationComponent implements OnInit {

  displayedColumns = ['dataset', 'decision', 'expected'];
  dataSource = new MatTableDataSource();
  selectedMetric = 'mcc';
  correctMean = '';
  ensembles = [];
  selectedEnsemble;

  constructor(
    private experimentService: ExperimentService
  ) { }

  ngOnInit(): void {
    // this.loadResult();

    this.ensembles = this.experimentService
      .getAllClassifiers()
      .filter(v => v.classifier.type == 'ensemble');
  }

  loadResult(){

    let data = [];
    let classifierExperiments = this.experimentService
      .getClassifierExperiments(this.selectedEnsemble);
    let singleBests = this.experimentService.getSingleBests(this.selectedMetric);

    classifierExperiments.forEach(cl => {
      let line = {};
      line['dataset'] = cl.dataset.name.substring(0, 20);
      line['decision'] = cl.classifier.selectionIndex?.map(v => v - 1);
      line['expected'] = singleBests.get(line['dataset']).map(v => cl.classifier.classifiers?.findIndex(i => i == v));
      line['correctCount'] = this.getCorrectCount(line['decision'], line['expected']);
      line['correctMap'] = this.getCorrectMap(line['decision'], line['expected']);
      data.push(line);
    });

    let m = 0;

    data.forEach(v => m += v.correctCount);

    this.correctMean = (m / data.length).toFixed(2);

    this.dataSource.data = data;
  }

  getCorrectCount(decision, expected){
    let correctCount = 0;
    for(let i = 0; i < decision?.length; i++){
      if(decision[i] == expected[i]) correctCount++;
    }
    return correctCount;
  }

  getCorrectMap(decision, expected){
    let correctMap = [];
    for(let i = 0; i < decision?.length; i++){
      if(decision[i] == expected[i]) correctMap[decision[i]] = 'best';
      else correctMap[decision[i]] = 'worst';
    }
    return correctMap;
  }

  setSelectedMetric(metric){
    this.selectedMetric = metric;
    this.loadResult();
  }

  setSelectedValue(cl){
    this.selectedEnsemble = cl;
    this.loadResult();
  }
}
