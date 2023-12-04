from flask import Flask, jsonify, flash, request, redirect, url_for
from dotenv import load_dotenv
from flask_cors import CORS
from binance.client import Client
import os
import csv
import datetime
import backtrader as bt
from strategy import MACDRSIStrategy
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from ws import BinanceWebSocket
from analysis.macd import MACD
from analysis.rsi import RSI
from analysis.sma import SMA
from analysis.bollinger import BollingerBands
import numpy as np
import pandas as pd

load_dotenv()

app = Flask(__name__)
cors = CORS(app, origins=['*'])
app.secret_key = os.getenv('SECRET_KEY')
binance_client = Client(os.getenv('API_KEY'), os.getenv('API_SECRET'))
# binance_ws = BinanceWebSocket(symbol=os.getenv("TICKER_SYMBOL"), interval=os.getenv("TICKER_INTERVAL")).connect()

today = datetime.date.today().strftime("%d %b, %Y %H:%M:%S")
fromdate = os.getenv("TICKER_START_DATE") or "1 Jul, 2017 00:00:00"
todate = os.getenv("TICKER_END_DATE") or today

fromdate_string = datetime.datetime.strptime(fromdate, "%d %b, %Y %H:%M:%S").strftime("%Y%m%d")
todate_string = datetime.datetime.strptime(todate, "%d %b, %Y %H:%M:%S").strftime("%Y%m%d")
filename = f'./data/{os.getenv("TICKER_SYMBOL")}-{os.getenv("TICKER_INTERVAL")}-{fromdate_string}-{todate_string}.csv'

def get_csv():
	candlesticks = binance_client.get_historical_klines(os.getenv("TICKER_SYMBOL"), os.getenv("TICKER_INTERVAL"), fromdate, todate)
	try:
		with open(filename, 'w', newline='') as csvfile:
			candlestick_writer = csv.writer(csvfile, delimiter=',')
			for candle in candlesticks:
				candle[0] = candle[0] / 1000
				candlestick_writer.writerow(candle)
			csvfile.close()
			return True
	except Exception as e:
		return False

@app.route('/', methods=['GET', 'POST'])
def index():
	return jsonify({'message': 'Hello World'})

@app.route('/data', methods=['GET'])
def data():
	if get_csv(): return jsonify({ 'message': 'Data saved' })
	return jsonify({ 'message': 'Download failed' })

@app.route('/backtest', methods=['GET'])
def backtest():

	balance = float(os.getenv("BACKTEST_BALANCE")) or 100000
	file_path = os.path.abspath(filename)

	if not os.path.exists(file_path):
		csv = get_csv()
		if not csv: return jsonify({ 'message': f'Download failed {filename}' })
		else: print(f'Downloaded {filename}')

	cerebro = bt.Cerebro()
	cerebro.broker.set_cash(balance)
	cerebro.broker.setcommission(commission=0.001)

	timeframes = {
		'1m': { 'timeframe': bt.TimeFrame.Minutes, 'compression': 1 },
		'3m': { 'timeframe': bt.TimeFrame.Minutes, 'compression': 1 },
		'15m': { 'timeframe': bt.TimeFrame.Minutes, 'compression': 1 },
		'1h': { 'timeframe': bt.TimeFrame.Minutes, 'compression': 1 },
		'1d': { 'timeframe': bt.TimeFrame.Days, 'compression': 1 },
		'1w': { 'timeframe': bt.TimeFrame.Weeks, 'compression': 1 },
		'1M': { 'timeframe': bt.TimeFrame.Months, 'compression': 1 }
	}

	tf = timeframes.get(os.getenv("TICKER_INTERVAL"), { 'timeframe': bt.TimeFrame.Days, 'compression': 1 })
	data = bt.feeds.GenericCSVData(dataname=file_path, dtformat=2, timeframe=tf['timeframe'], compression=tf['compression'])
	cerebro.adddata(data)
	cerebro.addstrategy(MACDRSIStrategy)
	cerebro.run()
	try: os.remove('./images/backtest.png')
	except: pass
	cerebro.plot(style='line', volume=False, iplot=False, figsize=(22, 14))
	plt.savefig('./images/backtest.png', bbox_inches='tight', dpi=300)
	percentage_gains = round((cerebro.broker.getvalue() - balance) / balance * 100, 1)
	gains = cerebro.broker.getvalue() - balance
	return jsonify({
		'Balance': cerebro.broker.getvalue(),
		'Gains %': percentage_gains,
		'Gains': round(gains, 2)
	})

@app.route('/fees', methods=['GET'])
def fees():
	fees = binance_client.get_trade_fee(symbol=os.getenv("TICKER_SYMBOL"))
	return jsonify(fees)

@app.route('/account', methods=['GET'])
def account():
	account = binance_client.get_account()
	return jsonify(account)

@app.route('/history', methods=['GET'])
def history():
	try:
		candlesticks = binance_client.get_historical_klines(os.getenv("TICKER_SYMBOL"), os.getenv("TICKER_INTERVAL"), fromdate, todate)
		sticks = []
		for data in candlesticks:
			candlestick = {
				"time": data[0] / 1000,
				"open": float(data[1]),
				"high": float(data[2]),
				"low": float(data[3]),
				"close": float(data[4]),
			}
			sticks.append(candlestick)
		return jsonify(sticks)
	except Exception as e:
		return jsonify({'error': e})

@app.route('/prices', methods=['GET'])
def prices():
	prices = binance_client.get_all_tickers()
	return jsonify(prices)

if __name__ == "__main__":
	app.run(debug=True)
