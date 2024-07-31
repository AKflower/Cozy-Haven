document.addEventListener('DOMContentLoaded', function() {
    function fetchDataAndDisplay() {
        fetch('/data/data.json')
        .then(response => {
            // Kiểm tra nếu phản hồi thành công
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            // Chuyển đổi phản hồi thành JSON
            return response.json();
        })
        .then(data => {
            // Tạo carousel
            createCarousel(data)

            })
        .catch(error => {
            // Xử lý lỗi nếu có
            console.error('There was a problem with the fetch operation:', error);
        });
    }
    
    fetchDataAndDisplay();
    function createCarousel(data) {
        // Gán dữ liệu vào biến
        listRoomType = data.roomType;
        // Hiển thị dữ liệu trong trang
        const rooms = document.getElementById('carousel-items')
        listRoomType.forEach((room) => {
    
            var item = document.createElement('div')
            item.className = "item";
            item.innerHTML=`
                <img src=${room.imageSrc} alt="" class="" style="width: 100%;height: 50%;">
                    <div class="item-content">
                        <div class="room-type">${room.name}</div>
                        <button class="book-btn" onClick="goToBooking(${room.id})">Book now</button>
                    </div>`;
            
            rooms.appendChild(item)
        })
        const prevButton = document.querySelector(".prev-button");
            const nextButton = document.querySelector(".next-button");
            const carouselItems = document.querySelector("#carousel-items");
            
            let currentIndex = 0;
            const items = document.querySelectorAll(".item");
            for (let i=0; i<items.length;i++) {
                items[i].addEventListener('click', function() {
                    window.location.href='rooms.html';
                })
            }
            const totalItems = items.length;
            const itemsPerView = 3;
            // Hàm di chuyển
            function goToSlide(index) {
                if (index < 0) { // index nhỏ hơn 0 khi đã ở đầu carousel và tiếp tục bấm prev=> tiến đến item cuối
                    currentIndex = totalItems - itemsPerView;
                    const translateXValue = -currentIndex * (100 / itemsPerView) + "%";
                    carouselItems.style.transform = `translateX(${translateXValue})`;
                } else if (index+itemsPerView > totalItems) { // Khi current đã đến cuối carousel => Quay lại item đầu tiên
                    currentIndex=0; 
                } else {
                    currentIndex = index;
                    
                }
                const translateXValue = -currentIndex * (100 / itemsPerView) + "%";
                carouselItems.style.transform = `translateX(${translateXValue})`;
                
            }
            // Thêm sự kiện di chuyển vào nút prev
            prevButton.addEventListener("click", function() {
                goToSlide(currentIndex - 1); //Gọi hàm di chuyển với tham số là vị trí hiện tại trừ 1 để lùi lại 1 item
            });
            // Thêm sự kiện di chuyển vào nút next
            nextButton.addEventListener("click", function() {
                goToSlide(currentIndex + 1); //Gọi hàm di chuyển với tham số là vị trí hiện tại cộng 1 để tiến thêm 1 item
            });
        
            // Khởi tạo carousel
            goToSlide(currentIndex);
    }
    
   
    
});
// Hàm chuyển đến trang đặt phòng với param là room id đã chọn
function goToBooking(index) { 
    window.location.href = `booking.html?room=${index}`
}