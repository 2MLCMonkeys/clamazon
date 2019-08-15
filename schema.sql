USE mysql;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Azazel0315';
GRANT ALL PRIVILEGES ON clamazon_db.* TO 'root'@'localhost';

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

insert into products (Product_Name, Department_Name, Purchase_Price, Stock_Quantity) values ('Huggies Pull Ups 4-5 96count', 'Baby', 24.95, 23);
insert into products (Product_Name, Department_Name, Purchase_Price, Stock_Quantity) values ('Viginia Is For Lovers T-Shirt', 'Clothing', 19.99, 16);
insert into products (Product_Name, Department_Name, Purchase_Price, Stock_Quantity) values ('Taste of The Wild Puppy Treats', 'Pets', 23.99, 42);
insert into products (Product_Name, Department_Name, Purchase_Price, Stock_Quantity) values ('Kindle Fire HD', 'Electronics', 145.98, 125);
insert into products (Product_Name, Department_Name, Purchase_Price, Stock_Quantity) values ('Pampers Sensitive Baby Wipes 12 count', 'Baby', 12.75, 32);
insert into products (Product_Name, Department_Name, Purchase_Price, Stock_Quantity) values ('Power Cord XBOX ONE', 'Electronics', 16.97, 13);
insert into products (Product_Name, Department_Name, Purchase_Price, Stock_Quantity) values ('Refurbished Iphone 6s Plus Rose Gold', 'Electronics', 249.95, 3);
insert into products (Product_Name, Department_Name, Purchase_Price, Stock_Quantity) values ('Halloween Skeleton Bobble Head (Solar Powered)', 'Decor', 1.99, 124);
insert into products (Product_Name, Department_Name, Purchase_Price, Stock_Quantity) values ('Metal Grate Dish Rack', 'Home and Garden', 12.95, 14);
insert into products (Product_Name, Department_Name, Purchase_Price, Stock_Quantity) values ('Ivory Bar Soap', 'Beauty and Health', 6.37, 56);
insert into products (Product_Name, Department_Name, Purchase_Price, Stock_Quantity) values ('Infants Motrin', 'Baby', 7.97, 27);


select * from products;
