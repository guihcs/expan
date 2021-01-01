import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExperimentService {

  private experimentMap = new Map();
  private experiments$ = new BehaviorSubject(this.experimentMap);

  constructor() { }


  private readFile(file) : Promise<any>{
    return new Promise((resolve, reject) => {
      let fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result);
      };
      fr.readAsText(file);
    });
  }

  async loadExperiments(fileList){

    this.experimentMap = new Map<string, any>();

    for(let i = 0; i < fileList.length; i++){
      const r = await this.readFile(fileList[i]);
      const experiments = JSON.parse(r).experiments;

      experiments.forEach(element => {

        let datasetName = element.dataset.length > 20 ? element.dataset.substring(0, 20) : element.dataset;
        let experimentList = this.experimentMap.get(datasetName);
        if (experimentList == null) this.experimentMap.set(datasetName, [element]);
        else this.experimentMap.get(datasetName).push(element);
      });
    }

    this.experiments$.next(this.experimentMap);
  }

  getExperiments() {
    return this.experiments$;
  }

  getClassifiers(){
    let exp = this.experimentMap.entries().next().value;
    return exp ? exp[1].map(v => {
        return {classifier: v.classifier, date: v.date};
      }): null;
  }

  getClassifierExperiments(classifier){

    return Array.from(this.experimentMap.values())
      .map(ds => ds.find(e => e.classifier == classifier.classifier && e.date == classifier.date))


  }
}
