function saveData() {
    const data = {
        knowledge: [],
        totalScore: totalScore,
        timestamp: Date.now() // Lưu thời gian hiện tại
    };
    
    document.querySelectorAll('#summary-list li').forEach(item => {
        data.knowledge.push({
            name: item.dataset.name,
            points: parseInt(item.dataset.maxPoints),
            score: parseInt(item.dataset.score)
        });
    });
    
    localStorage.setItem('learningData', JSON.stringify(data));
}

// Hàm tải dữ liệu từ LocalStorage
function loadData() {
    const savedData = localStorage.getItem('learningData');
    if (savedData) {
        const data = JSON.parse(savedData);
        const now = Date.now();
        const expiryTime = 24 * 60 * 60 * 1000; // 24 giờ
        
        if (now - data.timestamp < expiryTime) {
            totalScore = data.totalScore;
            document.getElementById('total-score').innerText = totalScore;
            const summaryList = document.getElementById('summary-list');
            
            data.knowledge.forEach(item => {
                const listItem = document.createElement('li');
                listItem.dataset.name = item.name;
                listItem.dataset.maxPoints = item.points;
                listItem.dataset.score = item.score;
                listItem.innerText = `${item.name}: ${item.points}/5 - Điểm: ${item.score}`;
                summaryList.appendChild(listItem);
            });
        } else {
            localStorage.removeItem('learningData'); // Xóa nếu hết hạn
        }
    }
}

// Gọi hàm loadData() khi trang tải lại
window.onload = loadData;

// Gọi saveData() sau mỗi lần cập nhật
function updateSummary(name, points, score) {
    const summaryList = document.getElementById('summary-list');
    let items = summaryList.getElementsByTagName('li');
    
    for (let item of items) {
        if (item.dataset.name === name) {
            totalScore += score - parseInt(item.dataset.score);
            item.dataset.score = score;
            item.innerText = `${name}: ${points}/${item.dataset.maxPoints} - Điểm: ${score}`;
            document.getElementById('total-score').innerText = totalScore;
            saveData(); // Lưu sau khi cập nhật
            return;
        }
    }
    
    const listItem = document.createElement('li');
    listItem.dataset.name = name;
    listItem.dataset.maxPoints = 5;
    listItem.dataset.score = score;
    listItem.innerText = `${name}: ${points}/5 - Điểm: ${score}`;
    summaryList.appendChild(listItem);
    
    totalScore += score;
    document.getElementById('total-score').innerText = totalScore;
    saveData(); // Lưu sau khi cập nhật
}

        let totalScore = 0; // Biến tổng điểm của ngày hôm nay

        function addKnowledge() {
            const knowledgeList = document.getElementById('knowledge-list');
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.placeholder = 'Nhập tên kiến thức';
            
            const pointsContainer = document.createElement('div');
            pointsContainer.className = 'points';
            
            let points = 0;
            let maxPoints = 5;
            let score = 0;
            let pointElements = [];
            
            for (let i = 0; i < maxPoints; i++) {
                const point = document.createElement('div');
                point.className = 'point';
                pointsContainer.appendChild(point);
                pointElements.push(point);
            }
            
            const button = document.createElement('button');
            button.innerText = 'Học';
            button.onclick = function () {
                if (points < maxPoints) {
                    pointElements[points].classList.add('filled');
                    points++;
                    score += 10;
                    
                    if (points === 5) {
                        score = Math.floor(score * 1.25);
                    } else if (points === 10) {
                        score = Math.floor(score * 1.34);
                    } else if (points === 20) {
                        score = Math.floor(score * 1.6);
                    }
                    
                    updateSummary(nameInput.value || 'Kiến thức chưa đặt tên', points, score);
                }
            };
            
            const knowledgeItem = document.createElement('div');
            knowledgeItem.className = 'knowledge-item';
            knowledgeItem.appendChild(nameInput);
            knowledgeItem.appendChild(pointsContainer);
            knowledgeItem.appendChild(button);
            knowledgeList.appendChild(knowledgeItem);
            
            nameInput.addEventListener('change', function () {
                const existingItems = document.querySelectorAll('#summary-list li');
                for (let item of existingItems) {
                    if (item.dataset.name === nameInput.value) {
                        if (confirm('Bạn đã vượt quá mục tiêu trong ngày! Bạn có muốn tăng tiến độ lên không?')) {
                            maxPoints = 20;
                            while (pointElements.length < maxPoints) {
                                const point = document.createElement('div');
                                point.className = 'point';
                                pointsContainer.appendChild(point);
                                pointElements.push(point);
                            }
                        }
                        break;
                    }
                }
            });
        }
        
        function updateSummary(name, points, score) {
            const summaryList = document.getElementById('summary-list');
            let items = summaryList.getElementsByTagName('li');
            
            for (let item of items) {
                if (item.dataset.name === name) {
                    totalScore += score - parseInt(item.dataset.score); // Cập nhật tổng điểm
                    item.dataset.score = score;
                    item.innerText = `${name}: ${points}/${item.dataset.maxPoints} - Điểm: ${score}`;
                    document.getElementById('total-score').innerText = totalScore; // Hiển thị tổng điểm
                    return;
                }
            }
            
            const listItem = document.createElement('li');
            listItem.dataset.name = name;
            listItem.dataset.maxPoints = 5;
            listItem.dataset.score = score;
            listItem.innerText = `${name}: ${points}/5 - Điểm: ${score}`;
            summaryList.appendChild(listItem);

            totalScore += score; // Cộng điểm vào tổng điểm
            document.getElementById('total-score').innerText = totalScore; // Cập nhật điểm trên giao diện
        }
        function changeColor(color) {
            document.body.classList.add("fade-out"); // Làm mờ trước khi đổi màu
        
            setTimeout(() => {
                document.body.style.background = color;
                document.body.classList.remove("fade-out"); // Hiển thị lại màu mới
            }, 500); // Đợi 0.5s trước khi đổi màu
        }

let lastScrollY = window.scrollY;
let colorPalette = document.querySelector(".color-palette");
let timeout;

window.addEventListener("scroll", () => {
    clearTimeout(timeout); // Xóa timer trước đó nếu có
    colorPalette.classList.add("show"); // Hiện bảng màu khi cuộn

    // Ẩn lại sau 2 giây nếu không cuộn nữa
    timeout = setTimeout(() => {
        colorPalette.classList.remove("show");
    }, 2000);
});

