const http = require('http');

const server = http.createServer(function(request, response) {
    let data = [];
    let data_json = {};
    request.on('data', (chunk) => {
        data.push(chunk);
        data_json = JSON.parse(data);
    });
    request.on('end', () => {
        let code = `
            let div = document.createElement('div');
            div.id = 'mapDiv';
            div.style = 'width:700px;height:500px;margin:10px 25px;position:relative;overflow:visible;'
    
            let div_map = document.createElement('div');
            div_map.id = 'map';
            div_map.style = 'width:100%;height:100%;position:absolute;overflow:visible;'
            div.appendChild(div_map);
    
            let script_func = document.createElement('script');
            script_func.innerText ="function initMap() {\
                        var directionsService = new google.maps.DirectionsService();\
                        var directionsRenderer = new google.maps.DirectionsRenderer();\
                        var map = new google.maps.Map(document.getElementById('map'));\
                        directionsRenderer.setMap(map);\
                        var request = {\
                            origin: {'lat': ${data_json['lat']}, 'lng': ${data_json['lon']}},\
                            destination: '${data_json['dest']}',\
                            travelMode: '${data_json['travel_mode']}'\
                        };\
                        directionsService.route(request, function(result, status) {\
                            if (status === 'OK') {\
                                directionsRenderer.setDirections(result);\
                            }\
                        });\
                    }";
            div.appendChild(script_func);
            
            let script_src = document.createElement('script');
            script_src.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBciLPLMhJanKLMD\W" +
                "-_KPWNTBzGsXTuxbo&callback=initMap";
            div.appendChild(script_src);
            
            if (document.contains(document.getElementById('mapDiv'))) {
                document.getElementById('mapDiv').remove();
            }
            
            document.getElementById('respDiv').appendChild(div);`;

        response.writeHead (
            200,
            {'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Cache-Control'
            });
        response.end(code)
    });
});

const PORT = 8080;
const ADDR = '0.0.0.0';
server.listen(PORT, ADDR);
console.log(`Listening at http://${ADDR}:${PORT}`);
