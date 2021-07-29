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
  lineRelation = [];
  dataSource = new MatTableDataSource();
  allCl: Map<string, any>;

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
    this.allCl = new Map();
    this.allCl.set('0', {name: 'dataset'});
    this.allCl.set('3', {name: 'diff'});
    this.cls.forEach(c => this.allCl.set('' + c.id, c))

    let experimentResults = this.experimentService.getExperimentResults(this.cls, this.selectedMetric);

    this.calcDiff(this.cls, experimentResults);
    this.formatData(this.cls, experimentResults);
    this.displayedColumns = ['0', ...this.cls.map(c => '' + c.id), '3'];


    this.dataSource.data = experimentResults;

    this.metricDiff = this.getAllMetricDiff();
    this.lineRelation = this.getDatasetRelation(experimentResults);
  }

  calcDiff(classifiers, data) {

    data.forEach(d => {

      d['3'] = (d[this.cls[0].id].value - d[this.cls[1].id].value) / d[this.cls[0].id].value * 100;
    })
  }

  formatData(classifiers, data) {
    data.forEach(d => {
      classifiers.forEach(c => {
        d[c.id] = d[c.id].value.toFixed(2);
      })
      d['3'] = d['3'].toFixed(2)
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
    let info = el['0'];

    if (col != '0' || info.dataSize == null) return;

    this.overlayService.open(ref, DatabaseInfoComponent, info);
  }

  closeInfo() {
    this.overlayService.close();
  }

  getAllMetricDiff() {

    let d = [];
    this.experimentService.getAllMetrics().forEach(m => {
      let experimentResults = this.experimentService.getExperimentResults(this.cls, m);
      let mexp = [experimentResults[0]];
      this.calcDiff(this.allCl, mexp);
      d.push({name: m, value: mexp[0]['3']})

    })


    return d;
  }

  getDatasetRelation(res: any[]) {
    res = res.slice(1);
    let data = [];

    ['dataSize', 'features', 'targetCount', 'outlierCount'].forEach(n => {

      let min = Math.log(this.getMin(n, res));
      let max = Math.log(this.getMax(n, res));

      let r = res.map(r => {
        return {name: (Math.log(r['0'][n]) - min) / (max - min), value: r['3']}
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
        return {name: (Math.log(mean) - min) / (max - min), value: r['3']};
      })

      data.push({
        name: n,
        series: r
      })

    })


    return data;
  }

  getArrMean(data) {
    let reduce = data.reduce((previousValue, currentValue) => previousValue + currentValue);
    return reduce / data.length;
  }

  getArrMin(f, d) {
    let max = +Infinity;

    d.forEach(v => {
      let dataset = v['0'];
      let mean = this.getArrMean(dataset[f]);
      if (mean < max) max = mean;
    })

    return max;
  }

  getArrMax(f, d) {
    let max = -Infinity;

    d.forEach(v => {
      let dataset = v['0'];
      let mean = this.getArrMean(dataset[f]);
      if (mean > max) max = mean;
    })

    return max;
  }

  getMin(f, d: any[]) {

    let max = +Infinity;

    d.forEach(v => {
      let dataset = v['0'];

      if (dataset[f] < max) max = dataset[f];
    })

    return max;
  }

  getMax(f, d: any[]) {

    let max = -Infinity;

    d.forEach(v => {
      let dataset = v['0'];
      if (dataset[f] > max) max = dataset[f];
    })

    return max;
  }

  sortVal(ev) {
    let data = this.dataSource.data.slice(1);
    let esID = '' + ev.active;

    data.sort((a, b) => {
        if (ev.direction == 'asc') return parseFloat(a[esID]) - parseFloat(b[esID]);
        return parseFloat(b[esID]) - parseFloat(a[esID]);
      }
    );

    this.dataSource.data = [this.dataSource.data[0], ...data];

  }

}
