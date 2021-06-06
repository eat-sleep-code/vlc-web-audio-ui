# This script will install a new VLC Web Audio UI.
cd ~
echo -e ''
echo -e '\033[32mVLC Web Audio UI [Prerequisites Installation Script] \033[0m'
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

