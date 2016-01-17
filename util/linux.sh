#!/bin/bash

grunt release --arch=x64 --platform=linux && grunt deb_package --arch=x64
grunt release --arch=ia32 --platform=linux 
