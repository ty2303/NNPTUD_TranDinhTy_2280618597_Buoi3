# Product Dashboard

A responsive product dashboard using the API: https://api.escuelajs.co/api/v1/products

## Features

✅ **Get All Products**: Hàm `getAll()` để lấy toàn bộ dữ liệu từ API  
✅ **Alternating Row Colors**: Bảng có dòng đen và dòng trắng xen kẽ  
✅ **Show All Images**: Hiển thị toàn bộ hình ảnh sản phẩm  
✅ **Search by Title**: Tìm kiếm theo title với sự kiện onChange  
✅ **Pagination**: Chia trang với tùy chọn 5, 10, 20 items/trang  
✅ **Sortable Columns**: Sắp xếp theo giá (tăng/giảm) và tên (tăng/giảm)  
✅ **Hidden Description**: Ẩn cột description, chỉ hiển thị khi hover  

## Files

- `index.html` - Giao diện dashboard
- `dashboard.js` - Logic JavaScript
- `README.md` - Tài liệu này

## Screenshots

Các chức năng đã được thực hiện:

1. **Dashboard Overview** - Giao diện chính với bảng dữ liệu
2. **Search Feature** - Tìm kiếm theo title với onChange
3. **Sorting** - Sắp xếp theo giá và tên
4. **Pagination** - Chia trang 5/10/20 items
5. **Hover Description** - Hiển thị description khi hover
6. **Alternating Colors** - Dòng đen trắng xen kẽ

## Cách sử dụng

1. Mở file `index.html` trong trình duyệt
2. Dữ liệu sẽ tự động load từ API
3. Sử dụng các tính năng:
   - Nhập vào ô tìm kiếm để lọc sản phẩm
   - Click vào header để sắp xếp
   - Chọn số lượng hiển thị mỗi trang
   - Hover vào cột Description để xem chi tiết

## API

- URL: https://api.escuelajs.co/api/v1/products
- Method: GET
- Response: JSON array of products
