all: build
build:
		docker build -t cloudiac/iac-web:v0.6.0-rc.5 .
push:
		docker push cloudiac/iac-web:v0.6.0-rc.5
