import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { HomeComponent } from './tabs/home/home.component';
import { GenerationComponent } from './tabs/generation/generation.component';
import { MainComponent } from './main.component';
import {ExperimentTableComponent} from "./components/experiment-table/experiment-table.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatDialogModule} from "@angular/material/dialog";
import { ComparatorComponent } from './tabs/comparator/comparator.component';
import { DatePlotComponent } from './tabs/date-plot/date-plot.component';
import { ClassifierSelectorComponent } from './components/classifier-selector/classifier-selector.component';
import {MatRadioModule} from "@angular/material/radio";
import { DatabaseInfoComponent } from './components/database-info/database-info.component';
import {OverlayModule} from "@angular/cdk/overlay";
import {NumberArrPipe} from "../../pipes/number-arr/number-arr.pipe";
import {BarChartModule, LineChartModule} from "@swimlane/ngx-charts";
import {MeanPipe} from "../../pipes/mean/mean.pipe";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";


@NgModule({
  declarations: [HomeComponent, GenerationComponent, MainComponent, ExperimentTableComponent, ComparatorComponent, DatePlotComponent, ClassifierSelectorComponent, DatabaseInfoComponent, NumberArrPipe, MeanPipe],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSidenavModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    MatRadioModule,
    OverlayModule,
    BarChartModule,
    MatFormFieldModule,
    MatSelectModule,
    LineChartModule
  ]
})
export class MainModule { }
