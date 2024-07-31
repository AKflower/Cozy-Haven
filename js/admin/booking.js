let listRoom;
let listRoomType;
let listBooking;
var booking;
var bookingChoose;
var roomChoose;
var room, roomType, lengthWaiting;
var checkDelete=false;
let currentRoomType = "0"; // Bộ lọc loại phòng
let currentFilter="1"; // Bộ lọc 

const urlParams = new URLSearchParams(window.location.search);
var roomId = urlParams.get('room');


document.addEventListener('DOMContentLoaded', function() {
    function fetchDataAndDisplay() {
        fetch('../data/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            listRoomType = data.roomType;
            listRoom = data.room;
            listBooking = data.booking;
            //Lấy dữ liệu
            var roomTypeSelect = document.getElementById('roomTypeSelect');
            
            listRoomType.forEach((roomType) => {
                var option = document.createElement('option');
                option.value=roomType.id;
                option.innerHTML=`${roomType.name}`
                
                roomTypeSelect.appendChild(option);
                
            })
            
            var table = document.getElementById('booking-table')
            var tbody = document.createElement('tbody');
            tbody.id = 'booking-tbody';

            listBooking.forEach((booking)=> {
                var roomBooked;
                
                var roomTypeBooked=getInfoTypeRoom(booking.roomTypeId)
                if (booking.isDeal) {
                    roomBooked=findRoomByBooking(booking)? findRoomByBooking(booking).id : null;
                    
                    console.log(roomBooked);
                }
                var tr = document.createElement('tr');
                tr.innerHTML=`
                        <td>${booking.id}</td>
                        <td>${booking.customerName}</td>
                        <td>${booking.phone}</td>
                        <td>${roomTypeBooked.name}</td>
                        <td>${formatDate(booking.checkInDate)}</td>
                        <td>${formatDate(booking.checkOutDate)}</td>
                        <td class="text-center">${booking.isDeal ? '<button class="btn btn-success"  data-bs-toggle="modal" data-bs-target="#acceptBooking" id="btn-book-'+ booking.id+'">'+roomBooked+'</button>': '<button class="btn btn-primary"data-bs-toggle="modal" data-bs-target="#acceptBooking"id="btn-book-'+ booking.id+'">Book</button>'}</td>
                        <td><button class="btn btn-danger" id='reject-btn-${booking.id}'>Delete</button></td>
                        
                `;
                tbody.appendChild(tr);
            
            })
            table.appendChild(tbody);
            listBooking.forEach((booking)=> {
                document.getElementById(`reject-btn-${booking.id}`).addEventListener('click',function() {
                    console.log(booking.id)
                    var room=findRoomByBooking(booking);
                    
                    room.bookingIds = room.bookingIds.filter(ele => ele != booking.id);
                
                    listBooking=listBooking.filter(ele => ele.id != booking.id)
                    console.log('list: ',listRoom);
                    reRender()
                })
                document.getElementById(`btn-book-${booking.id}`).addEventListener('click', function(){
                    bookingChoose= booking;
                    roomChoose= findRoomByBooking(booking)? findRoomByBooking(booking).id : null;;
                    bookingRoomFit()
                })
            })

            document.getElementById('btn-book').addEventListener('click', function() {
                
                if (roomChoose!="" || roomChoose!=null) {

                    if (checkDelete){ 
                        
                        var roomOldBook=findRoomByBooking(bookingChoose);
                        console.log(roomOldBook,bookingChoose.id);
                        roomOldBook.bookingIds=roomOldBook.bookingIds.filter(booking => booking!=bookingChoose.id);
                    }
                    var room = listRoom.find(room => room.id == roomChoose);
                    
                    bookingChoose.isDeal = true;
                    if (room.bookingIds.length<=1) room.bookingIds.push(bookingChoose.id);
                    else
                    {   
                        var index=room.bookingIds.length-1;
                        for (let i=0;i<room.bookingIds.length-1;i++) {
                            var bookingCheck = getInfoBooking(room.bookingIds[i])
                            var bookingNextCheck = getInfoBooking(room.bookingIds[i+1])
                            if (new Date(bookingChoose.checkInDate)>new Date(bookingCheck.checkInDate) && new Date(bookingChoose.checkInDate)<new Date(bookingNextCheck.checkInDate)) 
                                {
                                    index = i+1;
                                    break;
                                }
                        }   
                        console.log(index);
                        room.bookingIds.splice(index, 0, bookingChoose.id);
                    
                    }
                    document.getElementById('close-btn-book').click();
                    reRender()
                }
                
            })
            document.getElementById('close-btn-book').addEventListener("click", function() {
                bookingChoose=null;
                roomChoose=null;
                checkDelete=false;
            })
            document.getElementById('roomTypeSelect').addEventListener('change', function() {
                currentRoomType= this.value;
                reRender();
            });
            document.querySelectorAll('input[name="filter"]').forEach((input) => {
                input.addEventListener('change', function() {
                    currentFilter = this.value; // Cập nhật bộ lọc hiện tại từ giá trị của input radio đã chọn
                    reRender(); // Render lại danh sách phòng dựa trên bộ lọc mới
                });
                });
            })
        .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
    fetchDataAndDisplay();

})
function getInfoTypeRoom(id) {
    var roomType = listRoomType.find(ele => ele.id == id);
    return roomType;
}

