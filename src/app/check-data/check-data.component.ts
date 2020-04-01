import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-check-data',
  templateUrl: './check-data.component.html',
  styleUrls: ['./check-data.component.css']
})
export class CheckDataComponent implements OnInit {

  public disabledForm:boolean;
  public user:UserData;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  Search(myform:NgForm)
  {

    var data = myform.value;
    this.disabledForm = true;
    this.user = null;
    this.http.get<UserData>("https://mutual-like-server.herokuapp.com/mutuallikes/" + 'check'+'?userid='+data.userId).subscribe(result => {
    console.log(result); 
    this.user = result;
      this.disabledForm = false;
    }, error => {
      this.disabledForm = false;
      alert(  "Что-то пошло не так! Произошла ошибка!");
    });
  }
}

interface UserData
{
  id:number;
  userId:number;
  userChecked:boolean;
  dataLastChecked:string;
}
