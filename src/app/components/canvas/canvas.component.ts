import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {GetService} from "../../services/get.service";
import {Subscription} from "rxjs";
import {CanvasModel} from "../../models/canvas.model";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy, OnChanges {
  @Input() param!: string
  historicalSub$!: Subscription;
  canvas!: CanvasModel[];
  type = 'line';
  data!: {
    labels: Array<any>,
    datasets: Array<any>
  };

  options = {
    // responsive: true,
    // maintainAspectRatio: false,
  };

  constructor(private getService: GetService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.param.currentValue != changes.param.previousValue) {
      this.param = changes.param.currentValue
      this.getData()
    }
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.historicalSub$ = this.getService.get(`https://rest.coinapi.io/v1/orderbooks/BITSTAMP_SPOT_${this.param}/latest?limit=1`)
      .subscribe((x: any) => {
        this.canvas = x[0].asks

        this.data = {
          labels: this.canvas.map((el: any, index: number) => {
            return index
          }),
          datasets: [
            {
              label: `Latest market data ${this.param && this.param.replace('_', '/')}`,
              data: this.canvas.map((el: any) => {
                return el.price
              })
            }
          ],
        };
      })
  }

  ngOnDestroy() {
    if (this.historicalSub$) {
      this.historicalSub$.unsubscribe()
    }
  }

}
