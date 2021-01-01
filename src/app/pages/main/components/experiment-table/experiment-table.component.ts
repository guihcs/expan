import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-experiment-table',
  templateUrl: './experiment-table.component.html',
  styleUrls: ['./experiment-table.component.css']
})
export class ExperimentTableComponent implements OnInit {

  displayedColumns: string[] = ['dataset'];
  dataSource = new MatTableDataSource();

  @Input() experiments: BehaviorSubject<Map<string, any>>;
  @Input() calcFunction: BehaviorSubject<any>;

  constructor() { }

  ngOnInit(): void {
    this.experiments.subscribe(experiments => {

      this.loadExperiments(experiments);
    });

    this.calcFunction.subscribe(v => {
      this.loadExperiments(this.experiments.value);
    })
  }

  loadExperiments(experiments){
    const classifiers = new Set();
    let data = [];

    experiments.forEach((value, key) => {
      let line = {};

      value.forEach(e => {
        if(e.classifier in line && new Date(e.date) < line[e.classifier].date) return;

        line[e.classifier] = {
          value: this.calcFunction.value(e.result.tp, e.result.tn, e.result.fp, e.result.fn),
          date: new Date(e.date)
        };
        classifiers.add(e.classifier);
      });


      let best = this.getBestClassifiers(line);

      this.formatResult(line);

      line['best'] = best;
      line['dataset'] = {value: key};
      data.push(line);
    });

    let classifierNames: any[] = Array.from(classifiers);

    let mean = {};

    classifierNames.forEach(c => {
      mean[c] = {value: 0};
    });

    data.forEach(d => {
      classifierNames.forEach(c => {

        const v = parseFloat(d[c].value);
        if (isNaN(v)) return;

        mean[c].value += v;
      });
    });

    classifierNames.forEach(c => {
      mean[c].value /= data.length;
    });

    this.formatResult(mean);

    mean['best'] = this.getBestClassifiers(mean);
    mean['dataset'] = {value: 'Mean'};

    data = [mean, ...data];

    this.displayedColumns = ['dataset', ...classifierNames];

    this.dataSource.data = data;
  }

  getBestClassifiers(classifiers){
    let v = -Infinity;
    let best = [];

    Object.keys(classifiers).forEach(k => {
      if (v < classifiers[k].value){
        v = classifiers[k].value;
        best = [k];
      }else if (v == classifiers[k].value){
        best.push(k);
      }
    });

    return best;
  }


  formatResult(classifiers){

    Object.keys(classifiers).forEach(k => {
      classifiers[k].value = classifiers[k].value.toFixed(2);
    });

  }


  isBest(best, name){
    return best.findIndex(v => v == name) > -1;
  }

}