function getInfoBooking(id) {
    var booking = listBooking.find(ele => ele.id == id);
    return booking;
}
//Đổi thành ngày tháng năm
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
//Tìm phòng đã được đặt cho đơn
function findRoomByBooking(booking) {
    var room = listRoom.find(room => room.bookingIds.includes(booking.id))
    if (room)
        return room;
    return null;
}
//Render lại
function reRender() {
    var tbody= document.getElementById('booking-tbody');
    tbody.innerHTML='';
    var listBookingFiltered=listBooking;
    if (currentRoomType!=0) listBookingFiltered= listBooking.filter(booking => booking.roomTypeId == currentRoomType)
    
    if (currentFilter=="2") listBookingFiltered = listBookingFiltered.filter(booking => !booking.isDeal)
    else if (currentFilter=="3") listBookingFiltered = listBookingFiltered.filter(booking => booking.isDeal);
    listBookingFiltered.forEach((booking)=> {
        console.log(booking);
        var roomBooked;
        
        var roomTypeBooked=getInfoTypeRoom(booking.roomTypeId)
        if (booking.isDeal) {
            roomBooked=findRoomByBooking(booking)? findRoomByBooking(booking).id : null;;
            
            console.log(roomBooked);
        }
        var tr = document.createElement('tr');
        tr.innerHTML=`
            <td>${booking.id}</td>
            <td>${booking.customerName}</td>
            <td>${booking.phone}</td>
            <td>${roomTypeBooked.name}</td>
            <td>${formatDate(booking.checkInDate)}</td>
            <td>${formatDate(booking.checkOutDate)}</td>
            <td class="text-center">${booking.isDeal ? '<button class="btn btn-success"  data-bs-toggle="modal" data-bs-target="#acceptBooking" id="btn-book-'+ booking.id+'">'+roomBooked+'</button>': '<button class="btn btn-primary"data-bs-toggle="modal" data-bs-target="#acceptBooking"id="btn-book-'+ booking.id+'">Book</button>'}</td>
            <td><button class="btn btn-danger" id='reject-btn-${booking.id}'>Delete</button></td>
                
        `;
        tbody.appendChild(tr);
        document.getElementById(`reject-btn-${booking.id}`).addEventListener('click',function() {
            var room=findRoomByBooking(booking);
            if (room) room.bookingIds = room.bookingIds.filter(ele => ele != booking.id);
            listBooking=listBooking.filter(ele => ele.id != booking.id)
            reRender()
        })
        document.getElementById(`btn-book-${booking.id}`).addEventListener('click', function(){
            bookingChoose= booking;
            roomChoose= findRoomByBooking(booking)? findRoomByBooking(booking).id : null;;
            bookingRoomFit()
        })
        
    })
    
}
// Tìm phòng phù hợp với đơn
function bookingRoomFit(){
    console.log('Booking: ',bookingChoose,roomChoose);
    if (roomChoose) checkDelete=true;
    else checkDelete=false;
    var listRoomFit = listRoom.filter(room => room.roomTypeId == bookingChoose.roomTypeId && checkBooking(room));
    var roomList = document.getElementById('room-list-modal');
    roomList.innerHTML='';
    listRoomFit.forEach((room) =>{
        var item = document.createElement('div')
        item.className='room-select-item';
        item.innerHTML=`
            <input type="radio" id="room-${room.id}" name="room" ${roomChoose==room.id ? 'checked' : ''} value="${room.id}">
            #${room.id}
        `;
        roomList.appendChild(item);
    })
    
    document.querySelectorAll('input[name="room"]').forEach((input) => {
        input.addEventListener('change', function() {
            roomChoose = this.value; // Cập nhật bộ lọc hiện tại từ giá trị của input radio đã chọn
            
        });
    });
}
// 
function checkBooking(room) {
    
    if (room.bookingIds.length>0)
    {
        for (let i=0;i<room.bookingIds.length;i++) {
            console.log('Test: ',room.bookingIds[i]);
            var bookingInfo = getInfoBooking(room.bookingIds[i]);
            
            if (bookingInfo.id == bookingChoose.id) return true;
            if ((new Date(bookingChoose.checkInDate) >= new Date(bookingInfo.checkInDate) && new Date(bookingChoose.checkInDate) <= new Date(bookingInfo.checkOutDate)) || 
            (new Date(bookingChoose.checkOutDate) >= new Date(bookingInfo.checkInDate) && new Date(bookingChoose.checkOutDate) <= new Date(bookingInfo.checkOutDate))) 
            return false;
        }
    }
    return true;
    
}