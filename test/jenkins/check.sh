#!/bin/bash

name=$1

[ "$JENKINS_URL" == "" ] && echo "Missing JEKINS_URL var" && exit 1;
[ "$name" == "" ] && echo "Missing name arg" && exit 1;


url="$JENKINS_URL/createItem?name=$name"

echo "Post to $url"
echo curl -X POST -H 'Content-Type: application/xml' $url --data-binary @test/fixtures/test.xml
curl -X POST -H 'Content-Type: application/xml' $url --data-binary @test/fixtures/test.xml
