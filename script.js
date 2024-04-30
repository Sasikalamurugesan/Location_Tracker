document.getElementById('getLocationBtn').addEventListener('click', getLocation);

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var locationData = document.getElementById('locationData');
    locationData.innerHTML = `<p>Latitude: ${latitude}</p><p>Longitude: ${longitude}</p>`;

    
    sendDataToThingSpeak(latitude, longitude);
}

function sendDataToThingSpeak(latitude, longitude) {
    const apiKey = 'AKXE98HW7OEGB2S7';
    const channelID = '2526515';
    const latitudeField = '1'; 
    const longitudeField = '2'; 
    const urlLatitude = `https://api.thingspeak.com/update?api_key=${apiKey}&field${latitudeField}=${latitude}`;
    const urlLongitude = `https://api.thingspeak.com/update?api_key=${apiKey}&field${longitudeField}=${longitude}`;

    fetch(urlLatitude)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Latitude data sent to ThingSpeak:', data);
        displayThingSpeakGraph(latitudeField);
    })
    .catch(error => {
        console.error('Error sending latitude data to ThingSpeak:', error);
    });

    fetch(urlLongitude)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Longitude data sent to ThingSpeak:', data);
        displayThingSpeakGraph(longitudeField);
    })
    .catch(error => {
        console.error('Error sending longitude data to ThingSpeak:', error);
    });
}

function displayThingSpeakGraph(field) {
    const channelID = '2526515';
    const apiKey = '9T2JQIWVY73R29RO';
    const numPoints = '50'; 

    const graphContainer = document.getElementById('graphContainer');
    const iframe = document.createElement('iframe');
    iframe.src = `https://thingspeak.com/channels/${channelID}/charts/${field}?api_key=${apiKey}&dynamic=true&results=${numPoints}`;
    iframe.width = '100%';
    // iframe.height = '400';
    iframe.style.border = 'none';
    iframe.style.display = 'block';
    iframe.style.margin = '0 auto'; // Center the iframe horizontally
    iframe.style.aspectRatio = '16 / 9'; 
    graphContainer.appendChild(iframe);
}