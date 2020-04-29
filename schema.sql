USE mysql;

drop database if exists clamazon_db;
create database clamazon_db;
use clamazon_db;

create table products(
Item_ID integer auto_increment not null,
Product_Name varchar(100) not null,
Department_Name varchar(100) not null,
Purchase_Price decimal(10,2) not null,
Stock_Quantity integer null,
primary key (Item_ID)
);

CREATE TABLE departments(
    Department_ID INTEGER(10) NOT NULL AUTO_INCREMENT,
    Department_Name VARCHAR(50) NOT NULL,
    Over_Head_Costs DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (department_id)
);
