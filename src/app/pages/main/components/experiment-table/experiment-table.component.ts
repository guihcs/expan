import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {BehaviorSubject} from "rxjs";
import {ExperimentService} from "../../../../services/experiment/experiment.service";

@Component({
  selector: 'app-experiment-table',
  templateUrl: './experiment-table.component.html',
  styleUrls: ['./experiment-table.component.css']
})
export class ExperimentTableComponent implements OnInit {

  displayedColumns: string[] = ['dataset'];
  dataSource = new MatTableDataSource();

  @Input() experiments: BehaviorSubject<Map<string, any>>;
  @Input() metric;

  constructor(private experimentService: ExperimentService) { }

  ngOnInit(): void {
    this.experiments.subscribe(experiments => {

      this.loadExperiments(experiments);
    });

    this.metric.subscribe(v => {
      this.loadExperiments(this.experiments.value);
    })
  }

  loadExperiments(experiments){

    let newestClassifiers = this.experimentService.getNewestClassifiers();

    let data = this.experimentService.getExperimentResults(newestClassifiers, this.metric.value)

    data.forEach(v => {
      this.formatResult(v, newestClassifiers.map(v => v.classifier.name + ',' + v.date));

    });

    this.displayedColumns = ['dataset', ...(newestClassifiers.map(v => v.classifier.name + ',' + v.date))];

    this.dataSource.data = data;
  }

  formatResult(classifiers, n){

    n.forEach(k => {
      classifiers[k].value = classifiers[k].value.toFixed(2);
    });

  }


  isBest(best, name){
    if(!best) return 0;
    return best.findIndex(v => v == name) > -1;
  }

}
