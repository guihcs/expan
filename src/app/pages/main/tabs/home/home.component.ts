import {Component, OnInit} from '@angular/core';
import {CALC_FUNCTIONS, mcc} from "../../../../metrics/metrics";
import {ExperimentService} from "../../../../services/experiment/experiment.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  calcFunction = new BehaviorSubject('mcc');
  ensemble;

  constructor(private experimentService: ExperimentService) {}

  ngOnInit(): void {
  }

  getExperiments() {
    return this.experimentService.getExperiments();
  }

  setCalcFunction(name) {
    this.calcFunction.next(name);
  }

  setSelectedValue(v){
    if (!this.ensemble) this.ensemble = new BehaviorSubject(v)
    else this.ensemble.next(v);
  }

  getEnsembles(){
    return this.experimentService.getEnsembles();
  }

}
