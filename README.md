# Slim VLC Web Audio Player for Raspberry Pi

After setting up a [PiMoRoNi PhatBeat](https://shop.pimoroni.com/products/phat-beat) to stream internet radio via VLC audio, I discovered that VLC apparently hasn't updated their web player since 1996.   It is a mish-mash of tiny icons and features that don't apply on a headless Raspberry Pi.

___

The code in this repository removes unused features, improves the user experience.   It also adds support for showing the actual song being played.

![alt text](https://github.com/eat-sleep-code/vlc-slim-web/blob/master/screenshot.png)
___

## Implementation

* Connect to your Raspberry Pi via SSH.
* Execute the following commands:
  * `cd /usr/share/vlc/lua/http/`
  * `sudo ls | grep -v requests | parallel rm -rf`
  * `sudo git clone https://github.com/eat-sleep-code/vlc-slim-web`
  * `sudo reboot`
* After the Raspberry Pi reboots, access http://[YOURIP]:8080 
  * If prompted for authentication, leave the username field blank.   The default password is `raspberry`
___

## Support for extended M3U files
For the best user experience, update your playlist to use the extended M3U format.   You can edit your playlist with `sudo nano /home/pi/.config/vlc/playlist.m3u`

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
