import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./tabs/home/home.component";
import {GenerationComponent} from "./tabs/generation/generation.component";
import {MainComponent} from "./main.component";
import {ComparatorComponent} from "./tabs/comparator/comparator.component";
import {DatePlotComponent} from "./tabs/date-plot/date-plot.component";

const routes: Routes = [

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'generation',
        component: GenerationComponent
      },
      {
        path: 'comparator',
        component: ComparatorComponent
      },
      {
        path: 'date-plot',
        component: DatePlotComponent
      }
    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
