from flask import Flask, request
from flask_cors import CORS
from prometheus_flask_exporter import PrometheusMetrics
import json

from models import Location
from database import db_session, init_db

app = Flask(__name__)
CORS(app)
PrometheusMetrics(app)

SUCCESS = 200

init_db()


@app.route("/insert", methods=['POST'])
def insert():
    data = request.form

    location = Location(ip=data['ip'], location=data['dest'].lower())

    if not db_session.query(Location).filter(Location.ip == data['ip']).filter(
            Location.location == data['dest']).first():
        db_session.add(location)
        db_session.commit()

    return "Success", SUCCESS


@app.route("/retrieve", methods=['POST'])
def success():
    data = request.form
    response = []

    entries = db_session.query(Location).filter(Location.ip == data['ip'])
    for entry in entries:
        response.append(entry.location)

    return json.dumps(response), SUCCESS


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
