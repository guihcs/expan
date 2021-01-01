import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {getTableUnknownDataSourceError} from "@angular/cdk/table/table-errors";
import {MatRadioGroup} from "@angular/material/radio";

@Component({
  selector: 'app-classifier-selector',
  templateUrl: './classifier-selector.component.html',
  styleUrls: ['./classifier-selector.component.css']
})
export class ClassifierSelectorComponent implements OnInit {

  @ViewChild('radioGroup', {read: MatRadioGroup}) radioGroup: MatRadioGroup;

  constructor(
    public dialogRef: MatDialogRef<ClassifierSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

  }

  cancel(){
    this.dialogRef.close();
  }


  ok(){
    this.dialogRef.close(this.radioGroup.value);
  }

}
