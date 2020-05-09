Implementation of a real-time GPS tracking service with Python and Apache Kafka. For demonstration, 2 fake GPS positionning services can be launch with the following Python scripts:

```bash
python kafka_stream_producer_alpha.py
python kafka_stream_producer_beta.py
``` 

Forked from: https://github.com/code-and-dogs/liveMaps

* **Apache Kafka** is a scalable, fault-tolerant, publish-subscribe messaging system, used for building real-time data pipelines and streaming apps. It uses Zookeeper to track status of kafka cluster nodes. It also keeps track of Kafka topics, partitions etc.

* **ZooKeeper** is a centralized service for maintaining configuration information, naming, providing distributed synchronization, and providing group services.


## Install prerequisites (for RHEL 8/CentOS 8)
```bash
# Install prerequisites package
sudo dnf install java-11-openjdk wget tmux -y
```

## Download, setup and start Kafka and Zookeeper
```bash
# Download and extract Kafka under $HOME/kafka
curl -s ~/Downloads https://downloads.apache.org/kafka/2.5.0/kafka_2.13-2.5.0.tgz | tar -xvzf --strip 1 -C ~/kafka
# To permit Kafka topic deletion
echo "delete.topic.enable = true" | tee -a ~/kafka/config/server.properties
```

Setup environment variables that will be used by the following commands for your configuration.
```bash
export BROKER_IP_ADDRESS=localhost
export BROKER_PORT=9092
```
Here we place Zookeeper, Kafka, producers apps and the consumer app under the same host that's why we set `localhost` here.

Start Zookeeper and Kafka under different tmux sessions.
```bash
# Start Zookeeper service in a tmux session
tmux new -s zookeeper-server-start -d
tmux send-keys "~/kafka/bin/zookeeper-server-start.sh ~/kafka/config/zookeeper.properties" Enter

# Hostname and port the broker will advertise to producers and 
# consumers. If not set, it uses the value for "listeners" if 
# configured.  Otherwise, it will use the value returned from 
# java.net.InetAddress.getCanonicalHostName().
echo "
advertised.listeners=PLAINTEXT://${broker_ip_address}:${broker_port}
" | tee -a ~/kafka/config/server.properties

# Start Kafka server in a tmux session
tmux new -s kafka-server-start -d
tmux send-keys "~/kafka/bin/kafka-server-start.sh ~/kafka/config/server.properties" Enter
```

## Start the tracking app

```bash
# Download this repo
git clone https://github.com/ds4es/tracking-service-python-kafka
# launch the app
python app.py
```

## Start GPS positionning providers

*(Under another terminal)*
```bash
python kafka_stream_producer_alpha.py
python kafka_stream_producer_beta.py
```

## Additional setup

We don't need any retention for our service as we only want last GPS location updates. Therfore we setup the topic retention to 0 ms. (By default the retention is set to 168 hours, cf. [Kafka documentation - log.retention.hours](https://kafka.apache.org/documentation/#log.retention.hours))  
```bash
 ~/kafka/bin/kafka-configs.sh --bootstrap-server localhost:9092 --alter --topic geodata_stream_topic_123 --add-config retention.ms=0
```

For how long data is stored in kafka server? https://stackoverflow.com/questions/49978708/for-how-long-data-is-stored-in-kafka-server

## Kafka basic commands

Create a Kafka topic
```bash
~/kafka/bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic your_topic_name --config retention.hours=hours_to_keep_log_file
```

List all Kafka topics
```bash
~/kafka/bin/kafka-topics.sh --list --zookeeper localhost
```

Check a Kafka topic information
```bash
~/kafka/bin/kafka-topics.sh --describe --zookeeper localhost --topic your_topic_name
```

Delete a Kafka topic
```bash
./bin/kafka-topics.sh --zookeeper localhost --delete --topic your_topic_name
```

## Reference
* [Kafka Documentation](https://kafka.apache.org/documentation/)