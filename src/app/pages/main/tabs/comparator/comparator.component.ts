import { Component, OnInit } from '@angular/core';
import {ExperimentService} from "../../../../services/experiment/experiment.service";
import {MatDialog} from "@angular/material/dialog";
import {ClassifierSelectorComponent} from "../../components/classifier-selector/classifier-selector.component";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-comparator',
  templateUrl: './comparator.component.html',
  styleUrls: ['./comparator.component.css']
})
export class ComparatorComponent implements OnInit {

  c1;
  c2;

  displayedColumns: string[];
  dataSource = new MatTableDataSource();

  constructor(
    private experimentService: ExperimentService,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
  }

  openDialog(index): void {

    const dialogRef = this.dialog.open(ClassifierSelectorComponent, {
      data: this.experimentService.getClassifiers()
    });

    dialogRef.afterClosed().subscribe(result => {

      if (index == 0){
        this.c1 = this.experimentService.getClassifierExperiments(result);
      }else {
        this.c2 = this.experimentService.getClassifierExperiments(result);
      }


    });
  }

}
