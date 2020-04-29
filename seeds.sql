INSERT INTO products 
	(Product_Name, Department_Name, Purchase_Price, Stock_Quantity, Product_Sales) 
VALUES 
	('Huggies Pull Ups 4-5 96count', 'Baby', 24.95, 23, 74.85),
	('Viginia Is For Lovers T-Shirt', 'Clothing', 19.99, 16, 99.95),
	('Taste of The Wild Puppy Treats', 'Pets', 23.99, 42, 359.85),
	('Kindle Fire HD', 'Electronics', 145.98, 125, 437.94),
	('Pampers Sensitive Baby Wipes 12 count', 'Baby', 12.75, 32, 76.50),
	('Power Cord XBOX ONE', 'Electronics', 16.97, 13, 33.94),
	('Refurbished Iphone 6s Plus Rose Gold', 'Electronics', 249.95, 3, 749.85),
	('Halloween Skeleton Bobble Head (Solar Powered)', 'Decor', 1.99, 124, 63.68),
	('Metal Grate Dish Rack', 'Home and Garden', 12.95, 14, 129.50),
	('Ivory Bar Soap', 'Beauty and Health', 6.37, 56, 146.51),
	('Infants Motrin', 'Baby', 7.97, 27, 103.61);


SELECT * FROM products;

INSERT INTO departments
	(Department_Name, Over_Head_Costs)
VALUES
	("Baby", 45.99),
	("Beauty and Health", 25.99),
	("Home and Garden", 79.99),
	("Decor", 80.99),
	("Electronics", 254.99),
	("Pets", 59.99),
	("Clothing", 83.99);
        
SELECT * FROM departments; 