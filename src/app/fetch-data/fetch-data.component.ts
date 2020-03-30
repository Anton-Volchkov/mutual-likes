import { Component, Inject, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NgForm, NgModel } from "@angular/forms";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel
} from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr";

@Component({
  selector: "app-fetch-data",
  templateUrl: "./fetch-data.component.html"
})
export class FetchDataComponent implements OnInit {
  public _hubConnection: HubConnection;
  public users: User[];
  public disabledForm: boolean = false;
  constructor(private http: HttpClient, @Inject("BASE_URL") private baseUrl: string) {

    //Нужно чтобы будить сервер
    fetch("https://mutual-like-server.herokuapp.com/")
    .then(response => {
      console.log("Send Request on server");
    })
    .catch(data => {
      console.log("Error request on server");
    });


  }

  ngOnInit() {

  

    this.createConnection();
    this.registerOnServerEvents();
    this.startConnection();
  }

  private createConnection() {
    // https://localhost:44358/server
    this._hubConnection = new HubConnectionBuilder()
      .withUrl("https://mutual-like-server.herokuapp.com/server", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
  }

  private startConnection() {
    if (this._hubConnection.state === HubConnectionState.Connected) {
      return;
    }

    this._hubConnection.start().then(
      () => {
        console.log("Hub connection started!");
      },
      error => console.error(error)
    );
  }

  private registerOnServerEvents(): void {
    this._hubConnection.on("SendToCaller", (data: User[]) => {
      console.log(data);
      this.users = data;
      this.disabledForm = false;
    });
  }

  Search(Form: NgForm) {
    if (!Form.valid) {
      alert("Не все данные введены!");
      return;
    }

    this.users = null;
    var data = Form.value;

    if (!data.sex) {
      alert("Вы не указали фильтр!");
      return;
    }

    this._hubConnection
      .invoke("GetMutualLikes", data.userId.toString(), data.sex)
      .catch(err => {
        this.disabledForm = false;
        console.error(err);
      });

    this.disabledForm = true;
  }
}

interface User {
  userName: string;
  userId: number;
  additionalData: string;
}
