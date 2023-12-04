import os
import talib
import numpy as np
import pandas as pd
import dotenv
from scipy.ndimage import gaussian_filter1d
from plotly.subplots import make_subplots
import plotly.graph_objects as go

dotenv.load_dotenv()

class Gaussian:

    def __init__(self):
        self.data = None
        self.sigma = 1
        self.lag = 0

    def get_gaussian(self, data, sigma=1):
        if not isinstance(data, pd.DataFrame): raise TypeError("Data must be a pandas dataframe.")
        self.data = data # ['datetime', 'open', 'high', 'low', 'close', 'volume']
        self.sigma = sigma
        std = self.data['close'].std() # get standard deviation
        std_threshold = std * self.sigma # get standard deviation threshold
        filtered_data = gaussian_filter1d(self.data['close'], sigma=sigma) # apply gaussian filter
        outliers = (self.data['close'] - filtered_data).abs() > std_threshold * std # get outliers
        filtered_data[outliers] = float('nan') # set outliers to nan
        self.data['gaussian'] = filtered_data # add gaussian to dataframe

    # def get_gaussian(self, data, sigma=1):
    #     if not isinstance(data, pd.DataFrame): raise TypeError("Data must be a pandas dataframe.")
    #     self.data = data # ['datetime', 'open', 'high', 'low', 'close', 'volume']
    #     self.sigma = sigma
    #     self.data['sma'] = talib.SMA(self.data['close'], timeperiod=20) # Calculate a simple moving average using TALib
    #     sma_without_nan = self.data['sma'].fillna(0) # Replace NaN values in the SMA with 0 before applying the filter
    #     std_dev = self.data['close'].std() # Calculate the standard deviation of the close prices
    #     if np.isnan(std_dev): std_dev = 1
    #     self.data['gaussian'] = gaussian_filter1d(sma_without_nan, sigma=std_dev) # Apply the Gaussian filter to the SMA using scipy's gaussian_filter1d

    def check_signals(self):
        self.buy_signals = []
        self.sell_signals = []
        if self.bullish(): self.buy_signals.append('Gaussian Bullish')
        if self.bearish(): self.sell_signals.append('Gaussian Bearish')

    # check if the gaussian is bullish
    def bullish(self):
        if self.data['gaussian'] is not None and len(self.data['gaussian']) >= 2:
            if self.data['gaussian'].iloc[-1] > self.data['gaussian'].iloc[-2]: return True
        return False
    
    # check if the gaussian is bearish
    def bearish(self):
        if self.data['gaussian'] is not None and len(self.data['gaussian']) >= 2:
            if self.data['gaussian'].iloc[-1] < self.data['gaussian'].iloc[-2]: return True
        return False

    def plot(self, filename=None):
        # Force lowercase (optional)
        self.data.columns = [x.lower() for x in self.data.columns]
        # Create a new figure for plotting
        fig = make_subplots(rows=1, cols=1)
        # Candlestick chart for pricing
        fig.append_trace(
            go.Candlestick(
                x=self.data.index,
                open=self.data['open'],
                high=self.data['high'],
                low=self.data['low'],
                close=self.data['close'],
                increasing_line_color='mediumseagreen',
                decreasing_line_color='tomato',
                showlegend=False,
                legendgroup='1',
            ), row=1, col=1
        )
        # Gaussian
        fig.append_trace(
            go.Scatter(
                x=self.data.index,
                y=self.data['gaussian'],
                line=dict(color='blue', width=1, dash='dot'),
                name='Gaussian',
                showlegend=True,
                legendgroup='1',
            ), row=1, col=1
        )
        # Make it pretty
        layout = go.Layout(
            title=f'Gaussian (Sigma: {self.sigma})',
            width=3840,
            height=2160,
            plot_bgcolor='#f2f2f2',
            # Font Families
            font_family='Monospace',
            font_color='#000000',
            font_size=20,
            yaxis=dict(
                title='Price',
                titlefont_size=20,
                tickfont_size=20,
            ),
            xaxis=dict(
                rangeslider=dict(
                    visible=False
                )
            )
        )
        # Update options and show plot
        fig.update_layout(layout)
        # Save the figure
        filename = filename or 'gaussian'
        # save the plot as image
        fig.write_image(f'./images/{filename}.png')