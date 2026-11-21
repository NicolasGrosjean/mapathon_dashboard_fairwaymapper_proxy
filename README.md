# Mapathon Dashboard FairwayMapper proxy

This repository solve 2 issues

- Allow the [mapathon dashboard](https://mapathon.cartong.org/) to query FairwayMapper without CORS issues
- Hide the API Key to query FairwayMapper

## Create an API Key

Go to https://www.fairwaymapper.com/api/keys, create (or connect) an account (it can be free if you contribue to OSM in the latest 90 days).

Create an API Key.

## Install project

- Link Netlify with GitHub
- Create a project from this repository
- Add the API KEY in the `FAIRWAYMAPPER_TOKEN` environment variable
