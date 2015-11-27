#!/bin/bash
# kiox shell script

mkdir shellScipt 

sudo chmod 777 ./shellScipt 

cd shellScipt

sudo apt-get install tar

wget -A.gz http://nodejs.org/dist/v0.10.2/node-v0.10.2.tar.gz
tar -xzf node-v0.10.2.tar.gz

cd node-v0.10.2

./configure

make

sudo make install

cd ..

rm -rf node-v*

wget -A.gz http://54.255.185.184:8080/kiox.tar.gz

tar -xvzf kiox.tar.gz

rm kiox.tar.gz

sudo chmod 777 ./kiox

cd kiox

node app.js

cd ..

cd .. 

rm kiox.sh