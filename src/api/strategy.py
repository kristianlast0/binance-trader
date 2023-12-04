import backtrader as bt
from trade import Trade
import dotenv
import os
import pandas as pd
import numpy as np
from analysis.macd import MACD
from analysis.rsi import RSI
from analysis.sma import SMA
from analysis.bollinger import BollingerBands
from analysis.gaussian import Gaussian

dotenv.load_dotenv()

class MACDRSIStrategy(bt.Strategy):

    def __init__(self):
        self.trade = Trade(os.getenv('TICKER_SYMBOL'))
        self.macd = MACD()
        self.rsi = RSI()
        self.sma = SMA(period_short=20, period_long=50)
        self.bb = BollingerBands()
        self.gaussian = Gaussian()

    def notify_order(self, order):
        if order.status in [order.Completed, order.Canceled, order.Margin]:
            if order.isbuy(): self.buy_price = order.executed.price
            elif order.issell(): self.sell_price = order.executed.price

    def notify_trade(self, trade):
        if trade.isclosed:
            profit = trade.pnlcomm
            print(f"Trade Closed - Profit: {profit:.2f}")
            print("===================================")

    def next(self):

        df = pd.DataFrame({
            'timestamp': self.data.get(size=len(self.data.datetime)),
            'open': self.data.open.get(size=len(self.data.open)),
            'high': self.data.high.get(size=len(self.data.high)),
            'low': self.data.low.get(size=len(self.data.low)),
            'close': self.data.close.get(size=len(self.data.close)),
            'volume': self.data.volume.get(size=len(self.data.volume))
        })

        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='s')

        # Gaussian
        self.gaussian.get_gaussian(df, sigma=12)
        self.gaussian.check_signals()
        
        # MACD
        self.macd.get_macd(df)
        self.macd.check_signals()

        # RSI
        self.rsi.get_rsi(df)
        self.rsi.check_signals()

        # Update the signals for each indicator
        buy_signals = [*self.rsi.buy_signals, *self.macd.buy_signals, *self.gaussian.buy_signals] # combine all buy signals
        sell_signals = [*self.rsi.sell_signals, *self.macd.sell_signals, *self.gaussian.sell_signals] # combine all sell signals

        # 1 - MACD + RSI + SMA
        # This combination uses one leading (RSI) and two lagging (MACD and SMA) indicators.
        # The RSI shows the potential future price changes. The SMA is a trend-following indicator that lags.
        # While the RSI shows potential reversal points, the SMA helps in confirming these signals.
        # The MACD, meanwhile, helps reveal the trend's strength and direction.
        # Traders use the MACD, in this case, to confirm the first two signals of the RSI and SMA.
        # So, how can we read each signal and use these indicators together? Let’s look at an example:
        # The baseline of the RSI could be above 50 and continuing upwards, while the candle chart is crossing over the SMA line from underneath and moving above it.
        # Meanwhile, the MACD is also showing a BUYsignal: this, general, would be a buy signal. 

        # Check for buy signals
        if self.position.size == 0 and self.rsi.oversold() and self.macd.crossover():
            price = self.trade.get_price()
            balance = self.broker.getvalue()
            quantity = (balance / 2) / price
            self.buy(size=quantity)
            print(f'BUY: {buy_signals}')
            print("[+] Bought: Qty: %.2f @£%.2f" % (quantity, price))
            print("===================================")

        # Check for sell signals
        if self.position.size > 0 and self.rsi.crossover() and self.macd.crossunder():
            self.close()
            print(f'SELL: {sell_signals}')
            print("[-] Sold")

    # at end
    def stop(self):
        print("===================================")
        print("===================================")
        print(f"Starting Portfolio Value: {self.broker.startingcash}")
        print(f"Ending Portfolio Value: {self.broker.getvalue()}")
        print(f"Profit: {self.broker.getvalue() - self.broker.startingcash}")
        print(f"Profit Percentage: {((self.broker.getvalue() - self.broker.startingcash) / self.broker.startingcash) * 100:.2f}%")
        print("===================================")
        print("===================================")
        self.macd.plot()
        self.rsi.plot()
        self.gaussian.plot()