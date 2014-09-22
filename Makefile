

JS9   = ../js9
JS9JS = $(JS9)/plugins/archive

all: 	archive.js 

SOURCES = archive.jx 			\
	  starbase.js 			\
	  strtod.js          		\
	  template.js          		\
	  xhr.js          		\
	  remote-service.js 		\
	  image-service.js 		\
	  catalog-service.js  		\
	  image-services.js 		\
	  catalog-services.js

archive.js : $(SOURCES)
	browserify ./archive.jx  > archive.js
	echo "" >> archive.js

lint :
	jslint $(SOURCES)

install:
	@mkdir -p $(JS9JS)
	cp -p js9archive.html	$(JS9)/.
	cp -p archive.js	$(JS9JS)/.
	cp -p archive.html	$(JS9JS)/.
	cp -p README		$(JS9JS)/.

distclean:
	rm archive.js
