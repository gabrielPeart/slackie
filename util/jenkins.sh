#!/bin/bash

npm prune && npm install --no-optional;
grunt clean:all && mkdir release && chmod +x util/*/**.sh;

util/win32.sh
