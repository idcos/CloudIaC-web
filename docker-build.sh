rm ./conf/iac-web.tar
npm run build
cd build/ && tar cpf ../conf/iac-web.tar ./*
cd ../conf
pwd
docker build -t cloudiac/iac-web:1.3.0 . --platform linux/amd64
docker push cloudiac/iac-web:1.3.0
docker tag cloudiac/iac-web:1.3.0 cloudiac/iac-web:latest
docker push cloudiac/iac-web:latest
rm ./iac-web.tar
