# qrfu

Upload files from another device using a QR code.
The react component creates the QR code that is used to connect to the server.
The server hosts the file uploading website and has an api that the component and the upload websites use.

The server is on [docker hub](https://hub.docker.com/r/iryo/qrfu-api/) and the component is on [npm](https://www.npmjs.com/package/@iryo/react-qrfu).

## Run the demo

Install libraries by running `npm install` in both the api and component folders.

Create a .env file in component with the environment variable REACT\_APP\_QR\_URL set to the server's url (ex: REACT\_APP\_QR\_URL=https://127.0.0.1:3001).

Start the api server by running `npm start` in the api folder.

Start the QR code server by running `npm start` in the component folder.

Scan a QR code on the QR code demo webpage and go to the link in the QR code in order to upload files (must be on same network as the api server).

## Run the server

The server handles file uploads, communicates with the Upload component, and hosts the file upload webpage.

Run the latest version of the server from docker hub.

```
$ docker run -p 3001:3001 iryo/qrfu-api:latest
```

## Use the Upload component

The Upload react component displays uploaded files and provides a QR code that is a link to the file upload webpage.

```
$ npm install @iryo/react-qrfu --save
```

In your project, include a .env file with the environment variable REACT\_APP\_QR\_URL set to the server's url.

Add the component:

```
<Upload ratio={0} filetype='all' multiple={true} uploadlist={ListComponent} />
```

Props of Upload component:
- ratio can be any number, if it is 0 then the app will allow any ratio (only applies to images)
- filetype can be image, audio, or all
- multiple is a boolean, if true the user can upload as many files as they want, if false each upload will overwrite any previous files
- uploadList is a component that displays uploaded files and optionally provides a way to delete them
- socket is an object with the correct methods to access the server websocket (optional, there is a default implementation)
- onChange is a callback that is sent the uploads list every time the list changes (optional)

The upload list component must be implemented and passed into the Upload component. There are examples in the component folder (src/UploadList.js).

Props of upload list component:
- uploads is a list of uploaded files with the properties name, url, uid, and type
- delete is a function, call it with a file's name to delete the file (optional)
