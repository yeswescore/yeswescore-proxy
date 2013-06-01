#!/bin/sh

BASEDIR=$(dirname $0)
cd $BASEDIR;

# are we in dev or in prod.
if [ "$NODE_ENV" = "PROD" ]
then
  echo "you are in prod environment, you cannot launch the server using ./dev.sh"
  exit 1
fi

export NODE_ENV="DEV"
if [ -f ".port" ]
then
  proxyport=`cat .port | head -1`
  apiport=`cat ../../yeswescore-server/server/.port`
  fbport=`cat ../../yeswescore-facebook/server/.port`
  wwwport=`cat ../../yeswescore-www/server/.port`
  echo ""
  echo "using port number $proxyport from file .port for proxy"
  echo "using port number $apiport from file .port for api"
  echo "using port number $fbport from file .port for fb"
  echo "using port number $wwwport from file .port for www"
  export YESWESCORE_PORT=$apiport
  export YESWESCORE_FACEBOOK_PORT=$fbport
  export YESWESCORE_WWW_PORT=$wwwport
  export YESWESCORE_PROXY_PORT=$proxyport
  if [ "$1" = "debug" ]
  then
    echo "debug mode activated"
    echo " please launch 'node-inspector' to debug."
    node --debug server.js
  else
    echo "to debug, use> ./dev.sh debug"
    node server.js
  fi
else
  echo "  Please create .port file containing port number "
  echo "  Exemple:  echo \"15123\" > .port "
fi