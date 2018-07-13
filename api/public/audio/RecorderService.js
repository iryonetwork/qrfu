// Partially from https://github.com/kaliatech/web-audio-recording-tests
//
// MIT License
//
// Copyright (c) 2018 Josh Sanderson
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

class RecorderService {
    constructor() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        this.state = 'inactive';

        this.chunks = [];
        this.chunkType = '';

        this.encoderMimeType = 'audio/wav';

        this.config = {
            micGain: 1.0,
            processorBufferSize: 2048,
            userMediaConstraints: {audio: true}
        };
    }

    createWorker(fn) {
        var js = fn
            .toString()
            .replace(/^function\s*\(\)\s*{/, '')
            .replace(/}$/, '');
        var blob = new Blob([js]);
        return new Worker(URL.createObjectURL(blob));
    }

    startRecording() {
        if (this.state !== 'inactive') {
            return;
        }

        this.audioCtx = new AudioContext();
        this.micGainNode = this.audioCtx.createGain();
        this.outputGainNode = this.audioCtx.createGain();

        // If not using MediaRecorder(i.e. safari and edge), then a script processor is required.
        this.processorNode = this.audioCtx.createScriptProcessor(this.config.processorBufferSize, 1, 1);

        if (this.audioCtx.createMediaStreamDestination) {
            this.destinationNode = this.audioCtx.createMediaStreamDestination();
        }

        // Create web worker for doing the encoding
        this.encoderWorker = this.createWorker(EncoderWav);

        this.encoderWorker.addEventListener('message', (e) => {
            let event = new Event('dataavailable');

            event.data = new Blob(e.data, {type: this.encoderMimeType});
            
            this._onDataAvailable(event);
        })

        // This will prompt user for permission if needed
        return navigator.mediaDevices.getUserMedia(this.config.userMediaConstraints)
            .then((stream) => {
                this._startRecordingWithStream(stream);
                states.startRecording(recorderService.stopRecording.bind(recorderService));
            })
            .catch((error) => {
                console.error('Error with getUserMedia: ' + error.message);
                states.recordingError(error);
            });
    }

    _startRecordingWithStream(stream) {
        this.micAudioStream = stream;

        this.inputStreamNode = this.audioCtx.createMediaStreamSource(this.micAudioStream);
        this.audioCtx = this.inputStreamNode.context;

        this.inputStreamNode.connect(this.micGainNode);
        this.micGainNode.gain.setValueAtTime(this.config.micGain, this.audioCtx.currentTime);

        let nextNode = this.micGainNode;

        this.state = 'recording';

        nextNode.connect(this.processorNode);
        this.processorNode.connect(this.outputGainNode);
        this.processorNode.onaudioprocess = (e) => this._onAudioProcess(e);

        this.outputGainNode.connect(this.destinationNode);

        // Output gain to zero to prevent feedback. Seems to matter only on Edge,
        // though seems like should matter on iOS too.
        this.outputGainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
    }

    _onAudioProcess(e) {
        // Safari and Edge require manual encoding via web worker. Single channel only for now.
        // Example stereo encoderWav: https://github.com/MicrosoftEdge/Demos/blob/master/microphone/scripts/recorderworker.js
        if (this.state === 'recording') {
            this.encoderWorker.postMessage(['encode', e.inputBuffer.getChannelData(0)]);
        }
    }

    stopRecording() {
        if (this.state === 'inactive') {
            return;
        }

        this.state = 'inactive';
        this.encoderWorker.postMessage(['dump', this.audioCtx.sampleRate]);
        clearInterval(this.slicing);
    }

    _onDataAvailable(evt) {
        this.chunks.push(evt.data);
        this.chunkType = evt.data.type;

        if (this.state !== 'inactive') {
            return;
        }

        let blob = new Blob(this.chunks, {'type': this.chunkType});
        let blobUrl = URL.createObjectURL(blob);
        
        this.chunks = [];
        this.chunkType = null;

        if (this.destinationNode) {
            this.destinationNode.disconnect();
            this.destinationNode = null;
        }
        if (this.outputGainNode) {
            this.outputGainNode.disconnect();
            this.outputGainNode = null;
        }
        if (this.processorNode) {
            this.processorNode.disconnect();
            this.processorNode = null;
        }
        if (this.encoderWorker) {
            this.encoderWorker.postMessage(['close']);
            this.encoderWorker = null;
        }
        if (this.micGainNode) {
            this.micGainNode.disconnect();
            this.micGainNode = null;
        }
        if (this.inputStreamNode) {
            this.inputStreamNode.disconnect();
            this.inputStreamNode = null;
        }
        
        // This removes the red bar in iOS/Safari
        this.micAudioStream.getTracks().forEach((track) => track.stop());
        this.micAudioStream = null;

        this.audioCtx.close();
        this.audioCtx = null;

        // pass to global variable
        audioBlob = blob;
        audioUrl = blobUrl;

        states.onStopAudio();
    }
}
