# Stream BINANCE Data

wss://stream.binance.com:9443/ # binance socket
wscat -c wss://stream.binance.com:9443/ws/btcusdt@kline_5m # candlestick 5m stream
wscat -c wss://stream.binance.com:9443/ws/btcusdt@kline_5m | tee dataset.txt # output stream data to file

# install TA-Lib
# talib is for technical analysis of stock data

wget http://prdownloads.sourceforge.net/ta-lib/ta-lib-0.4.0-src.tar.gz # check version
tar -xzf ta-lib-0.4.0-src.tar.gz
cd ta-lib/

sudo ./configure
sudo make
sudo make install

pip3 install TA-Lib