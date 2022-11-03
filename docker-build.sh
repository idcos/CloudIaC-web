rm ./conf/iac-web.tar
npm run build
cd build/ && tar cpf ../conf/iac-web.tar ./*
cd ../conf
pwd
docker build -t cloudiac/iac-web:1.2.4 . --platform linux/amd64
docker push cloudiac/iac-web:1.2.4
rm ./iac-web.tar
