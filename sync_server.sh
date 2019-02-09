#!/bin/sh
SSH_AUTH_SOCK=${SSH_AUTH_SOCK:/tmp/$USER.sock}
#PWD=$(pwd)
#SRCDIR=$PWD/build/
SRCDIR=/home/nathaniel/src/git/mefoamsoap/react-data-table/build/
DEPLOYDIR=/usr/share/nginx/ebay.ewb.ai/

#if [ "`hostname`" == "mx.ewb.ai" ]; then
#  rsync -avz -e ssh $SRCDIR publish@mx.ewb.ai:$DEPLOYDIR
#else
  rsync -az -vv -e ssh --exclude '.*.sw[a-p]'  $SRCDIR publish@mx.ewb.ai:$DEPLOYDIR | tee /tmp/publish.ramborghini.com.log

#fi
