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

    request.responseType = 'json';

    request.onload = function() {
        var json = request.response;
        
        if (request.status === 200) {
            document.getElementById('spinner').style.display = 'none';

            settings = json;

            setupButtons();
        } else {
            if (request.responseText === 'no id') {
                document.getElementById('message').innerText = 'Failed to connect to server, qr page is not connected.';
            } else {
                document.getElementById('message').innerText = 'Failed to connect to server, please try again.';
            }
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
    
var onSubmitImage = function(event) {
    document.getElementById('message').style.display = 'none';
    document.getElementById('spinner').style.display = 'none';
    document.documentElement.style.background = '#0296e6';

    if (cropper) {
        cropper.destroy();
    }

    var image = document.getElementById('preview');

    if (document.getElementById('file').files.length > 0) {
        document.getElementById('spinner').style.display = 'block';

        document.getElementById('submit').disabled = false;
        document.getElementById('upload').onsubmit = onUploadImage;

        document.getElementById('fileLabel').innerText = 'RETAKE';
        document.getElementById('fileInput').className = 'fileHolder retake';
        
        document.getElementById('imgContainer').style.display = 'flex';
        document.getElementById('imgContainer').style.opacity = 0;

        document.getElementById('audioInput').style.display = 'none';

        var reader = new FileReader();
        
        reader.onload = function(ev) {
            image.src = ev.target.result;

            // remove previous data and reset css
            image.exifdata = null;
            image.style.width = '';
            image.style.height = '';
            image.className = '';

            var configImage = function() {
                EXIF.getData(document.getElementById('preview'), function() {
                    document.getElementById('spinner').style.display = 'none';

                    var orientation = EXIF.getTag(this, 'Orientation');
                    var height = document.getElementById('imgContainer').clientHeight;
                    var width = window.innerWidth;
                    var imageHeight;
                    
                    if (orientation == 6) {
                        image.className = 'rotate90';
                        imageHeight = image.clientWidth;
                    } else if(orientation == 8) {
                        image.className = 'rotate270';
                        imageHeight = image.clientWidth;
                    } else if(orientation == 3) {
                        image.className = 'rotate180';
                    }

                    // rotated images need to be resized to fit screen
                    if (imageHeight) {
                        if (imageHeight > height) {
                            image.style.maxWidth = height + 'px';
                        }
                        if (image.clientHeight >= width) {
                            image.style.maxHeight = (width - 20) + 'px';
                        }
                    } else {
                        if (image.clientHeight > height) {
                            image.style.maxHeight = height + 'px';
                        }
                        if (image.clientWidth >= width) {
                            image.style.maxWidth = (width - 20) + 'px';
                        }
                    }

                    let cropperArgs = {
                        initialAspectRatio: NaN,
                        viewMode: 2,
                        ready: function(event) {
                            document.getElementById('imgContainer').style.opacity = 1;
                        }
                    };

                    if (settings.ratio) {
                        cropperArgs.aspectRatio = settings.ratio;
                    }

                    cropper = new Cropper(image, cropperArgs);
                });

                // only run the listener once
                this.removeEventListener('load', arguments.callee);
            }

            image.addEventListener('load', configImage);
        };

        reader.readAsDataURL(document.getElementById('file').files[0]);
    } else {
        document.getElementById('submit').disabled = true;
        document.getElementById('fileLabel').innerText = 'TAKE PHOTO';

        document.getElementById('imgContainer').style.display = 'none';
    }
};

var onUploadImage = function(event) {
    event.preventDefault();

    document.documentElement.style.background = '#0296e6';
    document.getElementById('submit').disabled = true;
    document.getElementById('preview').src = '#';
    document.getElementById('imgContainer').style.display = 'none';
    document.getElementById('fileInput').style.display = 'none';
    document.getElementById('fileInput').className = 'fileHolder';
    document.getElementById('spinner').style.display = 'block';
    
    var form = new FormData();
    var files = document.getElementById('file').files;

    if (cropper) {
        cropper.getCroppedCanvas({
            maxWidth: 1000,
            maxHeight: 1000
        }).toBlob(
            function(blob) {
                form.append('file', blob, files[0].name);
                cropper.destroy(); // remove cropper
                sendImage(form);
            },
            'image/jpeg',
            0.95
        );
    } else {
        form.append('file', files[0], files[0].name);
        sendImage(form);
    }
};

var sendImage = function(form) {
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
        document.getElementById('audioLabel').innerText = 'RECORD AUDIO';
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
    sendImage(form);
};

document.addEventListener('DOMContentLoaded', function(e) {
    document.getElementById('file').onchange = onSubmitImage;
    document.getElementById('audio').onchange = onSubmitAudio;

    setup();
});