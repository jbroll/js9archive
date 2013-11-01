#!/bin/sh
#

wget -O- -q "http://ned.ipac.caltech.edu/cgi-bin/objsearch?objname=$1&extend=no&out_csys=Equatorial&out_equinox=J2000.0&of=ascii_tab&list_limit=1"	\
| gawk -v FS="	" '{ print $3, $4 }' | tail -1

