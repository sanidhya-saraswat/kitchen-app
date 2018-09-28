import { Component } from '@angular/core';
import { CommonService } from './common.service';
import { MatDialog } from '../../node_modules/@angular/material';
import { PlaceOrderComponent } from './place-order/place-order.component';
import { UpdateComponent } from './update/update.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  orders;
  constructor(private cs: CommonService,public dialog: MatDialog) { }
  ngOnInit() {
this.getOrders();
  }
  done(dish) {
    dish.createdTillNow += 1;
    this.cs.httpPut('/api/dish', dish).subscribe(data => {
      if (data.error) {
        //handle error
      }
      else {
        this.cs.openSnackBar("Created till now updated!");
      }
    })
  }
  generateReport() {
    window.open('/api/generateReport', '_blank');
  }
  placeOrder()
  {
    const dialogRef = this.dialog.open(PlaceOrderComponent, {
      width: '300px'
    });
    dialogRef.afterClosed().subscribe(result => {
   if(result!="CANCEL")
   {
this.getOrders();
   }
   
    });
  }
  setPredictedValue()
  {
    const dialogRef = this.dialog.open(UpdateComponent, {
      width: '300px'
    });
    dialogRef.afterClosed().subscribe(result => {
   if(result!="CANCEL")
   {
this.getOrders();
   }
   
    });
  }
  getOrders()
  {
    this.cs.httpGet('/api/orders').subscribe(data => {
      if (data.error) {
        //handle error
      }
      else {
        this.orders = data.response;
      }
    })
  }
}
