redis-server --loadmodule /home/young/Desktop/code/RedisTimeSeries/bin/redistimeseries.so config/redis.conf

echo 'start news process'
cd ../material-finbert
conda activate finbert1
python3 main.py


echo 'redis-cli'
echo 'config get maxmemory'
echo 'config set maxmemory 4GB'
echo 'config get maxmemory'

echo 'sudo service redis-server stop'
