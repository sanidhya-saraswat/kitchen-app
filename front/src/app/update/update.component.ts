import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '../../../node_modules/@angular/material';
import { FormGroup, FormControl, Validators } from '../../../node_modules/@angular/forms';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  updateForm:FormGroup;
  constructor(public dialogRef: MatDialogRef<UpdateComponent>,private cs:CommonService) { }

  ngOnInit() {
    this.updateForm = new FormGroup({
      dishId: new FormControl('',Validators.required),
      name: new FormControl('',Validators.required),
      predicted: new FormControl(0, [Validators.required,Validators.pattern('^[0-9][0-9]*$')])
     }); 
  }
  onFormSubmit()
  {
    this.updateForm.value.createdTillNow=0;
this.cs.httpPut('/api/dish',this.updateForm.value).subscribe(data=>{
  if(data.error)
  {
    //handle error
  }
  else
  {
  this.cs.openSnackBar("Updated! Press the 'generate report' button to see the updated report.");
  this.dialogRef.close("NORMAL");
  }
})
  }
getDishInfo()
{
if(this.updateForm.value.dishId)
{
  this.cs.httpGet('/api/dish/'+this.updateForm.value.dishId).subscribe(data=>{
    if(data.error)
    {
      //handle err
      this.cs.openSnackBar("Invalid Dish id")
      this.updateForm.controls['name'].setValue('');
      this.updateForm.controls['predicted'].setValue('');
    }
    else
    {
    this.updateForm.controls['name'].setValue(data.response["name"]);
    this.updateForm.controls['predicted'].setValue(data.response["predicted"]);
    }
  })
}
}
closeDialog()
{
  this.dialogRef.close("CANCEL")
}
}
