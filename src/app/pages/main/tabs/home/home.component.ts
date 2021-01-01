import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {CALC_FUNCTIONS, mcc} from "../../../../metrics/metrics";
import {ExperimentService} from "../../../../services/experiment/experiment.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  calcFunction = new BehaviorSubject(mcc);

  constructor(private experimentService: ExperimentService) {
  }

  ngOnInit(): void {
  }

  getExperiments() {
    return this.experimentService.getExperiments();
  }

  setCalcFunction(name) {
    this.calcFunction.next(CALC_FUNCTIONS[name]);
  }


}
