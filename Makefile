all: build
build:
		docker build -t cloudiac/iac-web:v0.7.1-rc.1 .
push:
		docker push cloudiac/iac-web:v0.7.1-rc.1
