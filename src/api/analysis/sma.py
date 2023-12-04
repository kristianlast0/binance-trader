import talib
import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import dotenv

dotenv.load_dotenv()

class SMA:

    def __init__(self, period_short=None, period_long=None, lag=None):
        self.period_short = period_short or int(os.getenv('SMA_SHORT'))
        self.period_long = period_long or int(os.getenv('SMA_LONG'))
        self.lag = lag or 0
        self.series = None
        self.buy_signals = []
        self.sell_signals = []
        self.sma_short = None
        self.sma_long = None

    def update(self, series):
        self.series = series if self.lag == 0 else series[:-self.lag]
        self.sma_short = talib.SMA(self.series, timeperiod=self.period_short)
        self.sma_long = talib.SMA(self.series, timeperiod=self.period_long)
        self.check_signals()

    def check_signals(self):
        # Reset signals
        self.buy_signals = []
        self.sell_signals = []
        # check sma short and sma long for crossovers
        if self.sma_short is not None and self.sma_long is not None and len(self.sma_short) >= 2 and len(self.sma_long) >= 2:
            # Reverse the arrays to get the latest values first
            sma_short = self.sma_short[::-1] # Reverse the array to get the latest SMA short values first
            sma_long = self.sma_long[::-1] # Reverse the array to get the latest SMA long values first
            # print('SMA Crossover - Bullish') # When the shorter SMA crosses above the longer SMA, it is a bullish signal
            if sma_short[0] > sma_long[0] and sma_short[1] <= sma_long[1]: self.buy_signals.append('SMA2050 Crossover')
            # print('SMA Crossunder - Bearish') # When the shorter SMA crosses below the longer SMA, it is a bearish signal
            if sma_short[0] < sma_long[0] and sma_short[1] >= sma_long[1]: self.sell_signals.append('SMA2050 Crossunder')

        # check sma short and price for crossovers
        # if self.sma_short is not None and len(self.sma_short) >= 2:
        #     # Reverse the arrays to get the latest values first
        #     sma_short = self.sma_short[::-1] # Reverse the array to get the latest SMA values first
        #     close_prices = self.series[::-1] # Reverse the array to get the latest close prices first
        #     # Crossover - Bullish - When the price crosses above the moving average, it is a bullish signal
        #     if close_prices[0] > sma_short[0] and close_prices[1] <= sma_short[1]: self.buy_signals.append('SMA Crossover')
        #     # Crossunder - Bearish - When the price crosses below the moving average, it is a bearish signal
        #     elif close_prices[0] < sma_short[0] and close_prices[1] >= sma_short[1]: self.sell_signals.append('SMA Crossunder')

    def plot(self):
        if self.sma_short is not None and self.sma_long is not None:
            # Create a new figure for plotting
            fig, ax = plt.subplots()
            ax.autoscale_view()
            ax.grid(True)
            # Plot the original series
            pd.Series(pd.to_numeric(self.series, errors='coerce')).plot(label='Price', ax=ax, color='black', linewidth=.5)
            pd.Series(pd.to_numeric(self.sma_short, errors='coerce')).plot(label=f'SMA-{self.period_short}', ax=ax, color='blue', linewidth=.5)
            pd.Series(pd.to_numeric(self.sma_long, errors='coerce')).plot(label=f'SMA-{self.period_long}', ax=ax, color='orange', linewidth=.5)
            # Add the legend to the plot
            handles, labels = ax.get_legend_handles_labels()
            ax.legend(handles, labels)
            # Save the figure
            plt.savefig('./images/sma.png', dpi=300)
        else:
            print("SMA is None. Cannot plot SMA.")