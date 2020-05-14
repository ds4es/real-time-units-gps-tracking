from pykafka import KafkaClient
import json
from datetime import datetime
import uuid
import time


#READ COORDINATES FROM GEOJSON
input_file = open('./data/paris/data_paris_service_alpha.json')
json_array = json.load(input_file)
coordinates = json_array['data']

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
    speed_up_n_times = 100

    while i < len(coordinates):
        previous_datetime = current_datetime
        current_datetime = coordinates[i]['datetime']
        data['key'] = data['service'] + '_' + str(generate_uuid())
        data['datetime'] = coordinates[i]['datetime']
        data['unit'] = coordinates[i]['unit']
        data['latitude'] = coordinates[i]['coordinates'][1]
        data['longitude'] = coordinates[i]['coordinates'][0]
        data['color'] = coordinates[i]['color']
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
