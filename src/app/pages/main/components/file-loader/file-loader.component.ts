import {Component, OnInit} from '@angular/core';
import {ExperimentService} from "../../../../services/experiment/experiment.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-file-loader',
  templateUrl: './file-loader.component.html',
  styleUrls: ['./file-loader.component.css']
})
export class FileLoaderComponent implements OnInit {

  constructor(private experimentService: ExperimentService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  loadExperiments(eventTarget){
    this.experimentService.loadExperiments(eventTarget.files).then(v => {
      this.router.navigate(['home']);
    });
  }

}
