JSHINT = ./node_modules/.bin/jshint
TAP = ./node_modules/.bin/tap

lint:
	jshint ./lib/*.js

unit:
	tap ./test/unit/*.js --stderr

test:lint unit

.PHONY: lint unit test
