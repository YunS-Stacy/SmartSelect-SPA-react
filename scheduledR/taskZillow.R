library('stringr')
library('xml2')
library('httr')
library('jsonlite')
library('rvest')

html_1 <- read_html("https://www.zillow.com/homes/recently_sold/Philadelphia-PA/apartment_duplex_type/days_sort/")
#Get Coords
lon_1 <- html_nodes(html_1, css='.zsg-photo-card-content > span:nth-child(2) > meta:nth-child(2)') %>%
  html_attr('content')
lat_1 <- html_nodes(html_1, css='.zsg-photo-card-content > span:nth-child(2) > meta:nth-child(1)') %>%
  html_attr('content')
#Get Prices
price_1 <- html_nodes(html_1, css='.zsg-photo-card-status') %>% 
  html_text() %>% str_replace("SOLD: ", "")
#Get Housing Info
infos_1 <- html_nodes(html_1, css='.zsg-photo-card-info') %>% 
  html_text()
##price per sqft
unitprice_1 <- infos_1 %>% 
  sapply(function(x){
    # unit price
    strsplit(x,' · ')[[1]][1] %>%
      str_replace(fixed("Price/sqft: "), "")})
##beds
beds_1 <- infos_1 %>% 
  sapply(function(x){
    # unit price
    strsplit(x,' · ')[[1]][2] %>%
      str_replace(fixed(" bds"), "") %>%
      str_replace(fixed(" bd"), "")
  })

##baths
baths_1 <- infos_1 %>% 
  sapply(function(x){
    # unit price
    strsplit(x,' · ')[[1]][3] %>%
      str_replace(fixed(" ba"), "")
  })
#area
area_1 <- infos_1 %>% 
  sapply(function(x){
    # unit price
    strsplit(x,' · ')[[1]][4] %>%
      str_replace(fixed(" sqft"), "")
  })

#Get sold date
solddate_1 <- html_nodes(html_1, css='.zsg-photo-card-notification') %>% 
  html_text() %>%
  str_replace("Sold ",'') %>%
  as.Date(format = '%m/%d/%Y')

#Get address
address_1 <- html_nodes(html_1, css='.zsg-photo-card-address') %>% 
  html_text() %>%
  str_replace(", Philadelphia, PA",'')

latest_1 <- data.frame(address_1, solddate_1, price_1, unitprice_1, beds_1, baths_1, area_1, lon_1, lat_1, row.names = NULL)
names(latest_1)  <- c('address', 'solddate', 'price', 'unitprice', 'beds', 'baths', 'area', 'lon', 'lat')

html_2 <- read_html("https://www.zillow.com/homes/recently_sold/Philadelphia-PA/apartment_duplex_type/days_sort/2_p")


#Get Coords
lon_2 <- html_nodes(html_2, css='.zsg-photo-card-content > span:nth-child(2) > meta:nth-child(2)') %>%
  html_attr('content')
lat_2 <- html_nodes(html_2, css='.zsg-photo-card-content > span:nth-child(2) > meta:nth-child(1)') %>%
  html_attr('content')
#Get Prices
price_2 <- html_nodes(html_2, css='.zsg-photo-card-status') %>% 
  html_text() %>% str_replace("SOLD: ", "")
#Get Housing Info
infos_2 <- html_nodes(html_2, css='.zsg-photo-card-info') %>% 
  html_text()
##price per sqft
unitprice_2 <- infos_2 %>% 
  sapply(function(x){
    # unit price
    strsplit(x,' · ')[[1]][1] %>%
      str_replace(fixed("Price/sqft: "), "")})
##beds
beds_2 <- infos_2 %>% 
  sapply(function(x){
    # unit price
    strsplit(x,' · ')[[1]][2] %>%
      str_replace(fixed(" bds"), "") %>%
      str_replace(fixed(" bd"), "")
  })

##baths
baths_2 <- infos_2 %>% 
  sapply(function(x){
    # unit price
    strsplit(x,' · ')[[1]][3] %>%
      str_replace(fixed(" ba"), "")
  })
#area
area_2 <- infos_2 %>% 
  sapply(function(x){
    # unit price
    strsplit(x,' · ')[[1]][4] %>%
      str_replace(fixed(" sqft"), "")
  })

#Get sold date
solddate_2 <- html_nodes(html_2, css='.zsg-photo-card-notification') %>% 
  html_text() %>%
  str_replace("Sold ",'') %>%
  as.Date(format = '%m/%d/%Y')

#Get address
address_2 <- html_nodes(html_2, css='.zsg-photo-card-address') %>% 
  html_text() %>%
  str_replace(", Philadelphia, PA",'')
latest_2 <- data.frame(address_2, solddate_2, price_2, unitprice_2, beds_2, baths_2, area_2, lon_2, lat_2, row.names = NULL)
names(latest_2)  <- c('address', 'solddate', 'price', 'unitprice', 'beds', 'baths', 'area', 'lon', 'lat')

latest <- rbind(latest_1,latest_2)

today <- toJSON(latest)

r <- PUT(body=today, url="https://smartselect-34c02.firebaseio.com/houseListing.json")

# r$status_code === 200 check success
print(today)
print(r$status_code)
print(Sys.time())