

JS9   = ../js9
JS9JS = $(JS9)/js/archive

all: 	$(JS9)/js9archive.html		\
	$(JS9JS)/archive.js 		\
	$(JS9JS)/image-services.js 	\
	$(JS9JS)/catalog-services.js	\
	$(JS9JS)/subst.js		\
	$(JS9JS)/starbase.js

$(JS9)/js9archive.html: js9archive.html
	cp -p js9archive.html $(JS9)/js9archive.html

$(JS9JS)/archive.js : archive.js
	mkdir -p $(JS9JS)
	cp -p archive.js $(JS9JS)/archive.js

$(JS9JS)/image-services.js : image-services.js
	mkdir -p $(JS9JS)
	cp -p image-services.js $(JS9JS)/image-services.js

$(JS9JS)/catalog-services.js : catalog-services.js
	mkdir -p $(JS9JS)
	cp -p catalog-services.js $(JS9JS)/catalog-services.js

$(JS9JS)/subst.js : subst.js
	mkdir -p $(JS9JS)
	cp -p subst.js $(JS9JS)/subst.js

$(JS9JS)/starbase.js : starbase.js
	mkdir -p $(JS9JS)
	cp -p starbase.js $(JS9JS)/starbase.js
