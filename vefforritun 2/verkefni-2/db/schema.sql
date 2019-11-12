CREATE TABLE applications ( id serial primary key,
       nafn varchar(32),
       netfang varchar(32),
       sími int check (sími between 0000000 
   AND 9999999),
       texti text,
       starf varchar(32),
       unnin boolean,
       dagsetning timestamp without time zone default current_timestamp,
       unnin_dagsetning timestamp without time zone default current_timestamp ); 