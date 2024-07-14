#!/bin/bash
set -a

. workspace/$CURRENT_ENV/config/$STAGE.env

npm run build-$CURRENT_ENV
