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

            image.addEventListener('load', function() {
                EXIF.getData(document.getElementById('preview'), exifCallback.bind(this, image));
                // only run the listener once
                this.removeEventListener('load', arguments.callee);
            });
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
                sendFile(form);
            },
            'image/jpeg',
            0.95
        );
    } else {
        form.append('file', files[0], files[0].name);
        sendFile(form);
    }
};

var exifCallback = function(image) {
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
};