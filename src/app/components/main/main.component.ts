import {Component, OnDestroy, OnInit} from '@angular/core';
import {GetService} from "../../services/get.service";

import {webSocket} from "rxjs/webSocket";
import {CurrencyModel} from "../../models/currency.model";
import {FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {environment} from "../../../environments/environment";
import {ListModel} from "../../models/list.modal";

const subject = webSocket(environment.wsUrl);


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
  coinSub$!: Subscription
  form!: FormGroup
  msg!: CurrencyModel
  canvasData!: string
  crypto!: ListModel[]
  fiat!: ListModel[]

  constructor(private getService: GetService) {
  }


  ngOnInit(): void {
    this.form = new FormGroup({
      first: new FormControl(0),
      second: new FormControl(0)
    });

    this.coinSub$ = this.getService.get('https://rest.coinapi.io/v1/assets?filter_asset_id=ltc;btc;eth;usd;eur')
      .subscribe((x: ListModel[]) => {
        this.crypto = x.filter((el: any) => {
          return el.type_is_crypto == 1
        })

        this.fiat = x.filter((el: any) => {
          return el.type_is_crypto == 0
        })

        this.submit()

      }, error => {
        console.log(error.error.error)
      })
  }

  stopSocket() {
    subject.complete(); // Closes the connection.
    subject.error({code: 4000, reason: 'I think our app just broke!'});
  }

  filterMSG(el: any) {
    if (el.asset_id_base == this.crypto[this.form?.value.first].asset_id
      && el.asset_id_quote == this.fiat[this.form?.value.second].asset_id) {
      return el
    } else {
      this.canvasData = this.crypto[this.form?.value.first].asset_id + '_' + this.fiat[this.form?.value.second].asset_id
      return this.msg
    }
  }

  submit() {
    let current = this.crypto && this.fiat
      && this.crypto[this.form?.value.first].asset_id + '_' + this.fiat[this.form?.value.second].asset_id
    if (this.canvasData == current) {
      return
    } else {
      subject.next(
        {
          "type": "hello",
          "apikey": environment.apiKey,
          "heartbeat": false,
          "subscribe_data_type": ["exrate"],
          "subscribe_filter_asset_id": ["BTC", "ETH", "DOGE", "USD"]
        })

      subject.subscribe(
        msg => {
          this.msg = this.filterMSG(msg)
        },
        err => console.log(err),
        () => console.log('complete')
      );
    }

  }

  ngOnDestroy() {
    if (this.coinSub$) {
      this.coinSub$.unsubscribe()
    }
  }
}
