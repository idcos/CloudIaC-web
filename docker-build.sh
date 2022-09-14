rm ./conf/iac-web.tar
npm run build
cd build/ && tar cpf ../conf/iac-web.tar ./*
cd ../conf
pwd
docker build -t cloudiac/iac-web:1.2.0 . --platform linux/amd64
docker push cloudiac/iac-web:1.2.0
rm ./iac-web.tar
