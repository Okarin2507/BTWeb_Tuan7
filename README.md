# BTWeb_Tuan7
# Công nghệ sử dụng
* Backend:
  - Java 24
  - Spring Boot 3
  - Spring for GraphQL
  - Spring Data JPA (Hibernate)
  - Lombok
* Frontend:
  - Thymeleaf & Thymeleaf Layout Dialect
  - JavaScript (AJAX với Fetch API)
  - Bootstrap 5
* Cơ sở dữ liệu: Microsoft SQL Server
* Build Tool: Maven
# Hướng dẫn cài đặt và khởi chạy
* Cài đặt cơ sở dữ liệu
  - Mở SSMS, tạo một cơ sở dữ liệu mới (ví dụ: graphql_db).
  - Chạy đoạn script SQL dưới đây để tạo các bảng và thêm dữ liệu mẫu:
```SQL
-- TẠO DATABASE
CREATE DATABASE [graphql_db];
GO

-- SỬ DỤNG DATABASE VỪA TẠO
USE [graphql_db];
GO

-- TẠO BẢNG Users
CREATE TABLE users (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    fullname NVARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20)
);

-- TẠO BẢNG Categories
CREATE TABLE categories (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    images VARCHAR(MAX)
);

-- TẠO BẢNG Products
CREATE TABLE products (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    description NVARCHAR(MAX),
    price FLOAT NOT NULL,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- TẠO BẢNG TRUNG GIAN product_category
CREATE TABLE product_category (
    product_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
GO

-- THÊM DỮ LIỆU MẪU (Tùy chọn nhưng khuyến khích)
INSERT INTO users (fullname, email, password, phone) VALUES
(N'Nguyễn Văn An', 'an.nguyen@example.com', 'password123', '0912345678');

INSERT INTO categories (name, images) VALUES
(N'Laptop', 'laptop.jpg'), (N'Điện thoại', 'phone.jpg'), (N'Phụ kiện', 'accessories.jpg');

INSERT INTO products (title, quantity, description, price, user_id) VALUES
(N'Dell XPS 13', 10, N'Laptop mỏng nhẹ, hiệu năng cao.', 30000000, 1),
(N'iPhone 15 Pro', 20, N'Điện thoại thông minh với camera đỉnh cao.', 28000000, 1),
(N'Bàn phím cơ Keychron K2', 50, N'Bàn phím cơ không dây cho Mac và Windows.', 2500000, 1);

INSERT INTO product_category (product_id, category_id) VALUES (1, 1), (2, 2), (3, 3);
GO
```
* Cấu hình ứng dụng
- Mở file src/main/resources/application.properties và cập nhật các thông tin sau để khớp với cấu hình SQL Server của bạn:
```code
Properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=graphql_db;encrypt=true;trustServerCertificate=true;
spring.datasource.username=your_username
spring.datasource.password=your_password
```
* Chạy ứng dụng
  - Truy cập http://localhost:8080/ để xem trang web chính. Bạn có thể xem danh sách sản phẩm và nhấn vào các danh mục bên trái để lọc.
  - Kiểm tra API với GraphiQL: Truy cập http://localhost:8080/graphiql để mở công cụ kiểm tra API.
