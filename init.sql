-- Grant all privileges to postgres user
ALTER USER postgres WITH SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE service_scheduler TO postgres;
\c service_scheduler
GRANT ALL ON SCHEMA public TO postgres; 