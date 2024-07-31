


document.addEventListener('DOMContentLoaded', function() {
    function fetchDataAndDisplay() {
        fetch('data/data.json')
        .then(response => {
        // Kiểm tra nếu phản hồi thành công
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        // Chuyển đổi phản hồi thành JSON
        return response.json();
        })
        .then(data => {
            // Gán dữ liệu vào biến
            listRoomType = data.roomType;
            // Hiển thị dữ liệu trong trang
            listRoomType.forEach((room) => {
                const listRoom = document.getElementById('list-room');
                var item = document.createElement('div');
                item.className = "list-room__item row";
        
                item.innerHTML = `<div class="col-12 col-sm-12 col-md-12 col-lg-5 px-4">
                <div class="item">
                    <img src=${room.imageSrc} alt="" class="" style="width: 100%;height: 50%;">
                    <div class="item-content">
                        <div class="room-type">${room.name}</div>
                        <button class="book-btn" onClick="goToBooking(${room.id})">Book now</button>
                    </div>
                    </div>
                </div>
        
                <div class="col-12 col-sm-12 col-md-12 col-lg-6">
                    <p class="description">
                        ${room.description}
                    </p>
                    <p class="capacity">
                        <span class="">
                            <svg fill="#9e9e9e" width="30px" height="30px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#9e9e9e"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M23.313 26.102l-6.296-3.488c2.34-1.841 2.976-5.459 2.976-7.488v-4.223c0-2.796-3.715-5.91-7.447-5.91-3.73 0-7.544 3.114-7.544 5.91v4.223c0 1.845 0.78 5.576 3.144 7.472l-6.458 3.503s-1.688 0.752-1.688 1.689v2.534c0 0.933 0.757 1.689 1.688 1.689h21.625c0.931 0 1.688-0.757 1.688-1.689v-2.534c0-0.994-1.689-1.689-1.689-1.689zM23.001 30.015h-21.001v-1.788c0.143-0.105 0.344-0.226 0.502-0.298 0.047-0.021 0.094-0.044 0.139-0.070l6.459-3.503c0.589-0.32 0.979-0.912 1.039-1.579s-0.219-1.32-0.741-1.739c-1.677-1.345-2.396-4.322-2.396-5.911v-4.223c0-1.437 2.708-3.91 5.544-3.91 2.889 0 5.447 2.44 5.447 3.91v4.223c0 1.566-0.486 4.557-2.212 5.915-0.528 0.416-0.813 1.070-0.757 1.739s0.446 1.267 1.035 1.589l6.296 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.809zM30.312 21.123l-6.39-3.488c2.34-1.841 3.070-5.459 3.070-7.488v-4.223c0-2.796-3.808-5.941-7.54-5.941-2.425 0-4.904 1.319-6.347 3.007 0.823 0.051 1.73 0.052 2.514 0.302 1.054-0.821 2.386-1.308 3.833-1.308 2.889 0 5.54 2.47 5.54 3.941v4.223c0 1.566-0.58 4.557-2.305 5.915-0.529 0.416-0.813 1.070-0.757 1.739 0.056 0.67 0.445 1.267 1.035 1.589l6.39 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.779h-4.037c0.61 0.46 0.794 1.118 1.031 2h3.319c0.931 0 1.688-0.757 1.688-1.689v-2.503c-0.001-0.995-1.689-1.691-1.689-1.691z"></path> </g></svg>
                        </span>
                        <span class="">${room.capacityAdult} người lớn - ${room.capacityChildren} trẻ em</span>
                    </p>
                    <p class="price">
                        ${room.price} VND/đêm
                    </p>
                </div>`;
                listRoom.appendChild(item)
            })
        
            })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }
    
    fetchDataAndDisplay();
   
    
    
})
// Chuyển đến trang đặt phòng
function goToBooking(index) {
    window.location.href = `booking.html?room=${index}`
}
