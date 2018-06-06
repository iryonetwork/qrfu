document.addEventListener("DOMContentLoaded", function(e) {
    document.getElementById('file').onchange = function(event) {
        document.getElementById('message').style.display = "none";
        document.documentElement.style.background = "#0296e6";

        var image = document.getElementById('preview');

        if (document.getElementById('file').files.length > 0) {
            document.getElementById('submit').disabled = false;
            document.getElementById('fileLabel').innerText = 'RETAKE';
            document.getElementById('fileInput').className = 'retake';
            document.getElementById('imgContainer').style.display = "flex";
            document.getElementById('imgContainer').style.opacity = 0;

            var reader = new FileReader();
            
            reader.onload = function(ev) {
                image.src = ev.target.result;

                // remove previous data and reset css
                image.exifdata = null;
                image.style.width = "";
                image.style.height = "";
                image.className = "";

                var configImage = function() {
                    EXIF.getData(document.getElementById('preview'), function() {
                        var orientation = EXIF.getTag(this, 'Orientation');
                        var height = document.getElementById('imgContainer').clientHeight;
                        var width = window.innerWidth;
                        var imageHeight;
                        
                        if (orientation == 6) {
                            image.className = "rotate90";
                            imageHeight = image.clientWidth;
                        } else if(orientation == 8) {
                            image.className = "rotate270";
                            imageHeight = image.clientWidth;
                        } else if(orientation == 3) {
                            image.className = "rotate180";
                        }

                        // rotated images need to be resized to fit screen
                        if (imageHeight) {
                            if (imageHeight > height) {
                                image.style.maxWidth = height + "px";
                            }
                            if (image.clientHeight >= width) {
                                image.style.maxHeight = (width - 20) + "px";
                            }
                        } else {
                            if (image.clientHeight > height) {
                                image.style.maxHeight = height + "px";
                            }
                            if (image.clientWidth >= width) {
                                image.style.maxWidth = (width - 20) + "px";
                            }
                        }

                        document.getElementById('imgContainer').style.opacity = 1;
                    });
                }

                image.addEventListener("load", configImage);
            };

            reader.readAsDataURL(document.getElementById('file').files[0]);
        } else {
            document.getElementById('submit').disabled = true;
            document.getElementById('fileLabel').innerText = "TAKE PHOTO";

            document.getElementById('imgContainer').style.display = "none";
        }
    };

    document.getElementById('upload').onsubmit = function(event) {
        event.preventDefault();

        document.documentElement.style.background = "#0296e6";
        document.getElementById('submit').disabled = true;
        document.getElementById('preview').src = "#";
        document.getElementById('imgContainer').style.display = 'none';
        document.getElementById('fileInput').style.display = 'none';
        document.getElementById('fileInput').className = '';
        document.getElementById('message').innerHTML = '<img src="/loading.gif" alt="loading">';
        document.getElementById('message').style.display = "block";
        
        var url = window.location.href.split("/");
        var uid = url[url.length - 1];
        var request = new XMLHttpRequest();
        var form = new FormData();
        var files = document.getElementById('file').files;

        form.append('file', files[0], files[0].name);

        request.onreadystatechange = function() {
            if (request.status === 0) {
                return; // invalid state
            }

            document.getElementById('message').innerHTML = "";
            document.getElementById('message').style.display = "block";
            document.getElementById('fileLabel').innerText = "TAKE PHOTO";
            document.getElementById('fileInput').style.display = 'block';
            document.getElementById('upload').reset();
            
            if (request.status === 200) {
                document.documentElement.style.background = "#45d957";
                document.getElementById('message').innerText = "Successful";
            } else {
                document.documentElement.style.background = "#0296e6";

                if (request.responseText === "no id") {
                    document.getElementById('message').innerText = "Failed to upload, qr page is not connected.";
                } else {
                    document.getElementById('message').innerText = "Failed to upload, please try again.";
                }
            }
        };
        
        request.open('POST', '/api/upload/' + uid, true);
        request.send(form);
    };
});