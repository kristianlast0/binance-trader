import websocket
import json
import numpy
import dotenv
import os
from analysis.rsi import RSI
from analysis.macd import MACD
import threading

dotenv.load_dotenv()

class BinanceWebSocket:

    def __init__(self, symbol=None, interval=None):
        self.symbol = symbol or os.getenv('TICKER_SYMBOL')
        self.interval = interval or os.getenv('TICKER_INTERVAL')
        self.thread = None
        self.ws = None
        self.closes = []

    def on_open(self, ws):
        print('opened connection')

    def on_close(self, ws, close_status_code, close_msg):
        print(f'closed connection {close_status_code} {close_msg}')

    def on_message(self, ws, message):
        data = json.loads(message)
        candle = data['k']
        is_candle_closed = candle['x']
        close = candle['c']
        if is_candle_closed: self.closes.append(float(close))
        rsi_analysis = RSI(numpy.array(self.closes)) # RSI(numpy.array(self.closes), period=14, upperband=70, lowerband=30)
        macd_analysis = MACD(numpy.array(self.closes)) # MACD(numpy.array(self.closes), macd_short=12, macd_long=26, macd_signal=9)
        rsi_output = rsi_analysis.signal() # True, False, None
        macd_output = macd_analysis.signal() # True, False, None
        if rsi_output is True and macd_output is True:
            print(f'Buy Signal: RSI: {rsi_analysis.rsi[-1]:.2f}, MACD: {macd_analysis.macd[0]:.2f}')
        if rsi_output is False and macd_output is False:
            print(f'Sell Signal: RSI: {rsi_analysis.rsi[-1]:.2f}, MACD: {macd_analysis.macd[0]:.2f}')

    def on_error(self, ws, error):
        print('error')
        print(error)

    def connect(self):
        if not self.ws:
            url = f"wss://stream.binance.com:9443/ws/{self.symbol.lower()}@kline_{self.interval}"
            self.ws = websocket.WebSocketApp(url, on_open=self.on_open, on_message=self.on_message, on_error=self.on_error, on_close=self.on_close)
            # blocking call to run forever
            self.ws.run_forever()
            # Create a new thread and run the WebSocket connection in the background
            # if not self.thread:
            #     self.thread = threading.Thread(target=self.ws.run_forever)
            #     self.thread.start()

    def disconnect(self):
        if self.ws:
            self.ws.close()
            self.ws = None