import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from "@angular/forms";
import {ChartModule} from 'angular2-chartjs';

import {AppComponent} from './app.component';
import {MainComponent} from './components/main/main.component';
import {CanvasComponent} from './components/canvas/canvas.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    CanvasComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    ChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
