var onSubmitAudio = function(event) {
    document.getElementById('message').style.display = 'none';
    document.documentElement.style.background = '#0296e6';

    if (document.getElementById('audio').files.length > 0) {
        let reader = new FileReader();

        document.getElementById('audioContainer').style.display = 'flex';

        document.getElementById('submit').disabled = false;
        document.getElementById('upload').onsubmit = onUploadAudio;

        document.getElementById('audioLabel').innerText = 'RERECORD';
        document.getElementById('audioInput').className = 'fileHolder retake';

        document.getElementById('fileInput').style.display = 'none';

        reader.onload = function(ev) {
            document.getElementById('audioPreview').src = ev.target.result;
        }

        reader.readAsDataURL(document.getElementById('audio').files[0]);
    }
};

var onUploadAudio = function(event) {
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