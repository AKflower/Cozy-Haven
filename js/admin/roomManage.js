let listRoom;
let listRoomType;
let listBooking;
let currentFilter = "1"; // Mặc định hiển thị tất cả (giá trị của input "Tất cả")
let currentRoomType = "0"; // Mặc định roomType=0 là tất cả
let newRoomType= "1"; //Mặc định loại phòng mới khi được tạo là id:1 Deluxe Room

document.addEventListener('DOMContentLoaded', function() {
    const checkInDate = document.getElementById('checkInDate'); //Lấy checkInDate
    const checkOutDate = document.getElementById('checkOutDate');//Lấy checkOutDate
    //Hàm cập nhật min của checkOutDate mỗi khi checkInDate thay đổi
    function updateCheckOutMinDate() {
        if (checkInDate.value) {
            const checkInDateValue = new Date(checkInDate.value);
            checkInDateValue.setDate(checkInDateValue.getDate() + 1);
            checkOutDate.min = checkInDateValue.toISOString().split('T')[0];
            render()
        } else {
            checkOutDate.min = '';
        }
    }
     //Hàm cập nhật max của checkInDate mỗi khi checkOutDate thay đổi
    function updateCheckInMaxDate() {
        if (checkOutDate.value) {
            const checkOutDateValue = new Date(checkOutDate.value);
            checkOutDateValue.setDate(checkOutDateValue.getDate() - 1);
            checkInDate.max = checkOutDateValue.toISOString().split('T')[0];
            render()
        } else {
            checkInDate.max = '';
        }
    }

    checkInDate.addEventListener('change', updateCheckOutMinDate);
    checkOutDate.addEventListener('change', updateCheckInMaxDate);
    // Xử lý sự kiện khi người dùng thay đổi bộ lọc
    document.querySelectorAll('input[name="filter"]').forEach((input) => {
        input.addEventListener('change', function() {
            currentFilter = this.value; // Cập nhật bộ lọc hiện tại từ giá trị của input radio đã chọn
            render(); // Render lại danh sách phòng dựa trên bộ lọc mới
        });
    });
    document.getElementById('roomTypeSelect').addEventListener('change', function() {
        currentRoomType= this.value;
        render();
    });
    document.getElementById('create-btn').addEventListener('click', function(){
        
        var room = document.getElementById('new-room');
        room.style.border = '1px solid silver';
        var roomType = document.getElementById('roomTypeSelectModal');
        
        if (checkRoomName(room.value)) {
            
            createRoom(room.value,roomType.value)
            var closeBtn = document.getElementById('close-btn');
            closeBtn.click();
           
            showToast();
           
        }
        else room.style.border = '1px solid red';
    })
    //Lấy dữ liệu và render giao diện
    function fetchDataAndDisplay() {
        fetch('/data/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            //Gán dữ liệu
            listRoomType = data.roomType;
            listRoom = data.room;
            listBooking = data.booking;
            //Tạo ra bộ lọc
            var roomTypeSelect = document.getElementById('roomTypeSelect');
            var roomTypeSelectModal = document.getElementById('roomTypeSelectModal');
            //Tạo option cho bộ lọc các phòng
            listRoomType.forEach((roomType) => {
                var option = document.createElement('option');
                option.value=roomType.id;
                option.innerHTML=`${roomType.name}`
                
                roomTypeSelect.appendChild(option);
                var optionModal = document.createElement('option');
                optionModal.value=roomType.id;
                optionModal.innerHTML=`${roomType.name}`
                roomTypeSelectModal.appendChild(optionModal);
            })
            
            render(); // Hiển thị dữ liệu ban đầu
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }
    fetchDataAndDisplay();
    

});
// Gán ngày 
function setDate() {
   
    checkInDate =new Date(document.getElementById("checkInDate").value);
    checkOutDate =new  Date(document.getElementById("checkOutDate").value);

}
//Hiển thị danh sách các phòng
function render() {
    var roomList = document.getElementById('room-list');
    roomList.innerHTML = '';

    // Lọc danh sách phòng dựa trên trạng thái phòng
    var filteredRooms = listRoom;
    if (currentFilter === "2") {
        filteredRooms = listRoom.filter(room => !room.isBooked);
    } else if (currentFilter === "3") {
        filteredRooms = listRoom.filter(room => room.isBooked);
    }
    //Lọc dựa trên loại phòng
    if (currentRoomType!=0)
        filteredRooms = filteredRooms.filter(room => room.roomTypeId==currentRoomType);
    // Lọc trên ngày checkin và checkout
    setDate()
    if (filteredRooms.length==0) roomList.style.display='none';
    else roomList.style.display='flex';
    filteredRooms.forEach((room) => {
        checkIsBooked(room);
        var item = document.createElement('div');
        var roomType = getInfoTypeRoom(room.roomTypeId);
        var imgSrc = '.' + roomType.imageSrc;
        var customerInfo = []
        room.bookingIds.forEach((bookingId) => {
            var booking = getInfoBooking(bookingId);
            let bookingCheckIn = new Date(booking.checkInDate);
            let bookingCheckOut = new Date(booking.checkOutDate);
            if ((bookingCheckIn >= checkInDate && bookingCheckIn <= checkOutDate) || 
                (bookingCheckOut >= checkInDate && bookingCheckOut <= checkOutDate)) {
                    customerInfo.push(booking);
                    console.log(customerInfo);
                }
            
        })
        

        item.className = "col";

        item.innerHTML = `
            <div class="room__item" onClick="goToDetail(${room.id})">
                <div class="">#${room.id}</div>
                <div class=${room.isBooked ? "status" : "status-empty"}>
                    ${customerInfo.length>0 ? 'Đã thuê - ' + customerInfo[0].customerName + ' - ' + customerInfo[0].phone : 'Đang trống'}
                    ${customerInfo.length>1 ? 'và ' + (customerInfo.length-1) + ' đơn khác' : ''}
                </div>
                <div class="room-infor">
                    ${roomType.name}
                    <img src=${imgSrc} alt="" class="">
                </div>
            </div>
        `;
        roomList.appendChild(item);
    })
}
//Khởi tạo ngày checkIn là hôm nay và ngày checkOut là ngày mai
let checkInDate= new Date();
let checkOutDate = new Date(checkInDate);
checkOutDate.setDate(checkInDate.getDate() + 1);

const formatDate = (date) => {
    let day = date.getDate();
    let month = date.getMonth() + 1; // Tháng tính từ 0
    const year = date.getFullYear();

    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;

    return `${year}-${month}-${day}`;
};
    
// Gán giá trị mặc định cho các input date
document.getElementById("checkInDate").value = formatDate(checkInDate);
document.getElementById("checkOutDate").value = formatDate(checkOutDate);

//Kiểm tra từ ngày checkInDate đến ngày checkOutDate được chọn phòng có được đặt chưa
function checkIsBooked(room){
    if (room.bookingIds.length>0){
        for (let i = 0; i < room.bookingIds.length; i++) { //Duyệt qua mảng bookingIds của room và xét từng booking
            let id = room.bookingIds[i];
            var booking = getInfoBooking(id);
            console.log(room.id);
            
            let bookingCheckIn = new Date(booking.checkInDate);
            let bookingCheckOut = new Date(booking.checkOutDate);

            if ((bookingCheckIn >= checkInDate && bookingCheckIn <= checkOutDate) || 
                (bookingCheckOut >= checkInDate && bookingCheckOut <= checkOutDate)) {
                room.isBooked = true;
                return;
            }
        }
    }
    room.isBooked = false; 

}
//Lấy thông tin loại phòng
function getInfoTypeRoom(id) {
    var roomType = listRoomType.find(ele => ele.id == id);
    return roomType;
}
//Lấy thông tin đơn đặt phòng
function getInfoBooking(id) {
    var booking = listBooking.find(ele => ele.id == id);
    return booking;
}
// Chuyển đến trang chi tiết phòng
function goToDetail(id) {
    window.location.href = `roomDetail.html?room=${id}`
}
function checkRoomName(id) {
    var room = listRoom.find(room => room.id ==id);
    if (room!=null) return false;
    return true;
}
// Tạo phòng mới
function createRoom(id,type) {
    var newRoom = {
        id: id,
        roomTypeId: type,
        bookingIds: []
    }
    listRoom.push(newRoom);
    console.log(listRoom);
    sortRoomsById(listRoom)
    render()
}
//Sắp xếp mảng room theo id
function sortRoomsById(rooms) {
    // Sử dụng hàm sort() với callback nhận vào hai phần tử a và b
    rooms.sort((a, b) => {
        // Chuyển đổi id từ chuỗi sang số để so sánh theo thứ tự số
        return parseInt(a.id) - parseInt(b.id);
    });
}