import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileLoaderComponent } from './pages/main/components/file-loader/file-loader.component';
import {MainRoutingModule} from "./pages/main/main-routing.module";
import {MainModule} from "./pages/main/main.module";


@NgModule({
  declarations: [
    AppComponent,
    FileLoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MainRoutingModule,
    BrowserAnimationsModule,
    MainModule
  ],
  providers: [],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
