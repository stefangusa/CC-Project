from flask import Flask, request
from flask_cors import CORS
from prometheus_flask_exporter import PrometheusMetrics
from requests import get

import ipaddress
import geocoder
import json

app = Flask(__name__)
CORS(app)
metrics = PrometheusMetrics(app)

SUCCESS = 200


@app.route("/", methods=['GET'])
def location():
    client_ip = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)

    if ipaddress.ip_address(client_ip).is_private:
        client_ip = get('https://api.ipify.org').text

    gps_coord = geocoder.ipinfo(client_ip)

    return json.dumps({'lat': gps_coord.lat, 'lon': gps_coord.lng, 'ip': client_ip}), SUCCESS


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
