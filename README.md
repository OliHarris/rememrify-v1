# rememrify
The Spotify UK Charts Archive generator

NOTE:

My code will POST to a secret 'spotify-connect.php' file, which I will document more in due time. This would include your Spotify 'client_id' and 'client_secret'.

Github pages currently do not support PHP as it only supports static websites, hence the link located at:

https://OliHarris.github.io/rememrify/builds/development

Is not completely functional - will look at best way around this ASAP.

## Available Scripts

In the project directory, you can run:

### `npm install`

This perform a usual installation of any dependencies.

### `grunt`

Make sure you have already run 'npm install -g grunt-cli'.
Will perform 'concat' and 'sass' tasks to format output in 'builds/development' folder.
Will perform 'connect' and 'watch' tasks for development on http://localhost:3000.