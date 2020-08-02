#!/bin/bash

cat ./css/master.css ./css/normalize.css ./css/skeleton.css | tr -s " " | tr -d "\t\n\r" > ./css/bundle.min.css