@echo off
echo RHYA.Network Webtoon board management server run script
echo.

call conda activate webtoon-board-management-server

python -m flask run

exit