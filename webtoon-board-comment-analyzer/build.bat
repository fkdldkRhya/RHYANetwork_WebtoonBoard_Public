@echo off

call conda activate webtoon-board-comment-analyzer

rmdir build

md build

call conda env export > build\environment.yml

copy app.py build\app.py
copy config.yaml build\config.yaml
xcopy src build\src /E /D

cd build

cls

python app.py