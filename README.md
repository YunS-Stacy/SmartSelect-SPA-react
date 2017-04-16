# Smart Select
## Live Demo
https://smartselect.herokuapp.com/#/

### This is the MUSA Capstone Project by Yun Shi, from MUSA 17', UPenn.
Smart Select is an interactive map created by Yun Shi that explores the commercial real estate investment by predicting the apartment price in Philadelphia.
![image](./abstract.jpeg)

## Problem / Question
- Problem:
  1) In the real estate industry, most developers will use pro formas to estimate returns, however this method usually takes a long time.
  2) Most of the developers may not know how to draw a sketch but do want to communicate with the designers.
  3) And for those who have the willingness to invest in commercial real estate, they may not have the right 'tools' to get an idea of the building's value in the future. (They probably will turn to realtors or Zillow's Zestimate, but neither of them will tell them how the price is generated.)

- Answer:
  So I want to build a prediction model that can estimate the value on the fly. Also, this application is ready for those who do not have professional knowledge to use the pro formas and want to know more than the prediction (like Zestimate).

## The data
- Property information from Office of Property Assessment through Socrata API & Zillow API
  1) Due to the size of the datasets, I used SoQL queries (get the 'Apartment Type Only') to filter this dataset and page data, and then passed it directly to CartoDB.
  2) In CartoDB, I filter the addresses that has no lat/lon, and geocode this part of the dataset in R using Googles Geocoding API.
  3) Because the housing conditions of most apartment properties in the dataset are N/A, I exported the dataset as CSV into R and wrote the R script to parse XML from Zillow API and filled in the dataset.
  4) After that I built a model in ArcGIS to generate distance variables as 3/5/7/... nearest facilities to the property.
  5) Then I built the prediction model in R using OLS and decision tree and uploaded it to Mapbox (? maybe gist or Carto ... to use AJAX).

## Technologies used
- React, Redux;
- G2;
- Mapbox GL;

## Use-cases
- Users:
  1) Want to find the investment opportunity;
  2) Want to explore the city;
  3) Want to know which factor matters most the apartment value.

- Gain:
  Apartment price and several comps.

## Finished list:
- Use of React, Redux
