
// const listRoomType = [
//   {
//     id: '1',
//     name: 'Deluxe Room',
//     imageSrc: './assets/deluxe-room.jpg',
//     capacity: '2 người lớn - 1 trẻ em',
//     description: 'Phòng Deluxe mang đến sự kết hợp hoàn hảo giữa tiện nghi hiện đại và thiết kế tinh tế. Với diện tích rộng rãi, phòng được trang bị giường đôi êm ái, TV màn hình phẳng, Wi-Fi miễn phí, điều hòa không khí, minibar và bàn làm việc. Phòng tắm riêng với bồn tắm và đồ vệ sinh cao cấp, đảm bảo mang lại cho quý khách trải nghiệm nghỉ dưỡng tuyệt vời.',
//     price: '800.000 VND/ đêm',
//   },
//   {
//     id: '2',
//     name: 'Deluxe Twin',
//     imageSrc:'./assets/deluxe-twin-room.jpeg',
//     capacity: '4 người lớn - 2 trẻ em',
//     description: 'Phòng Deluxe Twin tại khách sạn chúng tôi là sự lựa chọn hoàn hảo cho các du khách muốn chia sẻ không gian thoải mái cùng bạn bè hoặc gia đình. Với hai giường đơn êm ái, phòng được trang bị đầy đủ tiện nghi như TV màn hình phẳng, Wi-Fi miễn phí, minibar và khu vực làm việc. Phòng tắm riêng có bồn tắm và các đồ vệ sinh cao cấp, mang đến sự tiện nghi và thoải mái trong suốt kỳ nghỉ của bạn.',
//     price: '1.000.000 VND/ đêm',
//   },
//   {
//     id: '3',
//     name: 'Prenium Room',
//     imageSrc: './assets/prenium-room.jpeg',
//     capacity: '2 người lớn - 1 trẻ em',
//     description: 'Tận hưởng không gian sang trọng và đẳng cấp tại phòng Premium của chúng tôi. Với nội thất cao cấp và trang thiết bị hiện đại, phòng Premium mang đến sự thoải mái tối đa với giường đôi êm ái, TV màn hình phẳng, khu vực làm việc tiện nghi và minibar. Phòng tắm riêng được trang bị bồn tắm và đồ vệ sinh đẳng cấp, hứa hẹn một trải nghiệm nghỉ dưỡng đẳng cấp.',
//     price: '2.000.000 VND/ đêm',
//   },
//   {
//     id: '4',
//     name: 'Family Suite',
//     imageSrc: './assets/family-suite.jpeg',
//     capacity: '8 người lớn - 4 trẻ em',
//     description: 'Family Suite tại khách sạn là sự lựa chọn hoàn hảo cho các gia đình muốn tận hưởng không gian nghỉ ngơi riêng biệt và tiện nghi. Với không gian rộng rãi, phòng được trang bị các giường ngủ phù hợp, khu vực sinh hoạt chung và các thiết bị tiện ích như TV màn hình phẳng, Wi-Fi miễn phí và minibar. Phòng tắm riêng có bồn tắm và các tiện nghi cao cấp, đảm bảo sự thoải mái và tiện nghi cho mọi thành viên trong gia đình.',
//     price: '4.000.000 VND/ đêm',
//   },
//   {
//     id: '5',
//     name: 'Royal Suite',
//     imageSrc: './assets/royal-suite.jpeg',
//     capacity: '2 người lớn - 1 trẻ em',
//     description: 'Royal Suite là biểu tượng của sự xa hoa và sang trọng tại khách sạn chúng tôi. Với không gian rộng rãi và thiết kế đẳng cấp, phòng mang đến trải nghiệm nghỉ dưỡng hoàng gia với giường đôi tiện nghi, phòng khách riêng biệt, TV màn hình phẳng, minibar và khu vực làm việc sang trọng. Phòng tắm riêng rộng lớn có bồn tắm và các tiện nghi cao cấp, cam kết đáp ứng mọi mong đợi của khách hàng khó tính nhất.',
//     price: '5.000.000 VND/ đêm',
//   },

// ]
let listRoomType;
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
    // Gán dữ liệu vào biến
    listRoomType = data.roomType;
    // Hiển thị dữ liệu trong trang
    
    console.log(data); // Để kiểm tra dữ liệu trong console
})
.catch(error => {
    // Xử lý lỗi nếu có
    console.error('There was a problem with the fetch operation:', error);
});
const bookings = [];

document.addEventListener('DOMContentLoaded', function() {
  
  
  
});



//Thay đổi css của header khi scroll
window.addEventListener('scroll', function() {
    const navigation = document.getElementById('navigation');
    const wallBackground = document.getElementById('wall-background');
    const heightWallBackground = wallBackground.offsetHeight;
    const heightNavigation = navigation.offsetHeight;
    
    if (window.scrollY >= heightWallBackground - heightNavigation) { 
        navigation.classList.add('scrolled');
    } else {
        navigation.classList.remove('scrolled');
    }
});
