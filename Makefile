all: build
build:
		docker build -t cloudiac/iac-web:v0.7.0 .
push:
		docker push cloudiac/iac-web:v0.7.0
