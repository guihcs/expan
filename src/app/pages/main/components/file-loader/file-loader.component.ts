import {Component, OnInit} from '@angular/core';
import {ExperimentService} from "../../../../services/experiment/experiment.service";
import {Router} from "@angular/router";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-file-loader',
  templateUrl: './file-loader.component.html',
  styleUrls: ['./file-loader.component.css']
})
export class FileLoaderComponent implements OnInit {

  constructor(private experimentService: ExperimentService,
              private router: Router,
              public dialogRef: MatDialogRef<FileLoaderComponent>,
              ) {
  }

  ngOnInit(): void {
  }

  loadExperiments(eventTarget){
    this.experimentService.addExperiments(eventTarget.files).then(v => {
      this.router.navigate(['home']);
    });
  }

  getLoadedExperiments(){
    return this.experimentService.getLoadedExperimentFiles();
  }

  close(){
    this.dialogRef.close()
  }
}
