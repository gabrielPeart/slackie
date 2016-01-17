#!/bin/bash

grunt release --arch=x64 --platform=linux && grunt debian_package --arch=x64
grunt release --arch=ia32 --platform=linux 
