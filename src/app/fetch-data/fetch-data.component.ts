import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm, NgModel} from '@angular/forms';
import { HubConnection, HubConnectionBuilder,HubConnectionState,LogLevel} from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent implements OnInit {
 
  public _hubConnection: HubConnection;
  public user:User;
  public disabledForm:boolean = false;
  constructor(private http: HttpClient,  @Inject('BASE_URL') private baseUrl: string) {
   
  }

  ngOnInit()
  {
    this.createConnection();
    this.registerOnServerEvents();
    this.startConnection();
  }

  private createConnection() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl( 'https://localhost:44358/server', {
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
        console.log('Hub connection started!');
      },
      error => console.error(error)
    );
  }

  private registerOnServerEvents(): void {
   
    this._hubConnection.on('sendToAll', (data: User) => {
    
     this.user = data;
     this.disabledForm = false;
    });

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
  
   console.log(data.userId);
   if(!data.sex)
   {
     alert("Вы не указали фильтр!");
     return;
   }

   this._hubConnection
   .invoke('SendToCaller', data.userId,data.sex)
   .catch(err => console.error(err));

   this.disabledForm = true;
 
 }
}

 
interface User {
  data: string;
  firstName:string;
  lastName:string;
}
