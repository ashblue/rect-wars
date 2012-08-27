# Setup

## Run requirements

* NodeJS 0.8 installer http://nodejs.org/ or Cloud9 IDE http://c9.io with NodeJS

## Configuring the setup file

To activate your copy of the game you must create a setup file. The setup file must be manually created to prevent overwriting other devleoper's environments.

1. Make of copy of js/setup.diff in the exact same folder
2. Rename the copy setup.js
3. Add your own custom setup.js code
4. In a command prompt type "node server.js" from the root (if you don't have NodeJS, this step will fail)
5. Make sure to leave the command line running, as stopping it will shut down your server's ability to serve files
6. Go to http://127.0.0.1:8080 in Google Chrome and the game should run