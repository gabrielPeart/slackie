#!/bin/bash

npm prune && npm install --no-optional;
grunt clean:all;
mmkdir release && chmod -R 755 util;

util/linux.sh
util/win32.sh
