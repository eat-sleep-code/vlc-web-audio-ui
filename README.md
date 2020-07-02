# VLC Web Audio Player for Raspberry Pi (including Buster!)

After setting up a [PiMoRoNi PhatBeat](https://shop.pimoroni.com/products/phat-beat) to stream internet radio via VLC audio, I discovered that VLC apparently hasn't updated their web player since 1996.   It is a mish-mash of tiny icons and features that don't apply on a headless Raspberry Pi.

___

The code in this repository removes unused features, improves the user experience.   It also adds support for showing the actual song being played.

![alt text](https://github.com/eat-sleep-code/vlc-web-audio-ui/blob/master/screenshot.png?raw=true)
___

## Implementation

* Connect to your Raspberry Pi via SSH.
* Install Pimoroni Phat Beat and the VLC Radio project by executing:
  * `curl https://get.pimoroni.com/vlcradio | bash`
* If you are using the Buster - or later - release of Raspberry Pi OS (formerly Raspbian) execute the following commands:
  * `cd Pimoroni/phatbeat/projects/vlc-radio`
  * `wget https://raw.githubusercontent.com/pimoroni/phat-beat/master/projects/vlc-radio/setup.sh -O setup.sh`
  * `./setup.sh`
* Execute the following commands:
  * `sudo mkdir .config\vlc`
  * `sudo apt-get install parallel`
  * `cd /usr/share/vlc/lua/http/`
  * `sudo ls | grep -v requests | sudo parallel rm -rf`
  * `sudo git clone https://github.com/eat-sleep-code/vlc-slim-web`
  * `sudo mv vlc-slim-web/* .`
  * `sudo rm -rf vlc-slim-web`
  * `sudo reboot`
* After the Raspberry Pi reboots, access http://[YOURIP]:8080 
  * If prompted for authentication, leave the username field blank.   The default password is `raspberry`
___

## Support for extended M3U files
For the best user experience, update your playlist to use the extended M3U format.   You can edit your playlist with `sudo nano /home/pi/.config/vlc/playlist.m3u`   You will need to reboot your Raspberry Pi after making changes to the playlist.

The following is an example of the extended M3U file format:
```
#EXTM3U

#EXTINF:-1, Country Roads
http://rfcmedia.streamguys1.com/countryroads.mp3?aw_0_1st.playerid=RadioTime

#EXTINF:-1, Smooth Jazz
http://rfcmedia.streamguys1.com/smoothjazz.mp3?aw_0_1st.playerid=RadioTime

#EXTINF:-1, Today's Hits
http://rfcmedia.streamguys1.com/MusicPulse.mp3?aw_0_1st.playerid=RadioTime
```
