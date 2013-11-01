#!/bin/sh
#
export PATH=/home/john/bin:$PATH

if [ "$HTTP_HOST" != "" ] ; then
    echo "Access-Control-Allow-Origin: *"
    echo "Content-Type: text/plain"
    echo ""
fi

wget -O- -q "http://ned.ipac.caltech.edu/cgi-bin/objsearch?objname=$1&extend=no&out_csys=Equatorial&out_equinox=J2000.0&of=ascii_tab&list_limit=1"	\
| tail -1 | fldtotable -ifs "	" ra:3 dec:4 | compute "ra=d2h(ra); dec+=0:00:00" | headoff

