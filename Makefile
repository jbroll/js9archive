

JS9   = ../js9
JS9JS = $(JS9)/plugins/archive

all: 	js9archive.js 

SOURCES = js9archive.jx			\
	  archive.js 			\
	  starbase.js 			\
	  subst.js          		\
	  remote-service.js 		\
	  image-service.js 		\
	  catalog-service.js  		\
	  image-services.js 		\
	  catalog-services.js

js9archive.js : $(SOURCES)
	browserify -r ./archive -r ./xhr > js9archive.js
	cat js9archive.jx >> js9archive.js

lint :
	jslint $(SOURCES)

install:
	@mkdir -p $(JS9JS)
	cp -p js9archive.html  $(JS9)/.
	cp -p js9archive.js    $(JS9JS)/.
	cp -p archive.html     $(JS9JS)/.

