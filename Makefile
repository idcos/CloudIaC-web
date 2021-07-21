all: build
build:
		docker build -t cloudiac/iac-web:latest .
