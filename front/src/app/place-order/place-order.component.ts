import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '../../../node_modules/@angular/material';
import { FormGroup, FormControl, Validators } from '../../../node_modules/@angular/forms';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {
  placeOrderForm:FormGroup;
  constructor(public dialogRef: MatDialogRef<PlaceOrderComponent>,private cs:CommonService) { }

  ngOnInit() {
    this.placeOrderForm = new FormGroup({
      dishId: new FormControl('',Validators.required),
      name: new FormControl('',Validators.required),
      quantity: new FormControl(0, [Validators.required,Validators.pattern('^[1-9][0-9]*$')])
     }); 
  }
  onFormSubmit()
  {
this.cs.httpPost('/api/order',this.placeOrderForm.value).subscribe(data=>{
  if(data.error)
  {
    //handle error
  }
  else
  {
  this.cs.openSnackBar(data.response+"");
  this.dialogRef.close("NORMAL");
  }
})
  }
getDishName()
{
if(this.placeOrderForm.value.dishId)
{
  this.cs.httpGet('/api/dish/'+this.placeOrderForm.value.dishId).subscribe(data=>{
    if(data.error)
    {
      //handle err
      this.cs.openSnackBar("Invalid Dish id")
      this.placeOrderForm.controls['name'].setValue('');
    }
    else
    {
    this.placeOrderForm.controls['name'].setValue(data.response["name"]);
    }
  })
}
}
closeDialog()
{
  this.dialogRef.close("CANCEL")
}
}
