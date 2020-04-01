import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-check-data",
  templateUrl: "./check-data.component.html",
  styleUrls: ["./check-data.component.css"]
})
export class CheckDataComponent implements OnInit {
  public disabledForm: boolean;
  public user: UserData;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  Search(Form: NgForm) {

    if (!Form.valid) {
      alert("Не все данные введены!");
      return;
    }
     
    var data = Form.value;

    if(data.userId < 1)
    {
     alert("Неверный ID");
     return;
    }

    this.disabledForm = true;
    this.user = null;
    this.http
      .get<UserData>(
        "https://mutual-like-server.herokuapp.com/mutuallikes/" +
          "check" +
          "?userid=" +
          data.userId
      )
      .subscribe(
        result => {
          this.user = result;
          this.disabledForm = false;
        },
        error => {
          this.disabledForm = false;
          alert("Что-то пошло не так! Произошла ошибка!");
        }
      );
  }
}

interface UserData {
  id: number;
  userId: number;
  userChecked: boolean;
  dataLastChecked: string;
  fullUserName: string;
}
