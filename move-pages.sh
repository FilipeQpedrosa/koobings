#!/bin/bash

# Move to the app directory
cd src/app

# Create directories if they don't exist
mkdir -p auth staff admin components dashboard business client api

# Move directories from [locale] to root app directory
mv "[locale]/auth"/* auth/ 2>/dev/null || true
mv "[locale]/staff"/* staff/ 2>/dev/null || true
mv "[locale]/admin"/* admin/ 2>/dev/null || true
mv "[locale]/components"/* components/ 2>/dev/null || true
mv "[locale]/(staff)"/* staff/ 2>/dev/null || true
mv "[locale]/(dashboard)"/* dashboard/ 2>/dev/null || true
mv "[locale]/dashboard"/* dashboard/ 2>/dev/null || true
mv "[locale]/business"/* business/ 2>/dev/null || true
mv "[locale]/client"/* client/ 2>/dev/null || true
mv "[locale]/(protected)"/* . 2>/dev/null || true
mv "[locale]/(portals)"/* . 2>/dev/null || true
mv "[locale]/api"/* api/ 2>/dev/null || true
mv "[locale]/(customer)"/* . 2>/dev/null || true
mv "[locale]/(auth)"/* auth/ 2>/dev/null || true

# Remove the [locale] directory
rm -rf "[locale]" 