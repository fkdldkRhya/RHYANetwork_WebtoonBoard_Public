@echo off
echo RHYA.Network Webtoon board management server package list write script
echo.

call conda activate webtoon-board-management-server

call conda env export > environment.yml

exit