import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MaterialModule } from './app.material';
import { CommonService } from './common.service';
import { HttpClientModule } from '../../node_modules/@angular/common/http';
import { PlaceOrderComponent } from './place-order/place-order.component';
import { UpdateComponent } from './update/update.component';
import { ReactiveFormsModule, FormsModule } from '../../node_modules/@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    PlaceOrderComponent,
    UpdateComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  entryComponents:[UpdateComponent,PlaceOrderComponent],
  providers: [CommonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
