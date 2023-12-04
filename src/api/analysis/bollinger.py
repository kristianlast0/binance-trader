import talib
import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import dotenv

dotenv.load_dotenv()

class BollingerBands:

    def __init__(self, period=None, dev_up=None, dev_down=None, lag=None):
        self.series = None
        self.period = period or int(os.getenv('BB_PERIOD'))
        self.dev_up = dev_up or float(os.getenv('BB_DEV_UP'))
        self.dev_down = dev_down or float(os.getenv('BB_DEV_DOWN'))
        self.lag = lag or 0
        self.upper_band = None
        self.middle_band = None
        self.lower_band = None
        self.buy_signals = []
        self.sell_signals = []

    def update(self, series):
        self.series = series if self.lag == 0 else series[:-self.lag]
        self.upper_band, self.middle_band, self.lower_band = talib.BBANDS(self.series, timeperiod=self.period, nbdevup=self.dev_up, nbdevdn=self.dev_down)
        self.check_signals()

    def check_signals(self):
        # Reset signals
        self.buy_signals = []
        self.sell_signals = []
        # check there are at least 2 upper band values to compare and 2 lower band values to compare
        if self.upper_band is not None and len(self.upper_band) >= 2 and self.lower_band is not None and len(self.lower_band) >= 2:
            series = self.series[::-1] # Reverse the array to get the latest series values first
            upper_band = self.upper_band[::-1] # Reverse the array to get the latest upper band values first
            lower_band = self.lower_band[::-1] # Reverse the array to get the latest lower band values first
            if not np.isnan(upper_band[0]) and not np.isnan(upper_band[1]) and not np.isnan(lower_band[0]) and not np.isnan(lower_band[1]):
                # Price Crossing Below Lower Band - Bullish Signal
                if series[0] < lower_band[0] and series[1] >= lower_band[1]: self.buy_signals.append('BB Lower Crossover')
                # Price Crossing Above Upper Band - Bearish Signal
                elif series[0] > upper_band[0] and series[1] <= upper_band[1]: self.sell_signals.append('BB Upper Crossover')
                # Bollinger Squeeze - When the upper and lower bands are close together, it is a sign of low volatility
                if upper_band[0] - lower_band[0] <= 0.05 and upper_band[1] - lower_band[1] > 0.05: self.buy_signals.append('BB Squeeze')

    def plot(self):
        if self.upper_band is not None:
            # create a new figure for plotting
            fig, ax = plt.subplots()
            ax.grid(True)
            ax.autoscale_view()
            pd.Series(pd.to_numeric(self.series, errors='coerce')).plot(label='Price', ax=ax, color='black', linewidth=.5)
            pd.Series(pd.to_numeric(self.upper_band, errors='coerce')).plot(label='Upper', ax=ax, color='blue', linestyle='solid', alpha=1, linewidth=.5)
            pd.Series(pd.to_numeric(self.middle_band, errors='coerce')).plot(label='Mid', ax=ax, color='orange', linestyle='solid', alpha=1, linewidth=.5)
            pd.Series(pd.to_numeric(self.lower_band, errors='coerce')).plot(label='Lower', ax=ax, color='red', linestyle='solid', alpha=1, linewidth=.5)
            # Add the legend
            handles, labels = ax.get_legend_handles_labels()
            ax.legend(handles, labels)
            # Save the figure
            plt.savefig('./images/bollinger-bands.png', dpi=300)