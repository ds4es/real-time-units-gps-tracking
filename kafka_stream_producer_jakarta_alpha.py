from pykafka import KafkaClient
import json
from datetime import datetime
import uuid
import time
import pandas as pd
import zipfile

#READ COORDINATES
zf = zipfile.ZipFile('./data/jakarta/data_jakarta_service_alpha.csv.zip') 
coordinates = pd.read_csv(zf.open('data_jakarta_service_alpha.csv'))
coordinates = coordinates.sort_values(by='gps_datetime',ascending=True)

#GENERATE UUID
def generate_uuid():
    return uuid.uuid4()

#KAFKA PRODUCER
client = KafkaClient(hosts="localhost:9092")
topic = client.topics['geodata_stream_topic_123']
producer = topic.get_sync_producer()

#CONSTRUCT MESSAGE AND SEND IT TO KAFKA
data = {}
data['service'] = 'alpha'

def generate_checkpoint(coordinates):
    i = 0
    previous_datetime = None
    current_datetime = None
    speed_up_n_times = 1

    while i < len(coordinates):
        previous_datetime = current_datetime
        current_datetime = coordinates.iloc[i]['gps_datetime']
        data['key'] = coordinates.iloc[i]['trip_id']
        data['datetime'] = coordinates.iloc[i]['gps_datetime']
        data['unit'] = coordinates.iloc[i]['bus_code']
        data['latitude'] = coordinates.iloc[i]['latitude']
        data['longitude'] = coordinates.iloc[i]['longitude']
        data['color'] = coordinates.iloc[i]['color']
        message = json.dumps(data)
        print(message)
        producer.produce(message.encode('ascii'))

        if previous_datetime != None:
            sleeping_time = abs(datetime.strptime(current_datetime,"%Y-%m-%d %H:%M:%S" ) - datetime.strptime(previous_datetime,"%Y-%m-%d %H:%M:%S" )).seconds/speed_up_n_times
            time.sleep(sleeping_time)

        #if bus reaches last coordinate, start from beginning
        if i == len(coordinates)-1:
            i = 0
        else:
            i += 1

generate_checkpoint(coordinates)
