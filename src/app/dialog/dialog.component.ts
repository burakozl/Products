import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  freshnessList = ["Brand New","Second Hand","Refurbished"];
  productForm !: FormGroup;
  actionBtn:string = 'Save';

  constructor(private formBuilder:FormBuilder, private api : ApiService,private dialogRef:MatDialogRef<DialogComponent>,private _snackBar: MatSnackBar,@Inject(MAT_DIALOG_DATA) public editData: any) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['',Validators.required],
      category: ['',Validators.required],
      freshness: ['',Validators.required],
      price: ['',Validators.required],
      comment: ['',Validators.required],
      date : ['',Validators.required]
    });
    //console.log(this.editData);
    if(this.editData){
      this.actionBtn = 'Update';
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }

  }
  addProduct(){
    if(!this.editData){
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value).subscribe({
          next:(res) => {
            this._snackBar.open("Product added successfully","Ok");
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error: () => {
            this._snackBar.open("Error while adding the product","Ok");
          }
        })
      }
    }
    else{
      this.updateProduct();
    }
  }
  updateProduct(){
    this.api.putProduct(this.productForm.value,this.editData.id).subscribe({
      next: (res) => {
        this._snackBar.open("Product updated succesfully","Ok");
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        this._snackBar.open("Error while updating the record","Ok");
      }
    })
  }

}
