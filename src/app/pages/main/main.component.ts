import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FileLoaderComponent} from "./components/file-loader/file-loader.component";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FileLoaderComponent, {
      data: {name: 'a'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);

    });
  }

}
