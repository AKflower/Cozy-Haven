let listRoom;
let listRoomType;
let listBooking;
var booking;
var room, roomType, lengthWaiting;

const urlParams = new URLSearchParams(window.location.search);
var roomId = urlParams.get('room');


document.addEventListener('DOMContentLoaded', function() {
    function fetchDataAndDisplay(){
        fetch('../../data/data.json')
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
            room = listRoom.find(ele => ele.id == roomId);
            roomType = getInfoTypeRoom(room.roomTypeId);

            
            var page = document.getElementById('page');

            //Hiển thị title
            var title = document.getElementById('page__title');
            var span = document.createElement('span');
            span.style.color='silver'
            span.innerHTML= ` #${roomId}`
            title.appendChild(span);
            //Hiển thị tình trạng đặt phòng
            var bookingStatus = document.createElement('h5')
            bookingStatus.id = 'bookingStatus';
            bookingStatus.innerHTML = `
                Số đơn đặt phòng: ${room.bookingIds.length}
            `;
            page.appendChild(bookingStatus)
            //Hiển thị danh sách đã book
            
            booking = getInfoBooking(room.bookingIds[0]);
            var selectBooked = document.createElement('select');
            selectBooked.id = 'selectBooked';

            if (room.bookingIds.length>0) room.bookingIds.forEach((booking) => {
                var bookingInfo = getInfoBooking(booking);
                console.log('Hi',booking,bookingInfo);
                var option = document.createElement('option');
                option.value = bookingInfo.id;
                option.innerHTML= `
                    ${bookingInfo.customerName} (${formatDate(bookingInfo.checkInDate)} - ${formatDate(bookingInfo.checkOutDate)})
                `;
                selectBooked.appendChild(option);
            })

            page.appendChild(selectBooked);
            if (room.bookingIds.length==0) selectBooked.style.display = 'none';
            selectBooked.addEventListener('change',function() {
                booking= getInfoBooking(this.value);
                reRender();
            });
            
        
            
            //Hiển thị thông tin phòng
            
            var roomItem = document.createElement('div');
            roomItem.className='room__detail row row-cols-2';

            roomItem.innerHTML=`
                <img src=.${roomType.imageSrc} alt="" class="col" id="img">
                <div class="col" id="room-booking-infor">
                    <h3 class="">Phòng ${room.id} - ${roomType.name} <button class="btn btn-success"  data-bs-toggle="modal" data-bs-target="#editRoom">Edit</button><button class="btn btn-danger"  data-bs-toggle="modal" data-bs-target="#deleteRoom">Delete</button></h3>
                    <p class="capacity">
                        <span class="">
                            <svg fill="#9e9e9e" width="30px" height="30px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#9e9e9e"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M23.313 26.102l-6.296-3.488c2.34-1.841 2.976-5.459 2.976-7.488v-4.223c0-2.796-3.715-5.91-7.447-5.91-3.73 0-7.544 3.114-7.544 5.91v4.223c0 1.845 0.78 5.576 3.144 7.472l-6.458 3.503s-1.688 0.752-1.688 1.689v2.534c0 0.933 0.757 1.689 1.688 1.689h21.625c0.931 0 1.688-0.757 1.688-1.689v-2.534c0-0.994-1.689-1.689-1.689-1.689zM23.001 30.015h-21.001v-1.788c0.143-0.105 0.344-0.226 0.502-0.298 0.047-0.021 0.094-0.044 0.139-0.070l6.459-3.503c0.589-0.32 0.979-0.912 1.039-1.579s-0.219-1.32-0.741-1.739c-1.677-1.345-2.396-4.322-2.396-5.911v-4.223c0-1.437 2.708-3.91 5.544-3.91 2.889 0 5.447 2.44 5.447 3.91v4.223c0 1.566-0.486 4.557-2.212 5.915-0.528 0.416-0.813 1.070-0.757 1.739s0.446 1.267 1.035 1.589l6.296 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.809zM30.312 21.123l-6.39-3.488c2.34-1.841 3.070-5.459 3.070-7.488v-4.223c0-2.796-3.808-5.941-7.54-5.941-2.425 0-4.904 1.319-6.347 3.007 0.823 0.051 1.73 0.052 2.514 0.302 1.054-0.821 2.386-1.308 3.833-1.308 2.889 0 5.54 2.47 5.54 3.941v4.223c0 1.566-0.58 4.557-2.305 5.915-0.529 0.416-0.813 1.070-0.757 1.739 0.056 0.67 0.445 1.267 1.035 1.589l6.39 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.779h-4.037c0.61 0.46 0.794 1.118 1.031 2h3.319c0.931 0 1.688-0.757 1.688-1.689v-2.503c-0.001-0.995-1.689-1.691-1.689-1.691z"></path> </g></svg>
                        </span>
                        <span class="">${roomType.capacityAdult} người lớn - ${roomType.capacityChildren} trẻ em</span>
                    </p>
                    <p class="price">
                        ${roomType.price} VND/đêm
                    </p>
                    <hr>
                    ${  room.bookingIds.length>0 ?
                        '<h3 class="">'+ booking.customerName +' </h3>'+
                        '<p class=""><span>Số điện thoại: ' + booking.phone + '</span><span class=""> - Email: '+ booking.email+ '</span></p>'+
                        '<p class="">'+ formatDate(booking.checkInDate) + ' - ' + formatDate(booking.checkOutDate) +'</p>'+
                        '<p class="">Tổng tiền: '+ calculateBill(booking.checkInDate,booking.checkOutDate) +' VND</p>' : '<h1>Đang trống</h1>'
                    }
                    ${  room.bookingIds.length>0 ? '<button class="btn btn-danger"  data-bs-toggle="modal" data-bs-target="#deleteInfor">Delete Booking</button>' : ''} 
                </div>
            `;
            
            page.appendChild(roomItem);

            // Hiển thị danh sách các booking khác phù hợp với thời gian và loại phòng
            var listBookingWaiting = listBooking.filter(booking => !booking.isDeal && new Date(booking.checkInDate)>= new Date() && booking.roomTypeId == roomType.id &&  checkBooking(booking.checkInDate,booking.checkOutDate));
            lengthWaiting = listBookingWaiting.length;
            var h3 = document.createElement('h3');
            h3.id = 'book-fit';
            h3.innerHTML=`Đơn đặt phòng phù hợp: ${lengthWaiting}`
            page.appendChild(h3)
            if (listBookingWaiting.length)
            {
                var tableBooking = document.createElement('table')
                tableBooking.id = 'booking-table';
                tableBooking.innerHTML =`
                <thead class="">
                    <tr class="">
                        <th class="">Họ tên</th>
                        <th class="">Số điện thoại</th>
                        <th class="">Email</th>
                        <th class="">Ngày nhận phòng</th>
                        <th class="">Ngày trả phòng</th>
                        <th class=""></th>
                    </tr>
                </thead>`;
                //Lọc danh sách các booking đang chờ
                
                console.log(listBookingWaiting);
                var tbody = document.createElement('tbody');
                tbody.id = 'booking-tbody';
            }
            
            
            
            listBookingWaiting.forEach((booking) => {
                var tr = document.createElement('tr');
                tr.id = `booking-tr-${booking.id}`
                tr.innerHTML=`
                    <td class="">
                        ${booking.customerName}
                    </td>
                    <td class="">
                    ${booking.phone}
                    </td>
                    <td class="">
                    ${booking.email}
                    </td>
                    <td class="">
                    ${formatDate(booking.checkInDate)}
                    </td>
                    <td class="">
                    ${formatDate(booking.checkOutDate)}
                    </td>
                    <td class=""><button class="btn btn-primary" id="btn-book-${booking.id}">Book</button></td>
                `;
                tbody.appendChild(tr)
            })
            tableBooking.appendChild(tbody);
            page.appendChild(tableBooking);
            listBookingWaiting.forEach((bookWaiting) => {
                document.getElementById(`btn-book-${bookWaiting.id}`).addEventListener('click', function() {
                    var bookingInfo = listBooking.find(item => item.id == bookWaiting.id);
                    bookingInfo.isDeal = true;
                    if (room.bookingIds.length<=1) room.bookingIds.push(bookWaiting.id);
                    else
                    {   
                        var index=room.bookingIds.length-1;
                        for (let i=0;i<room.bookingIds.length-1;i++) {
                            var bookingCheck = getInfoBooking(room.bookingIds[i])
                            var bookingNextCheck = getInfoBooking(room.bookingIds[i+1])
                            if (new Date(bookingInfo.checkInDate)>new Date(bookingCheck.checkInDate) && new Date(bookingInfo.checkInDate)<new Date(bookingNextCheck.checkInDate)) 
                                {
                                    index = i+1;
                                    break;
                                }
                        }   
                        console.log(index);
                        room.bookingIds.splice(index, 0, bookingInfo.id);
                    }
                    //Xóa phần tử đã book
                    var trDelete = document.getElementById(`booking-tr-${bookingInfo.id}`);
                    trDelete.remove();

                    //Cộng 1 vào danh sách
                    var bookingStatus = document.getElementById('bookingStatus');
                    bookingStatus.innerHTML = `Số đơn đặt phòng: ${room.bookingIds.length}`;
                    //Trừ 1 khỏi danh sách chờ
                    var h3 = document.getElementById('book-fit')
                    lengthWaiting--;
                    h3.innerHTML=`Đơn đặt phòng phù hợp: ${lengthWaiting}`;
                    if (lengthWaiting==0) document.getElementById('booking-table').style.display='none';
                    //Hiển thị lại select
        
                    var selectBooked = document.getElementById('selectBooked');
                    selectBooked.innerHTML=''; //Xóa các option
                    room.bookingIds.forEach((booking) => {
                        var bookingInfo = getInfoBooking(booking);
                        console.log('Hi',booking,bookingInfo);
                        var option = document.createElement('option');
                        option.value = bookingInfo.id;
                        option.innerHTML= `
                            ${bookingInfo.customerName} (${formatDate(bookingInfo.checkInDate)} - ${formatDate(bookingInfo.checkOutDate)})
                        `;
                        selectBooked.appendChild(option);
                    })
                    
                    if (selectBooked.style.display=='none') selectBooked.style.display='block';
                    selectBooked.value= bookingInfo.id;
                    booking = bookingInfo;
                    reRender()
                    
                });
            });
            //Đổi thông tin phòng
            document.getElementById('edit-room').value=roomId;
        
            var roomTypeSelectModal = document.getElementById('roomTypeSelectModal');
            
            listRoomType.forEach((roomType) => {
                var optionModal = document.createElement('option');
                optionModal.value=roomType.id;
                optionModal.innerHTML=`${roomType.name}`
                roomTypeSelectModal.appendChild(optionModal);
                
            })
            roomTypeSelectModal.value = roomType.id;
            document.getElementById('change-btn').addEventListener('click', function() {
                var room = document.getElementById('edit-room');
                room.style.border = '1px solid silver';
                var roomType = document.getElementById('roomTypeSelectModal');
                if (roomId === room.value) {
                    changeRoomInfor(roomId,room.value,roomType.value)
                    var closeBtn = document.getElementById('close-btn-edit');
                    closeBtn.click();
                    showToast();
                }
                else if (checkRoomName(room.value)) {
                    changeRoomInfor(roomId,room.value,roomType.value)
                    var closeBtn = document.getElementById('close-btn');
                    closeBtn.click();
                    showToast();
                }
                else room.style.border = '1px solid red';

            })
            
            //Xóa phòng
            document.getElementById('delete-btn').addEventListener('click', function() {
                listRoom = listRoom.filter(room => room.id !=roomId);
        
                var closeBtn = document.getElementById('close-btn-delete-room');
                closeBtn.click();
            
                page.innerHTML=`
                    <div class="notification">
                        <h1>Phòng đã xóa, trở lại trang chủ sau 3 giây!</h1>
                    </div>
                `
                setTimeout(()=> {
                    window.location.href='index.html'
                },3000)
            })
            //Xóa đơn đặt phòng
            document.getElementById('delete-infor-btn').addEventListener('click', function() {
                room.bookingIds = room.bookingIds.filter(bookingId => bookingId != booking.id);
                console.log(room.bookingIds)
                var closeBtn = document.getElementById('close-btn-delete-infor');
                closeBtn.click();
                booking=getInfoBooking(room.bookingIds[0]);
                var selectBooked = document.getElementById('selectBooked');
                selectBooked.innerHTML='';
                if (room.bookingIds.length>0) {
                    room.bookingIds.forEach((booking) => {
                    var bookingInfo = getInfoBooking(booking);
                    
                    var option = document.createElement('option');
                    option.value = bookingInfo.id;
                    option.innerHTML= `
                        ${bookingInfo.customerName} (${formatDate(bookingInfo.checkInDate)} - ${formatDate(bookingInfo.checkOutDate)})
                    `;
                    selectBooked.appendChild(option);
                    
                })
                
                }
                else selectBooked.style.display='none';
                reRender()
                console.log('test: ',room.bookingIds)
                var bookingStatus = document.getElementById('bookingStatus')
                    bookingStatus.innerHTML = `
                    Số đơn đặt phòng: ${room.bookingIds.length}
                `;
            
                
            })
        })
        .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        });
    }
    fetchDataAndDisplay()

})
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
//Đổi thành ngày tháng năm
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
//Render giao diện khi thay đổi
function reRender(){
        
       var roomBookingInfor = document.getElementById('room-booking-infor')
       roomBookingInfor.innerHTML=`
     
                <h3 class="">Phòng ${room.id} - ${roomType.name} <button class="btn btn-success"  data-bs-toggle="modal" data-bs-target="#editRoom">Edit</button><button class="btn btn-danger"  data-bs-toggle="modal" data-bs-target="#deleteRoom">Delete</button></h3>
                <p class="capacity">
                    <span class="">
                        <svg fill="#9e9e9e" width="30px" height="30px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#9e9e9e"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M23.313 26.102l-6.296-3.488c2.34-1.841 2.976-5.459 2.976-7.488v-4.223c0-2.796-3.715-5.91-7.447-5.91-3.73 0-7.544 3.114-7.544 5.91v4.223c0 1.845 0.78 5.576 3.144 7.472l-6.458 3.503s-1.688 0.752-1.688 1.689v2.534c0 0.933 0.757 1.689 1.688 1.689h21.625c0.931 0 1.688-0.757 1.688-1.689v-2.534c0-0.994-1.689-1.689-1.689-1.689zM23.001 30.015h-21.001v-1.788c0.143-0.105 0.344-0.226 0.502-0.298 0.047-0.021 0.094-0.044 0.139-0.070l6.459-3.503c0.589-0.32 0.979-0.912 1.039-1.579s-0.219-1.32-0.741-1.739c-1.677-1.345-2.396-4.322-2.396-5.911v-4.223c0-1.437 2.708-3.91 5.544-3.91 2.889 0 5.447 2.44 5.447 3.91v4.223c0 1.566-0.486 4.557-2.212 5.915-0.528 0.416-0.813 1.070-0.757 1.739s0.446 1.267 1.035 1.589l6.296 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.809zM30.312 21.123l-6.39-3.488c2.34-1.841 3.070-5.459 3.070-7.488v-4.223c0-2.796-3.808-5.941-7.54-5.941-2.425 0-4.904 1.319-6.347 3.007 0.823 0.051 1.73 0.052 2.514 0.302 1.054-0.821 2.386-1.308 3.833-1.308 2.889 0 5.54 2.47 5.54 3.941v4.223c0 1.566-0.58 4.557-2.305 5.915-0.529 0.416-0.813 1.070-0.757 1.739 0.056 0.67 0.445 1.267 1.035 1.589l6.39 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.779h-4.037c0.61 0.46 0.794 1.118 1.031 2h3.319c0.931 0 1.688-0.757 1.688-1.689v-2.503c-0.001-0.995-1.689-1.691-1.689-1.691z"></path> </g></svg>
                    </span>
                    <span class="">${roomType.capacityAdult} người lớn - ${roomType.capacityChildren} trẻ em</span>
                </p>
                <p class="price">
                    ${roomType.price} VND/đêm
                </p>
                <hr>
                ${  room.bookingIds.length>0 ?
                    '<h3 class="">'+ booking.customerName +'</h3>'+
                    '<p class=""><span>Số điện thoại: ' + booking.phone + '</span><span class=""> - Email: '+ booking.email+ '</span></p>'+
                    '<p class="">'+ formatDate(booking.checkInDate) + ' - ' + formatDate(booking.checkOutDate) +'</p>'+
                    '<p class="">Tổng tiền: '+ calculateBill(booking.checkInDate,booking.checkOutDate) +' VND</p>' : '<h1>Đang trống</h1>'
                }
                ${  room.bookingIds.length>0 ? '<button class="btn btn-danger"  data-bs-toggle="modal" data-bs-target="#deleteInfor">Delete Booking</button>' : ''} 
 
        `;
}
//Tính tổng số tiền khách phải trả
function calculateBill(checkInDate,checkOutDate) {
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);

    // Tính số ngày giữa hai ngày
    const differenceInTime = endDate - startDate;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    const numberPrice = parseInt(roomType.price.replace(/\./g, ''), 10);
    const totalBill = differenceInDays*numberPrice;
    console.log(differenceInDays);
    console.log(totalBill);
  
    return totalBill.toLocaleString('vi-VN');
}
// Kiểm tra đơn đặt phòng có phù hợp với phòng hay không
function checkBooking(checkInDate,checkOutDate) {

    for (let i=0;i<room.bookingIds.length;i++) {
        var bookingInfo = getInfoBooking(room.bookingIds[i]);
        if ((new Date(checkInDate) >= new Date(bookingInfo.checkInDate) && new Date(checkInDate) <= new Date(bookingInfo.checkOutDate)) || 
        (new Date(checkOutDate) >= new Date(bookingInfo.checkInDate) && new Date(checkOutDate) <= new Date(bookingInfo.checkOutDate))) 
        return false;
    }
    return true;
    
}
// Kiểm tra roomName có bị trùng hay không
function checkRoomName(id) {
    var room = listRoom.find(room => room.id ==id);
    if (room!=null) return false;
    return true;
}
// Đổi thông tin phòng
function changeRoomInfor(oldId,newId,type) {
    
    var roomInfor = listRoom.find(room => room.id==oldId)
    roomInfor.id = newId;
    roomInfor.roomTypeId=type;
    roomId = newId;
    room = roomInfor;
    roomType= getInfoTypeRoom(type);
    var image = document.getElementById('img').src='.'+roomType.imageSrc;
    reRender();
}