#!/bin/bash

while true; do
    node /outside/node_modules/.bin/docusaurus start --host=0.0.0.0 --port=3000
    node /outside/node_modules/.bin/docusaurus clear
done
