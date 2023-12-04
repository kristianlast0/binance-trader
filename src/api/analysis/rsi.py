import talib
import os
import numpy as np
import pandas as pd
from plotly.subplots import make_subplots
import plotly.graph_objects as go
import dotenv

dotenv.load_dotenv()

class RSI:

    def __init__(self, upperband=None, lowerband=None, lag=None):
        self.upperband = upperband or int(os.getenv('RSI_UPPERBAND'))
        self.lowerband = lowerband or int(os.getenv('RSI_LOWERBAND'))
        self.lag = lag or 0
        self.rsi = None
        self.buy_signals = []
        self.sell_signals = []
        self.buy_plots = []
        self.sell_plots = []

    def get_rsi(self, data, period=14):
        if not isinstance(data, pd.DataFrame): raise TypeError("Data must be a pandas dataframe.")
        self.period = period
        self.data = data if self.lag == 0 else data[:-self.lag]  # restrict data if lag
        self.data['rsi'] = talib.RSI(self.data['close'], timeperiod=period)

    def check_signals(self, ticks=1):
        # Reset signals
        self.buy_signals = []
        self.sell_signals = []
        # Bullish Signal - When RSI crosses below the lower band, it is a bullish signal
        if self.crossunder(ticks=ticks):
            self.buy_plots.append(self.data.index[-1])
            self.buy_signals.append('RSI Crossunder')
        # Bearish Signal - When RSI crosses above the upper band, it is a bearish signal
        if self.crossover(ticks=ticks):
            self.sell_plots.append(self.data.index[-1])
            self.sell_signals.append('RSI Crossover')

    def crossover(self, ticks=1):
        if len(self.data['rsi']) < (1+ticks): return False
        if ticks == 1: return self.data['rsi'].iloc[-1] > self.upperband and self.data['rsi'].iloc[-2] <= self.upperband
        else: return self.data['rsi'].iloc[-ticks:].max() > self.upperband and self.data['rsi'].iloc[-(ticks+1):].min() <= self.upperband

    def crossunder(self, ticks=1):
        if len(self.data['rsi']) < (1+ticks): return False
        if ticks == 1: return self.data['rsi'].iloc[-1] < self.lowerband and self.data['rsi'].iloc[-2] >= self.lowerband
        else: return self.data['rsi'].iloc[-ticks:].min() < self.lowerband and self.data['rsi'].iloc[-(ticks+1):].max() >= self.lowerband
    
    def overbought(self, ticks=1):
        if len(self.data['rsi']) < ticks: return False
        if ticks == 1: return self.data['rsi'].iloc[-1] > self.upperband
        elif ticks > 1 and len(self.data['rsi']) > ticks: return self.data['rsi'].iloc[-(ticks):].max() > self.upperband
    
    def oversold(self, ticks=1):
        if len(self.data['rsi']) < ticks: return False
        if ticks == 1: return self.data['rsi'].iloc[-1] < self.lowerband
        elif ticks > 1 and len(self.data['rsi']) > ticks: return self.data['rsi'].iloc[-(ticks):].min() < self.lowerband

    def plot(self, filename=None):
        # Force lowercase (optional)
        self.data.columns = [x.lower() for x in self.data.columns]
        # Create a new figure for plotting
        fig = make_subplots(rows=2, cols=1)
        # price Line
        fig.append_trace(
            go.Scatter(
                x=self.data.index,
                y=self.data['close'],
                line=dict(color='black', width=1),
                name='Close',
                showlegend=True,
                legendgroup='1',
            ), row=1, col=1
        )
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
        # Buy signals
        fig.append_trace(
            go.Scatter(
                x=self.buy_plots,
                y=self.data['close'].loc[self.buy_plots],
                mode='markers',
                marker=dict(color='green', size=40, symbol='triangle-up'),
                name='Buy',
                showlegend=True,
                legendgroup='1',
            ), row=1, col=1
        )
        # Sell signals
        fig.append_trace(
            go.Scatter(
                x=self.sell_plots,
                y=self.data['close'].loc[self.sell_plots],
                mode='markers',
                marker=dict(color='red', size=40, symbol='triangle-down'),
                name='Sell',
                showlegend=True,
                legendgroup='1',
            ), row=1, col=1
        )
        # RSI
        fig.append_trace(
            go.Scatter(
                x=self.data.index,
                y=self.data['rsi'],
                line=dict(color='blue', width=2),
                showlegend=False,
                legendgroup='2',
                name='RSI'
            ), row=2, col=1
        )
        # Overbought line
        fig.append_trace(
            go.Scatter(
                x=self.data.index,
                y=[self.upperband] * len(self.data),
                line=dict(color='red', width=2, dash='dash'),
                showlegend=False,
                legendgroup='2',
                name='Overbought'
            ), row=2, col=1
        )
        # Oversold line
        fig.append_trace(
            go.Scatter(
                x=self.data.index,
                y=[self.lowerband] * len(self.data),
                line=dict(color='green', width=2, dash='dash'),
                showlegend=False,
                legendgroup='2',
                name='Oversold'
            ), row=2, col=1
        )
        # Make it pretty
        layout = go.Layout(
            title=f'RSI - {self.period} Period',
            width=3840,
            height=2160,
            plot_bgcolor='#f2f2f2',
            # Font Families
            font_family='Monospace',
            font_color='#000000',
            font_size=20,
            yaxis=dict(
                title='Close Price',
                titlefont_size=20,
                tickfont_size=20,
            ),
            # add a secondary y axis for the rsi
            yaxis2=dict(
                title='RSI',
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
        filename = filename or 'rsi'
        # save the plot as image
        fig.write_image(f'./images/{filename}.png')