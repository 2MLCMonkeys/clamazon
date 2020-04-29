USE mysql;
use clamazon_db;

create table products(
Item_ID integer auto_increment not null,
Product_Name varchar(100) not null,
Department_Name varchar(100) not null,
Purchase_Price decimal(10,2) not null,
Stock_Quantity integer null,
Product_Sales DECIMAL(10,2) NOT NULL,
primary key (Item_ID)
);

CREATE TABLE departments(
    Department_ID INTEGER(10) NOT NULL AUTO_INCREMENT,
    Department_Name VARCHAR(50) NOT NULL,
    Over_Head_Costs DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (Department_ID)
);
