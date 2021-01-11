import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-database-info',
  templateUrl: './database-info.component.html',
  styleUrls: ['./database-info.component.css']
})
export class DatabaseInfoComponent implements OnInit {

  data;
  constructor() { }

  ngOnInit(): void {
  }

  setData(data){
    this.data = data;
  }

}
