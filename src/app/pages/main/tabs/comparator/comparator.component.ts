import {Component, OnInit} from '@angular/core';
import {ExperimentService} from "../../../../services/experiment/experiment.service";
import {MatDialog} from "@angular/material/dialog";
import {ClassifierSelectorComponent} from "../../components/classifier-selector/classifier-selector.component";
import {MatTableDataSource} from "@angular/material/table";
import {OverlayService} from "../../../../services/overlay/overlay.service";
import {DatabaseInfoComponent} from "../../components/database-info/database-info.component";

@Component({
  selector: 'app-comparator',
  templateUrl: './comparator.component.html',
  styleUrls: ['./comparator.component.css']
})
export class ComparatorComponent implements OnInit {

  cls = [];
  selectedMetric = 'mcc';
  displayedColumns: any[];
  metricDiff = [];
  lineRelation = [
    {
      "name": "Germany",
      "series": [
        {
          "name": "2010",
          "value": 7300000
        },
        {
          "name": "2011",
          "value": 8940000
        }
      ]
    },

    {
      "name": "USA",
      "series": [
        {
          "name": "2010",
          "value": 7870000
        },
        {
          "name": "2011",
          "value": 8270000
        }
      ]
    }
  ];
  dataSource = new MatTableDataSource();

  constructor(
    private experimentService: ExperimentService,
    public dialog: MatDialog,
    private overlayService: OverlayService
  ) {
  }

  ngOnInit(): void {
  }

  openDialog(index): void {

    const dialogRef = this.dialog.open(ClassifierSelectorComponent, {
      data: this.experimentService.getAllClassifiers()
    });

    dialogRef.afterClosed().subscribe(result => {
      this.cls[index] = result;

      if (this.cls.filter(Boolean).length >= 2) {
        this.calcResults()
      }

    });
  }

  calcResults() {
    const clN = this.cls.map(c => [c.classifier.name, c.date].join(','));
    let experimentResults = this.experimentService.getExperimentResults(this.cls, this.selectedMetric);
    this.calcDiff(clN, experimentResults);
    this.formatData(clN, experimentResults);
    this.displayedColumns = ['dataset', ...this.cls.map(c => [c.classifier.name, c.date].join(','))];
    this.displayedColumns.push('diff');

    this.dataSource.data = experimentResults;

    this.metricDiff = this.getAllMetricDiff();
    this.lineRelation = this.getDatasetRelation(experimentResults);
  }

  calcDiff(classifiers, data) {

    data.forEach(d => {
      d.diff = (d[classifiers[0]].value - d[classifiers[1]].value) / d[classifiers[0]].value * 100;
    })
  }

  formatData(classifiers, data) {
    data.forEach(d => {
      classifiers.forEach(c => {
        d[c] = d[c].value.toFixed(2);
      })
      d.diff = d.diff.toFixed(2)
    })

  }

  getValueClass(value) {
    if (value < 0) return 'worst';
    if (value > 0) return 'best';
  }

  formatDiff(diff) {
    let d = Math.abs(parseFloat(diff));
    return d + '%';
  }

  setSelectedMetric(metric) {
    this.selectedMetric = metric;
    this.calcResults()
  }


  openDatabaseInfo(ref, el, col) {
    let info = this.experimentService.getDatasetInfo(el['dataset']);
    if (col != 'dataset' || info == null) return;

    this.overlayService.open(ref, DatabaseInfoComponent, info);
  }

  closeInfo() {
    this.overlayService.close();
  }

  getAllMetricDiff(){
    const clN = this.cls.map(c => [c.classifier.name, c.date].join(','));
    let d = [];
    this.experimentService.getAllMetrics().forEach(m => {
      let experimentResults = this.experimentService.getExperimentResults(this.cls, m);
      let mexp = [experimentResults[0]];
      this.calcDiff(clN, mexp);
      d.push({name: m, value: mexp[0].diff})

    })


    return d;
  }

  getDatasetRelation(res: any[]){
    let data = [];
    ['dataSize', 'features', 'targetCount', 'outlierCount'].forEach(n => {

      let min = Math.log(this.getMin(n, res.slice(1)));
      let max = Math.log(this.getMax(n, res.slice(1)));

      let r = res.slice(1).map(r => {
        return {name:  (Math.log(r.dataset[n]) - min) / (max - min), value: r.diff}
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
}
