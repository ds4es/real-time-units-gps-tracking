from flask import Flask, render_template, Response
from pykafka import KafkaClient
from pykafka.common import OffsetType


def get_kafka_client():
    return KafkaClient(hosts='127.0.0.1:9092')

app = Flask(__name__)

@app.route('/')
@app.route('/index.html')
def index():
    PAGE_TITLE='Jakarta Bus Live Map'
    
    MAP_URL_TEMPLATE = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    MAP_STARTING_CENTER = [-6.2088,106.8456];
    MAP_STARTING_ZOOM = 12;
    MAP_MAX_ZOOM = 18;

    KAFKA_TOPIC = 'geodata_stream_topic_123'
    # https://stackoverflow.com/questions/12096522/render-template-with-multiple-variables
    return(render_template('index.html', **locals()))

#Consumer API
@app.route('/topic/<topicname>')
def get_messages(topicname):
    client = get_kafka_client()
    def events():
        for i in client.topics[topicname].get_simple_consumer(
            # The 2 following parameters avoid recovering old data
            # to only get latest/new data
            auto_offset_reset=OffsetType.LATEST,
            reset_offset_on_start=True
        ):
            yield 'data:{0}\n\n'.format(i.value.decode())
    return Response(events(), mimetype="text/event-stream")

if __name__ == '__main__':
    app.run(debug=True, port=5001)
