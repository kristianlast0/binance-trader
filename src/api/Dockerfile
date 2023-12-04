# Use an official Python runtime as a parent image
FROM python:3.8

# Set the working directory in the container
WORKDIR /usr/src/binapi-api

# Install system dependencies for TA-Lib and Matplotlib
RUN apt-get update && \
    apt-get install -y build-essential wget libcairo2 libjpeg-dev libgif-dev && \
    wget http://prdownloads.sourceforge.net/ta-lib/ta-lib-0.4.0-src.tar.gz && \
    tar -xzf ta-lib-0.4.0-src.tar.gz && \
    cd ta-lib && \
    ./configure && \
    make && \
    make install && \
    cd .. && \
    rm -rf ta-lib ta-lib-0.4.0-src.tar.gz

# Set the Matplotlib backend to Agg
RUN mkdir -p /root/.config/matplotlib && \
    echo "backend : Agg" > /root/.config/matplotlib/matplotlibrc

# Copy the requirements file into the container
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /usr/src/binapi-api
COPY . .

# Make port 5000 available to the world outside this container
EXPOSE 5000

CMD ["/bin/bash", "/usr/src/binapi-api/boot.sh"]