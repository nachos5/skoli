CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE todos ( 
       id serial primary key,
       title varchar(128) NOT NULL,
       due timestamp with time zone,
       position int default 0,
       completed boolean default false,
       created timestamp with time zone default current_timestamp,
       updated timestamp with time zone default current_timestamp );

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON todos
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();       