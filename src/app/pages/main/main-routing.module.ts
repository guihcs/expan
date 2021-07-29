import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./tabs/home/home.component";
import {GenerationComponent} from "./tabs/generation/generation.component";
import {MainComponent} from "./main.component";
import {ComparatorComponent} from "./tabs/comparator/comparator.component";
import {DataPlotComponent} from "./tabs/data-plot/data-plot.component";

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
        path: 'data-plot',
        component: DataPlotComponent
      }
    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
