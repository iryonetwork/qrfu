var cropper;
var settings = {
    ratio: null,
    filetype: null,
    multiple: null,
};

var setup = function() {
    var url = window.location.href.split('/');
    var uid = url[url.length - 1];
    var request = new XMLHttpRequest();

    request.onload = function() {
        if (request.status === 200) {
            document.getElementById('spinner').style.display = 'none';

            settings = JSON.parse(request.response);

            setupButtons();
        } else {
            if (request.responseText === 'no id') {
                document.getElementById('message').innerText = 'Failed to connect to server, qr page is not connected.';
            } else {
                document.getElementById('message').innerText = 'Failed to connect to server, please try again.';
            }
            document.getElementById('message').style.display = 'block';
            document.getElementById('spinner').style.display = 'none';
        }
    };
    
    request.open('GET', '/api/info/' + uid, true);
    request.send(null);
}

var setupButtons = function() {
    if (settings.filetype === 'audio') {
        document.getElementById('fileInput').style.display = 'none';
        document.getElementById('audioInput').style.display = 'block';
    } else if (settings.filetype === 'image') {
        document.getElementById('fileInput').style.display = 'block';
        document.getElementById('audioInput').style.display = 'none';
    } else {
        document.getElementById('fileInput').style.display = 'block';
        document.getElementById('audioInput').style.display = 'block';
    }
}

var sendFile = function(form) {
    var url = window.location.href.split('/');
    var uid = url[url.length - 1];
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (request.status === 0) {
            return; // invalid state
        }

        document.getElementById('spinner').style.display = 'none';
        document.getElementById('message').innerHTML = '';
        document.getElementById('message').style.display = 'block';
        document.getElementById('fileLabel').innerText = 'TAKE PHOTO';
        document.getElementById('audioButton').innerText = 'RECORD AUDIO';
        document.getElementById('upload').reset();

        if (settings.multiple) {
            setupButtons();
        }
        
        if (request.status === 200) {
            document.documentElement.style.background = '#45d957';
            document.getElementById('message').innerText = 'Successful';
        } else {
            document.documentElement.style.background = '#0296e6';

            if (request.responseText === 'no id') {
                document.getElementById('message').innerText = 'Failed to upload, qr page is not connected.';
            } else {
                document.getElementById('message').innerText = 'Failed to upload, please try again.';
            }
        }
    };
    
    request.open('POST', '/api/upload/' + uid, true);
    request.send(form);
};

document.addEventListener('DOMContentLoaded', function(e) {
    document.getElementById('file').onchange = onSubmitImage;

    setupAudio().then(setup);
});