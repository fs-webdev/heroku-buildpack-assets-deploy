# AssetManager cake assets:deploy

## Why is this a thing?
With the [changes to heroku slug compilation environments](http://dncrews.com/tools/2014/03/21/heroku-user-env-changes/),
environment variables are not available during slug compilation. This buildpack is now
necessary to call the deployment process if the environment FILE is set.
