SELECT latitude, longitude, timestamp
FROM locations
INTO OUTFILE '/var/lib/mysql-files/locations.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';
