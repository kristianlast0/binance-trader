import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { Router } from '@angular/router';
import * as lchart from 'lightweight-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, OnDestroy {

  @ViewChild('chart', { static: true }) chart: any;
  @ViewChild('trades', { static: true }) trades: any;

  public websocket: any;
  public lightchart: any;
  public candleSeries: any;
  public account: any;
  public tickers: any;
  public history: any;
  public ticker: string = 'btcusdt';

  constructor(
    private router: Router,
    private api: ApiService) {}

  ngOnInit() {
    this.initChart();
    this.getTickers();
    this.getAccountData();
  }

  getData() {
    this.api.get('/history').subscribe((data: any) => {
      console.log(data);
      this.history = data;
    });
  }

  getAccountData() {
    this.api.get('/account').subscribe((data: any) => {
      console.log(data);
      this.account = data;
      this.account.balances = this.account.balances.filter((balance: any) => parseFloat(balance.free) > 0 || parseFloat(balance.locked) > 0);
      this.account.balances.sort((a: any, b: any) => {
        if (parseFloat(a.free) > parseFloat(b.free)) return -1;
        if (parseFloat(a.free) < parseFloat(b.free)) return 1;
        return 0;
      });
      this.account.balances.forEach((balance: any) => {
        const ticker = this.tickers.find((ticker: any) => ticker.symbol == balance.asset+'USDT');
        if (ticker) {
          balance.price = ticker.price;
          balance.value = parseFloat(balance.free) * parseFloat(ticker.price);
        }
      });
    });
  }

  initChart() {
    this.api.get('/history').subscribe((data: any) => {

      console.log(data);
      this.lightchart = lchart.createChart(this.chart.nativeElement, {
        width: 1188,
        height: 500,
        layout: {
          background: {
            color: 'rgba(34, 46, 60, 1)',
          },
          textColor: 'rgba(255, 255, 255, 0.9)',
        },
        grid: {
          vertLines: {
            color: 'rgba(197, 203, 206, 0.2)',
          },
          horzLines: {
            color: 'rgba(197, 203, 206, 0.2)',
          },
        },
        crosshair: {
          mode: lchart.CrosshairMode.Normal,
        },
        rightPriceScale: {
          borderColor: 'rgba(197, 203, 206, 0.8)',
        },
        timeScale: {
          borderColor: 'rgba(197, 203, 206, 0.8)',
        },
      });
  
      this.candleSeries = this.lightchart.addCandlestickSeries({
        upColor: 'rgba(0, 123, 255, 1)',         // Blue for up candles
        downColor: 'rgba(255, 140, 0, 1)',       // Orange for down candles
        borderDownColor: 'rgba(255, 99, 71, 1)', // Darker orange for border color of down candles
        borderUpColor: 'rgba(30, 144, 255, 1)',  // Darker blue for border color of up candles
        wickDownColor: 'rgba(255, 99, 71, 1)',   // Darker orange for wick color of down candles
        wickUpColor: 'rgba(30, 144, 255, 1)',    // Darker blue for wick color of up candles
      });

      this.candleSeries.setData(data);

      this.websocket = new WebSocket("wss://stream.binance.com:9443/ws/"+this.ticker+"@kline_1m");
      this.websocket.onmessage = (event: any) => {
        var message = JSON.parse(event.data);
        console.log(message);
        var candle = message.k;
        this.candleSeries.update({
          time: candle.t / 1000,
          open: parseFloat(candle.o),
          high: parseFloat(candle.h),
          low: parseFloat(candle.l),
          close: parseFloat(candle.c),
        });
      };

    });
  }

  getTickers() {
    this.api.get('/prices').subscribe((data: any) => {
      console.log(data);
      this.tickers = data;
    });
  }

  ngOnDestroy(): void {}

}
