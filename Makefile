all: build
build:
		docker build -t cloudiac/iac-web:v0.9.2 .
push:
		docker push cloudiac/iac-web:v0.9.2
