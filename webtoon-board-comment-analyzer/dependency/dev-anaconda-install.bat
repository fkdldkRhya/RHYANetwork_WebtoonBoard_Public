@echo off
echo RHYA.Network Webtoon board comment analyzer package install script
echo.

call conda activate webtoon-board-comment-analyzer

conda env update --file environment.yml