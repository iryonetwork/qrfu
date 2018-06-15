// audio setup - check if using default or alternate audio

var setupAudio = function() {
    return new Promise((resolve, reject) => {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices && typeof MediaRecorder !== "undefined") {
            navigator.mediaDevices.enumerateDevices()
                .then(function(devices) {
                    devices = devices.filter(d => d.kind === 'audioinput');

                    var el = document.getElementById('audioInputAlt');
                    el.parentNode.removeChild(el);

                    document.getElementById('audioButton').onclick = onClickAudio;

                    resolve();
                })
                .catch(function(err) {
                    setAltAudio();
                    resolve();
                });
        } else {
            setAltAudio();
            resolve();
        }
    });
};

var setAltAudio = function() {
    var el = document.getElementById('audioInput');
    el.parentNode.removeChild(el);

    document.getElementById('audioInputAlt').id = 'audioInput';
    document.getElementById('audioButtonAlt').id = 'audioButton';

    document.getElementById('audio').onchange = onSubmitAudioAlt;
}

// default audio code

var onUploadAudio = function(event) {
    event.preventDefault();
    
    var data = document.getElementById('audioPreview').src;

    document.documentElement.style.background = '#0296e6';
    document.getElementById('submit').disabled = true;
    document.getElementById('audioPreview').src = '';
    document.getElementById('audioContainer').style.display = 'none';
    document.getElementById('audioInput').style.display = 'none';
    document.getElementById('audioInput').className = 'fileHolder';
    document.getElementById('spinner').style.display = 'block';
    
    var form = new FormData();

    form.append('file', window.blob, (new Date()).getTime() + ".ogg");
    sendFile(form);
};

var onClickAudio = function(event) {
    document.getElementById('audioInput').style.display = 'none';

    document.getElementById('submit').disabled = true;

    document.getElementById('audioContainer').style.display = 'none';

    document.getElementById('audioControls').style.display = 'block';

    document.getElementById('fileInput').style.display = 'none';

    document.getElementById('message').innerText = 'Recording...';
    document.getElementById('message').style.display = 'block';

    var onSuccess = function(stream) {

        var recorder = new MediaRecorder(stream);
        var chunks = [];

        document.getElementById('stopBtn').onclick = function(e) {
            document.getElementById('audioControls').style.display = 'none';
            document.getElementById('message').style.display = 'none';
            document.getElementById('message').innerText = '';
            recorder.stop();
        };

        recorder.ondataavailable = function(e) {
            chunks.push(e.data);
        };

        recorder.onstop = function(e) {
            var blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
            chunks = [];
            var url = window.URL.createObjectURL(blob);

            window.blob = blob;

            document.getElementById('audioContainer').style.display = 'flex';
            document.getElementById('audioPreview').src = url;
            document.getElementById('audioButton').innerText = 'RERECORD';
            document.getElementById('audioInput').style.display = 'block';
            document.getElementById('audioInput').className = 'fileHolder retake';
            document.getElementById('submit').disabled = false;
            document.getElementById('upload').onsubmit = onUploadAudio;
        };

        recorder.start();
    }

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(onSuccess);
};

// alternate code for uploading audio when microphone doesn't work

var onSubmitAudioAlt = function(event) {
    document.getElementById('message').style.display = 'none';
    document.documentElement.style.background = '#0296e6';

    if (document.getElementById('audio').files.length > 0) {
        let reader = new FileReader();

        document.getElementById('audioContainer').style.display = 'flex';

        document.getElementById('submit').disabled = false;
        document.getElementById('upload').onsubmit = onUploadAudioAlt;

        document.getElementById('audioButton').innerText = 'RERECORD';
        document.getElementById('audioInput').className = 'fileHolder retake';

        document.getElementById('fileInput').style.display = 'none';

        reader.onload = function(ev) {
            document.getElementById('audioPreview').src = ev.target.result;
        }

        reader.readAsDataURL(document.getElementById('audio').files[0]);
    }
};

var onUploadAudioAlt = function(event) {
    event.preventDefault();

    document.documentElement.style.background = '#0296e6';
    document.getElementById('submit').disabled = true;
    document.getElementById('audioPreview').src = '';
    document.getElementById('audioContainer').style.display = 'none';
    document.getElementById('audioInput').style.display = 'none';
    document.getElementById('audioInput').className = 'fileHolder';
    document.getElementById('spinner').style.display = 'block';
    
    var form = new FormData();
    var files = document.getElementById('audio').files;

    form.append('file', files[0], files[0].name);
    sendFile(form);
};