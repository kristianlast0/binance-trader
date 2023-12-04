from binance.client import Client
import dotenv
import os
import datetime

dotenv.load_dotenv()
binance_client = Client(os.getenv('API_KEY'), os.getenv('API_SECRET'))

class Trade:

    def __init__(self, ticker_symbol=None):
        self.ticker_symbol = ticker_symbol or os.getenv('TICKER_SYMBOL')
        self.account = binance_client.get_account()
        ticker = binance_client.get_symbol_ticker(symbol=self.ticker_symbol)
        self.price = float(ticker['price'])
        self.price_updated = datetime.datetime.now()

    def balance(self, asset='USDT'):
        balance = binance_client.get_asset_balance(asset=asset)
        balance = float(balance['free'])
        return balance

    def get_price(self):
        if self.price is not None and (datetime.datetime.now() - self.price_updated).total_seconds() < 60:
            ticker = binance_client.get_symbol_ticker(symbol=self.ticker_symbol)
            self.price = float(ticker['price'])
            self.price_updated = datetime.datetime.now()
        return self.price

    def make_trade(self, type, quantity):
        # Place a market order to buy or sell
        price = self.get_price(symbol=self.ticker_symbol)
        if type == 'BUY':
            usdt_balance = self.balance(asset='USDT')
            cost = price * quantity
            if cost > usdt_balance:
                print("You don't have enough USDT!")
                return
        if type == 'SELL':
            btc_balance = self.balance(asset='BTC')
            if quantity > btc_balance:
                print("You don't have enough BTC!")
                return
        try:
            order = binance_client.create_order(
                symbol=self.ticker_symbol,
                side=type, # 'BUY' for a market buy, 'SELL' for a market sell
                type='MARKET',
                quantity=quantity,
                timeInForce='GTC'
            )
            print("Trade successfully placed!")
            print(order)
        except Exception as e:
            print("Error placing trade:", str(e))

    def get_min_notional(self):
        info = binance_client.get_symbol_info(self.ticker_symbol)
        for f in info['filters']:
            if f['filterType'] == 'NOTIONAL':
                return float(f['minNotional'])