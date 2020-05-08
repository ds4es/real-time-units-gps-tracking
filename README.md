Real-Time GPS Tracking Service with Python and Apache Kafka

Forked from: https://github.com/code-and-dogs/liveMaps

Start Zookeeper and Kafka
```
tmux new -s zookeeper-server-start -d
tmux send-keys "~/kafka/bin/zookeeper-server-start.sh ~/kafka/config/zookeeper.properties" Enter
tmux new -s kafka-server-start -d
tmux send-keys "~/kafka/bin/kafka-server-start.sh ~/kafka/config/server.properties" Enter
```

Start the app
```
conda activate my_env
# Under one console
python app.py
```

Start a GPS provider
```
# Under another console
python blue_service.py
```

For how long data is stored in kafka server? https://stackoverflow.com/questions/49978708/for-how-long-data-is-stored-in-kafka-server