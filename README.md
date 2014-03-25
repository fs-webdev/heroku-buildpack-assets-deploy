# user-env-compile Buildpack

## Why is this a thing?
With the [changes to heroku slug compilation environments](http://dncrews.com/tools/2014/03/21/heroku-user-env-changes/),
environment variables are not available during slug compilation. When used, this buildpack
changes it back and exports those variables.

## What does it do?
It simply reads the ENV_DIR directory and sets all contents as environment variables.

### Credit
The method used to do this is extracted directly from the
[Heroku buildpack api documentation](https://devcenter.heroku.com/articles/buildpack-api).
