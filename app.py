from flask import Flask, render_template, Response
from pykafka import KafkaClient
from pykafka.common import OffsetType


def get_kafka_client():
    return KafkaClient(hosts='127.0.0.1:9092')

app = Flask(__name__)

@app.route('/')
@app.route('/index.html')
def index():
    return(render_template('index.html', title='London Bus Live Map'))

#Consumer API
@app.route('/topic/<topicname>')
def get_messages(topicname):
    client = get_kafka_client()
    def events():
        for i in client.topics[topicname].get_simple_consumer(
    		# nécessaire pour éviter de récupérer d'ancienne données
    		# permet de ne récupérer que de nouvelles données
    		auto_offset_reset=OffsetType.LATEST,
    		reset_offset_on_start=True
    	):
            yield 'data:{0}\n\n'.format(i.value.decode())
    return Response(events(), mimetype="text/event-stream")

if __name__ == '__main__':
    app.run(debug=True, port=5001)
