import talib
import os
import numpy as np
import pandas as pd
from plotly.subplots import make_subplots
import plotly.graph_objects as go
import dotenv

dotenv.load_dotenv()

class MACD:

    def __init__(self, fast_period=None, slow_period=None, signal_period=None, lag=None):
        self.fast_period = fast_period or int(os.getenv('MACD_FAST'))
        self.slow_period = slow_period or int(os.getenv('MACD_SLOW'))
        self.signal_period = signal_period or int(os.getenv('MACD_SIGNAL'))
        self.lag = lag or 0
        self.buy_signals = []
        self.sell_signals = []
        self.sell_plots = []
        self.buy_plots = []

    def get_macd(self, data):
        if not isinstance(data, pd.DataFrame): raise TypeError("Data must be a pandas dataframe.")
        self.data = data # ['datetime', 'open', 'high', 'low', 'close', 'volume']
        # calculate the MACD, MACD signal, and MACD histogram using talib
        self.data['macd'], self.data['macd_signal'], self.data['macd_hist'] = talib.MACD(self.data['close'], fastperiod=self.fast_period, slowperiod=self.slow_period, signalperiod=self.signal_period)
        # self.macd, self.macd_signal, self.macd_hist = talib.MACD(self.data['close'], fastperiod=self.fast_period, slowperiod=self.slow_period, signalperiod=self.signal_period)
        # calculate the MACD, MACD signal, and MACD histogram using pandas
        # ema_fast = self.data['close'].ewm(span=self.fast_period, adjust=False, min_periods=self.fast_period).mean() # get ema fast
        # ema_slow = self.data['close'].ewm(span=self.slow_period, adjust=False, min_periods=self.slow_period).mean() # get ema slow
        # macd = ema_fast - ema_slow # get macd line
        # macd_signal = macd.ewm(span=self.signal_period, adjust=False, min_periods=self.signal_period).mean() # get macd signal line
        # macd_hist = macd - macd_signal # get macd histogram
        # # self.data['ema_fast'] = ema_fast # add ema fast to dataframe
        # # self.data['ema_slow'] = ema_slow # add ema slow to dataframe
        # self.data['macd'] = macd # add macd line to dataframe
        # self.data['macd_hist'] = macd_hist # add macd histogram to dataframe
        # self.data['macd_signal'] = macd_signal # add macd signal line to dataframe

    def check_signals(self, ticks=1):
        # Reset signals
        self.buy_signals = []
        self.sell_signals = []
        if self.crossover(ticks=ticks):
            self.buy_plots.append(self.data.index[-1])
            self.buy_signals.append('MACD Crossover')
        if self.crossunder(ticks=ticks):
            self.sell_plots.append(self.data.index[-1])
            self.sell_signals.append('MACD Crossunder')
        # # check there are at least 2 macd values to compare and 2 macd signal values to compare
        # if self.data['macd'] is not None and len(self.data['macd']) >= 2 and self.data['macd_signal'] is not None and len(self.data['macd_signal']) >= 2:
        #     # Simple MACD Crossover Strategy
        #     # MACD Crossover - Bullish - When MACD crosses above the signal line, it is a bullish signal
        #     if self.data['macd'].iloc[-1] > self.data['macd_signal'].iloc[-1] and self.data['macd'].iloc[-2] <= self.data['macd_signal'].iloc[-2]:
        #         self.buy_plots.append(self.data.index[-1])
        #         self.buy_signals.append('MACD Crossover')
        #     # MACD Crossunder - Bearish - When MACD crosses below the signal line, it is a bearish signal
        #     if self.data['macd'].iloc[-1] < self.data['macd_signal'].iloc[-1] and self.data['macd'].iloc[-2] >= self.data['macd_signal'].iloc[-2]:
        #         self.sell_plots.append(self.data.index[-1])
        #         self.sell_signals.append('MACD Crossunder')
            # Divergence Strategy
            # MACD Bullish Divergence - When MACD makes a new low and the price doesn't
            # if self.data['macd'].iloc[-1] < self.data['macd'].iloc[-2] and self.data['macd_signal'].iloc[-1] < self.data['macd_signal'].iloc[-2] and self.data['macd'].iloc[-1] > self.data['macd_signal'].iloc[-1] and self.data['macd'].iloc[-2] < self.data['macd_signal'].iloc[-2]:
            #     self.buy_plots.append(self.data.index[-1])
            #     self.buy_signals.append('MACD Bullish Divergence')
            # # MACD Bearish Divergence - When MACD makes a new high and the price doesn't
            # if self.data['macd'].iloc[-1] > self.data['macd'].iloc[-2] and self.data['macd_signal'].iloc[-1] > self.data['macd_signal'].iloc[-2] and self.data['macd'].iloc[-1] < self.data['macd_signal'].iloc[-1] and self.data['macd'].iloc[-2] > self.data['macd_signal'].iloc[-2]:
            #     self.sell_plots.append(self.data.index[-1])
            #     self.sell_signals.append('MACD Bearish Divergence')

    def bullish(self):
        if self.data['macd'] is not None and len(self.data['macd']) >= 1 and self.data['macd_signal'] is not None and len(self.data['macd_signal']) >= 1:
            if self.data['macd'].iloc[-1] > self.data['macd_signal'].iloc[-1]: return True
        return False

    def bearish(self):
        if self.data['macd'] is not None and len(self.data['macd']) >= 1 and self.data['macd_signal'] is not None and len(self.data['macd_signal']) >= 1:
            if self.data['macd'].iloc[-1] < self.data['macd_signal'].iloc[-1]: return True
        return False

    def crossover(self, ticks=1):
        tick = (1+ticks)
        if self.data['macd'] is not None and len(self.data['macd']) >= tick and self.data['macd_signal'] is not None and len(self.data['macd_signal']) >= tick:
            for i in range(1, tick):
                bi = (i+1)
                if self.data['macd'].iloc[-i] > self.data['macd_signal'].iloc[-i] and self.data['macd'].iloc[-bi] <= self.data['macd_signal'].iloc[-bi]: return True
        return False

    def crossunder(self, ticks=1):
        tick = (1+ticks)
        if self.data['macd'] is not None and len(self.data['macd']) >= tick and self.data['macd_signal'] is not None and len(self.data['macd_signal']) >= tick:
            for i in range(1, tick):
                bi = (i+1)
                if self.data['macd'].iloc[-i] < self.data['macd_signal'].iloc[-i] and self.data['macd'].iloc[-bi] >= self.data['macd_signal'].iloc[-bi]: return True
        return False

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
        # Fast Signal (%k)
        fig.append_trace(
            go.Scatter(
                x=self.data.index,
                y=self.data['macd'],
                line=dict(color='black', width=2),
                name='MACD',
                # showlegend=False,
                legendgroup='2',
            ), row=2, col=1
        )
        # Slow signal (%d)
        fig.append_trace(
            go.Scatter(
                x=self.data.index,
                y=self.data['macd_signal'],
                line=dict(color='orange', width=2),
                # showlegend=False,
                legendgroup='2',
                name='Signal'
            ), row=2, col=1
        )
        # Colorize the histogram values
        colors = np.where(self.data['macd_hist'] < 0, 'tomato', 'mediumseagreen')
        # Plot the histogram
        fig.append_trace(
            go.Bar(
                x=self.data.index,
                y=self.data['macd_hist'],
                name='Histogram',
                marker_color=colors,
            ), row=2, col=1
        )
        # Make it pretty
        layout = go.Layout(
            title=f'MACD ({self.fast_period}, {self.slow_period}, {self.signal_period})',
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
                # range=[self.data['close'].min() * 0.99, self.data['close'].max() * 1.01]
            ),
            # add a secondary y axis for the macd
            yaxis2=dict(
                title='MACD',
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
        filename = filename or 'macd'
        # save the plot as image
        fig.write_image(f'./images/{filename}.png')