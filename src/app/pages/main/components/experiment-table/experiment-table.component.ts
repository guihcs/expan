import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {BehaviorSubject} from "rxjs";
import {ExperimentService} from "../../../../services/experiment/experiment.service";
import {MatSort} from "@angular/material/sort";
import {MatSlider} from "@angular/material/slider";

@Component({
  selector: 'app-experiment-table',
  templateUrl: './experiment-table.component.html',
  styleUrls: ['./experiment-table.component.css']
})
export class ExperimentTableComponent implements OnInit {

  displayedColumns: string[] = ['dataset'];
  dataSource = new MatTableDataSource();
  allCl: Map<string, any>;

  @Input() experiments: BehaviorSubject<Map<string, any>>;
  @Input() metric;
  @Input() ensemble;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatSlider, {static: true}) slider: MatSlider;

  currentData;

  constructor(private experimentService: ExperimentService) { }

  ngOnInit(): void {
    this.experiments.subscribe(experiments => {
      this.loadExperiments(experiments);
    });

    this.metric.subscribe(v => {

      this.loadExperiments(this.experiments.value);
    })

    this.ensemble.subscribe(v => {
      this.loadExperiments(this.experiments.value);
    })
  }


  loadExperiments(experiments){

    let singles = this.experimentService.getSingles();
    this.allCl = new Map();
    this.allCl.set('0', {name: 'dataset'});
    this.allCl.set('' + this.ensemble.value.id, this.ensemble.value);
    singles.forEach(s => this.allCl.set('' + s.id, s));

    let data = this.experimentService
      .getExperimentResults([...this.allCl.values()], this.metric.value)

    data.forEach(v => {
      this.formatResult(v, [...this.allCl.keys()]);

    });

    this.displayedColumns = [...this.allCl.keys()];

    this.dataSource.sort = this.sort;
    this.dataSource.data = data;
    this.currentData = data;
    this.slider.min = 1;
    this.slider.max = data.length - 1;
    this.slider.value = this.slider.max;
  }

  formatResult(results, classifierNames){
    classifierNames.forEach(k => {
      if (k == '0') return;
      results[k].value = results[k].value.toFixed(2);
    });
  }


  isBest(best, name){
    if(!best) return 0;
    return best.findIndex(v => v == name) > -1;
  }

  sortEv(ev){
    console.log(ev);

  }

  sliderChange(val){
    let data = this.currentData.slice(1);
    let esID = this.ensemble.value.id;
    data.sort((a, b) => parseFloat(b[esID].value) - parseFloat(a[esID].value));
    data = data.slice(0, val);
    let clID = [this.ensemble.value.id, ...this.experimentService.getSingles().map(c => c.id)];

    let calcMean = this.experimentService.calcMean(data, clID);
    this.formatResult(calcMean, clID)

    this.dataSource.data = [calcMean, ...data];

  }

}
