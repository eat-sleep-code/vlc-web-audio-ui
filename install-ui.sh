# This script will install a new VLC Web Audio UI.
cd ~
echo -e ''
echo -e '\033[32mVLC Web Audio UI [Installation Script] \033[0m'
echo -e '\033[32m-------------------------------------------------------------------------- \033[0m'
echo -e ''
echo -e '\033[93mUpdating package repositories... \033[0m'
sudo apt update

echo ''
echo -e '\033[93mInstalling Pimoroni pHAT BEAT and the VLC Radio project... \033[0m'
curl https://get.pimoroni.com/vlcradio | bash
cd Pimoroni/phatbeat/projects/vlc-radio
wget https://raw.githubusercontent.com/pimoroni/phat-beat/master/projects/vlc-radio/setup.sh -O setup.sh
./setup.sh

echo ''
echo -e '\033[93mInstalling new UI... \033[0m'
sudo mkdir .config/vlc
sudo apt-get install parallel
cd /usr/share/vlc/lua/http/
sudo ls | grep -v requests | sudo parallel rm -rf
sudo git clone https://github.com/eat-sleep-code/vlc-slim-web
sudo mv vlc-slim-web/* .

echo ''
echo -e '\033[93mCleaning up... \033[0m'
sudo rm -rf vlc-slim-web

echo ''
echo -e '\033[32m-------------------------------------------------------------------------- \033[0m'
echo -e '\033[32mInstallation completed.  \033[0m'
echo ''
echo -e '\033[32mRebooting in 10 seconds... \033[0m'

# After the Raspberry Pi reboots, access http://[YOURIP]:8080 
# If prompted for authentication, leave the username field blank.   The default password is `raspberry`
read -t 10
sudo reboot