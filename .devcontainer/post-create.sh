#!/bin/bash

# Install Node Packages
cd api || exit
npm install
cd ../client || exit
npm install
cd ..