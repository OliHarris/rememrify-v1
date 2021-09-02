# rememrify
The Spotify UK Charts Archive generator

A successful personal project that was created to prove I could build an innovative solution from scratch.

I then went on to study and wrap a Grunt workflow around the project, which concatonates the scripts.

More playing with API's, this time from the UK Charts Archive Wikia:

http://uk-charts-archive.wikia.com/

Lots of great functional ideas stemmed from this project (generated from showing to people); these can be researched and written up, and requires getting to grips with Spotify API in due time...

Sometimes anomalies are returned - the code can be tuned further to take care of these.

## Available Scripts

In the project directory you can run:

### `npm install`

Will perform a usual installation of any dependencies.

### `grunt`

Make sure you have already run 'npm install -g grunt-cli' to globally install the Grunt CLI.

Will perform 'concat' and 'sass' tasks to format output in 'builds/development' folder.

Will perform 'connect' and 'watch' tasks for development on http://localhost:3000.

## NOTE 1:

My code will need to POST the 'spotify-connect.php' file, found in the ./builds/development folder. This will need to include your own personal Spotify 'client_id' and 'client_secret' keys.

This file is based on:

https://gist.github.com/ahallora/4aac6d048742d5de0e65

## NOTE 2:

Github pages currently do not support PHP as it only supports static websites, hence the link located at:

http://rememrify.byethost4.com