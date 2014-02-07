

JS9   = ../js9
JS9JS = $(JS9)/plugins/archive

all: 	$(JS9)/js9archive.html		\
	$(JS9JS)/js9archive.js 

$(JS9)/js9archive.html: js9archive.html
	cp -p js9archive.html $(JS9)/js9archive.html

$(JS9JS)/js9archive.js : js9archive.js archive.js starbase.js subst.js		\
			 remote-service.js image-service.js catalog-service.js	\
			 image-services.js catalog-services.js
	@mkdir -p $(JS9JS)
	browserify -r ./archive > $(JS9JS)/js9archive.js
	cat js9archive.js >> $(JS9JS)/js9archive.js

