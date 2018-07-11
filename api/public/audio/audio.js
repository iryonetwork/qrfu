var audioBlob, recorderService;

var isSafari = function() {
    return window.safari ||
        (navigator.userAgent.match(/iP(od|hone|ad)/) &&
        navigator.userAgent.match(/AppleWebKit/) &&
        !navigator.userAgent.match(/(Cr|Fx|OP)iOS/));
}

// audio setup - check if using default, safari, or alternate audio
//   default and safari audio use the same interface but have different code
//   alternate audio is a normal file upload button, used when audio recording isn't supported
var setupAudio = function() {
    return new Promise((resolve, reject) => {
        var hasUserMedia = navigator && navigator.mediaDevices
                                     && navigator.mediaDevices.getUserMedia;

        if (isSafari() && hasUserMedia) {
            setSafariAudio();
            resolve();
        } else if (hasUserMedia
                && navigator.mediaDevices.enumerateDevices
                && typeof MediaRecorder !== "undefined") {
            
            navigator.mediaDevices.enumerateDevices()
                .then(devices => {
                    var hasMic = devices.filter(d => d.kind === 'audioinput').length > 0;

                    if (hasMic) {
                        document.getElementById('audioButton').onclick = onClickAudio;
                    } else {
                        setAltAudio();
                    }

                    resolve();
                })
                .catch(err => {
                    setAltAudio();
                    resolve();
                });
        } else {
            setAltAudio();
            resolve();
        }
    });
};

var setSafariAudio = function() {
    recorderService = new RecorderService();

    document.getElementById('audioButton').onclick = function() {
        recorderService.startRecording();
    };
}

var setAltAudio = function() {
    var el = document.getElementById('audioInput');
    el.parentNode.removeChild(el);

    document.getElementById('audioInputAlt').id = 'audioInput';
    document.getElementById('audioButtonAlt').id = 'audioButton';

    setupButtons();

    document.getElementById('audio').onchange = onSubmitAudioAlt;
}

// default audio code

var onUploadAudio = function(event) {
    event.preventDefault();

    document.documentElement.style.background = '#0296e6';
    document.getElementById('submit').disabled = true;
    document.getElementById('audioContainer').style.display = 'none';
    document.getElementById('audioInput').style.display = 'none';
    document.getElementById('audioInput').className = 'fileHolder';

    if (audioBlob) {
        document.getElementById('spinner').style.display = 'block';
    } else {
        document.getElementById('message').innerText = 'Failed to upload, please try again.';
        document.getElementById('message').style.display = 'block';
    }

    var data = document.getElementById('audioPreview').src;
    document.getElementById('audioPreview').src = '';
    
    var form = new FormData();

    var name = (new Date()).getTime();

    if (audioBlob.type.includes('audio/ogg')) {
        name += '.ogg';
    } else {
        name += '.wav';
    }

    form.append('file', audioBlob, name);
    sendFile(form);

    audioBlob = null;
};

var onClickAudio = function(event) {
    var onSuccess = function(stream) {
        var recorder = new MediaRecorder(stream);
        var chunks = [];
        
        states.startRecording(recorder.stop.bind(recorder));

        recorder.ondataavailable = function(e) {
            chunks.push(e.data);
        };

        recorder.onstop = function(e) {
            var blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
            var url = window.URL.createObjectURL(blob);
            chunks = [];

            audioBlob = blob;

            states.stopRecording(url);

            stream.getTracks().forEach(track => track.stop()); // turn off mic
        };

        recorder.start();
    }

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(onSuccess)
        .catch((err) => states.recordingError(err));
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

        document.getElementById('audioButton').innerText = 'RETAKE';
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

var states = {
    goBack: false,
    startRecording: (onStop) => {
        document.documentElement.style.background = '#000';
        document.getElementById('audioInput').style.display = 'none';

        // document.getElementById('audioInputAlt').style.display = 'block';
        // document.getElementById('audioInputAlt').className = 'fileHolder retake';
    
        document.getElementById('submit').disabled = true;
    
        document.getElementById('audioContainer').style.display = 'none';
    
        document.getElementById('audioControls').style.display = 'flex';
    
        document.getElementById('fileInput').style.display = 'none';
    
        document.getElementById('timer').innerText = '0:00';
        document.getElementById('timer').style.display = 'block';

        document.getElementById('title').innerText = 'Voice Recorder';

        document.getElementById('message').style.display = 'none';
        document.getElementById('message').innerText = '';

        document.getElementsByClassName('circle')[0].style.animationName = '';
        document.getElementsByClassName('circle')[0].style.webkitAnimationName = '';
        
        var count = 0;
        var timer = window.setInterval(() => {
            count++;
            
            var min = Math.floor(count / 60);
            var sec = count - (min * 60);

            if (sec < 10) {
                sec = "0" + sec;
            }

            document.getElementById('timer').innerText = `${min}:${sec}`;
        }, 1000);

        document.getElementById('stopButton').onclick = function(e) {
            document.getElementsByClassName('circle')[0].style.animationName = 'expand';
            document.getElementsByClassName('circle')[0].style.webkitAnimationName = 'expand';

            document.getElementById('finishButton').style.display = 'block';

            window.clearInterval(timer);
        };

        document.getElementById('finishButton').onclick = function(e) {
            document.getElementById('timer').style.display = 'none';
            document.getElementById('finishButton').style.display = 'none';
            document.getElementById('audioControls').style.display = 'none';

            states.goBack = false;

            onStop();
        };

        document.getElementById('backButton').onclick = function(e) {
            document.documentElement.style.background = '#0296e6';
            document.getElementById('title').innerText = 'Upload Document';
            document.getElementById('audioControls').style.display = 'none';
            document.getElementById('finishButton').style.display = 'none';

            document.getElementById('audioInput').style.display = 'block';
            document.getElementById('audioInput').className = 'fileHolder';
            document.getElementById('audioButton').innerText = 'RECORD AUDIO';

            document.getElementById('timer').style.display = 'none';
            window.clearInterval(timer);

            states.goBack = true;
            
            onStop();
        };
    },
    stopRecording: (url) => {
        if (states.goBack) {
            audioBlob = null;
            return;
        }

        document.documentElement.style.background = '#0296e6';
        document.getElementById('title').innerText = 'Upload Voice Recording';
        document.getElementById('audioContainer').style.display = 'flex';
        document.getElementById('audioPreview').src = url;
        document.getElementById('audioButton').innerText = 'RETAKE';
        document.getElementById('audioInput').style.display = 'block';
        document.getElementById('audioInput').className = 'fileHolder retake';
        document.getElementById('submit').disabled = false;
        document.getElementById('upload').onsubmit = onUploadAudio;
    },
    recordingError: (err) => {
        alert('Recording not supported, switching to file selection.');
        setAltAudio();
    },
}