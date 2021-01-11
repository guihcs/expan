import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {acc, bac, CALC_FUNCTIONS, mcc, precision, recall} from "../../metrics/metrics";

@Injectable({
  providedIn: 'root'
})
export class ExperimentService {

  private experimentMap = new Map();
  private experiments$ = new BehaviorSubject(this.experimentMap);
  private experimentFileSet = {};

  constructor() {
  }


  private readFile(file): Promise<any> {
    return new Promise((resolve) => {
      let fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result);
      };
      fr.readAsText(file);
    });
  }

  async addExperiments(fileList) {

    let diff = [...fileList].filter(v => !this.experimentFileSet.hasOwnProperty(v.name));

    let experiments = [];

    for (let f of diff) {
      let data = await this.readExperimentsFromFile(f);
      this.experimentFileSet[f.name] = data;
      experiments.push(data);
      this.processExperiments(data);
    }

    this.saveFileList();

    this.experiments$.next(this.experimentMap);
  }

  private async readExperimentsFromFile(file) {
    const r = await this.readFile(file);
    return JSON.parse(r).experiments;
  }

  private saveFileList() {
    localStorage.setItem('experiments', JSON.stringify(this.experimentFileSet));
  }

  private loadFileList() {
    const data = localStorage.getItem('experiments');
    if (!data) return;
    this.experimentFileSet = JSON.parse(data);

    for (let k of Object.keys(this.experimentFileSet)) {
      this.processExperiments(this.experimentFileSet[k]);
    }

  }

  private processExperiments(experiments) {
    experiments.forEach(element => {
      let datasetName = element.dataset.name.length > 20 ? element.dataset.name.substring(0, 20) : element.dataset.name;
      let experimentList = this.experimentMap.get(datasetName);
      if (experimentList == null) this.experimentMap.set(datasetName, [element]);
      else this.experimentMap.get(datasetName).push(element);
    });
  }

  getExperiments() {
    if (Object.keys(this.experimentFileSet).length <= 0) {
      this.loadFileList();
    }
    return this.experiments$;
  }

  getAllClassifiers() {
    this.getExperiments();

    let exp = this.experimentMap.entries().next().value;
    return exp ? exp[1].map(v => {
      return {classifier: v.classifier, date: v.date};
    }) : [];
  }

  getNewestClassifiers() {
    let clMap = new Map();
    let allCL: any[] = this.getAllClassifiers();

    allCL.forEach(c => {
      if (clMap.has(c.classifier.name) && new Date(clMap.get(c.classifier.name).date) > new Date(c.date)) return;
      clMap.set(c.classifier.name, c);
    });

    return [...clMap.values()];
  }

  getClassifierExperiments(classifier) {
    this.getExperiments();

    return Array.from(this.experimentMap.values())
      .map(ds => ds.find(e => e.classifier.name == classifier.classifier.name && e.date == classifier.date
      ))

  }

  getLoadedExperimentFiles() {
    return Object.keys(this.experimentFileSet);
  }

  removeExperimentFile(fileName) {

  }

  getExperimentResults(classifiers: any[], metric) {
    let data = [];
    let mean = {};

    this.experimentMap.forEach((value, key) => {
      let line = {};
      value.forEach(e => {
        let cl = {classifier: e.classifier.name, date: e.date};
        if (classifiers.findIndex(c => c.classifier.name == cl.classifier && c.date == cl.date) < 0) return;
        let clN = [e.classifier.name, e.date].join(',');
        let res = CALC_FUNCTIONS[metric](e.result[1][1], e.result[0][0], e.result[0][1], e.result[1][0]);
        line[clN] = {
          value: res,
          date: new Date(e.date)
        };
        line['dataset'] = e.dataset;
        line['best'] = this.getBestClassifiers(line);
        if (!mean[clN]) mean[clN] = {value: 0};
        mean[clN].value += res;
      });
      data.push(line);
    });

    Object.keys(mean).forEach(k => {
      mean[k].value /= data.length;
    });

    mean['best'] = this.getBestClassifiers(mean);
    mean['dataset'] = 'Mean';

    return [mean, ...data];
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

  getSingleBests(metric){
    let resultMap = new Map();

    this.experimentMap.forEach((value, key) => {
      let res = value.filter(v => v.classifier.type == 'single').sort((c1, c2) => {
        let vc1 = CALC_FUNCTIONS[metric](c1.result[1][1], c1.result[0][0], c1.result[0][1], c1.result[1][0])
        let vc2 = CALC_FUNCTIONS[metric](c2.result[1][1], c2.result[0][0], c2.result[0][1], c2.result[1][0])
        return vc1 - vc2
      }).map(v => v.classifier.name);
      resultMap.set(key, res);
    });

    return resultMap;
  }

  getDatasetInfo(name){
    let data = this.experimentMap.get(name);
    if(data == null) return;
    return data[0]?.dataset;
  }

  getAllMetrics(){
    return ['mcc', 'precision', 'recall', 'bac', 'acc'];
  }

  getClassifierIndexName(cl){
    return cl.classifier.name + ',' + cl.date;
  }
}
