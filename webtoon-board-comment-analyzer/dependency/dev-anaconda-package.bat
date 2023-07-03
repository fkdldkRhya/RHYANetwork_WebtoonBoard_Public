@echo off
echo RHYA.Network Webtoon board comment analyzer package list write script
echo.

call conda activate webtoon-board-comment-analyzer

call conda env export > environment.yml

exit