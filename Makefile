STAGE?=dev
IMAGE?=$(shell basename `pwd`)
TAG?=latest
DOCKER_REGISTRY?=registry.hub.docker.com

echo:
	@echo "TAG = $(TAG)"
	@echo "STAGE = $(STAGE)"
	@echo "IMAGE = $(IMAGE)"
	@echo "DOCKER_REGISTRY = $(DOCKER_REGISTRY)"

build:
	docker build -t $(STAGE)/$(IMAGE) .

push:
	docker tag $(STAGE)/$(IMAGE):$(TAG) $(DOCKER_REGISTRY)/$(STAGE)/$(IMAGE):$(TAG)
	docker push $(DOCKER_REGISTRY)/$(STAGE)/$(IMAGE):$(TAG)
