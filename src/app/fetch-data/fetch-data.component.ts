import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm, NgModel} from '@angular/forms';


@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
 
  public user:User;
  public disabledForm:boolean = false;
  constructor(private http: HttpClient,  @Inject('BASE_URL') private baseUrl: string) {
   
  }

  Search(Form:NgForm)
 {
  
  console.log(Form.value);
   if(!Form.valid)
   {
     alert("Не все данные введены!");
     return;
   }
   var data = Form.value;
   if(!data.sex)
   {
     alert("Вы не указали фильтр!");
     return;
   }
   this.disabledForm = true;
  this.http.get<User>("https://localhost:44358/" + 'mutuallikes'+'?userid='+data.userId+'&sex='+data.sex).subscribe(result => {
    this.user = result;
    this.disabledForm = false;
  }, error => {
  
    this.disabledForm = false;
    alert(  "Что-то пошло не так! Произошла ошибка!");
  });
 }
}

 
interface User {
  data: string;
  firstName:string;
  lastName:string;
}
