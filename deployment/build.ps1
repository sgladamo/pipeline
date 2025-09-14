Set-Location ../SHIELD 
docker build -f ./SA.Shield.Api/Dockerfile -t shield:latest .
Set-Location ../F12 
docker build -t f12:latest .

Set-Location ../Deployment/Images
docker save shield:latest --output shield.tar.gz
docker save f12:latest --output f12.tar.gz

scp * sarah@172.16.10.43:/home/sarah/SRT/Images/.