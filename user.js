document.addEventListener("DOMContentLoaded", function () {
    const secureData = JSON.parse(localStorage.getItem('secureData'));

    if (!secureData || !secureData.qurl || !secureData.tbl) {
        console.error('Secure data, sheet link, or tbl value is missing');
        window.location.href = 'index.html';
        return;
    }

    const tbl = secureData.tbl;

    async function fetchData(sheetIndex, rowIndex, cellIndex, elementId, animationClass) {
        try {
            const response = await fetch(secureData.qurl);
            const data = await response.text();
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, 'text/html');
            const tables = htmlDoc.querySelectorAll('table');

            if (tables.length <= sheetIndex) {
                throw new Error(`Sheet index ${sheetIndex} out of bounds`);
            }

            const rows = tables[sheetIndex].rows;

            if (rows.length <= rowIndex) {
                throw new Error(`Row index ${rowIndex} out of bounds`);
            }

            const cells = rows[rowIndex].cells;

            if (cells.length <= cellIndex) {
                throw new Error(`Cell index ${cellIndex} out of bounds`);
            }

            const cellElement = cells[cellIndex];
            const cellText = cellElement.innerText || cellElement.textContent;
            
            if (animationClass) {
                animateText(cellText.trim(), elementId, animationClass);
            } else {
                document.getElementById(elementId).innerText = cellText.trim();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            window.location.href = 'index.html';
        }
    }

    async function fetchData4() {
        try {
            const url = 'https://docs.google.com/spreadsheets/d/1VvKwtRmRSLy-eLCQfeCDeN6xT_vv-Gw5CsXbjcwcpxw/htmlview';
            const response = await fetch(url);
            const data = await response.text();
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, 'text/html');
            const cellElement = htmlDoc.querySelector('table').rows[1].cells[10];
            const cellText = cellElement.innerText || cellElement.textContent;
            document.getElementById('balance4').innerText = cellText.trim();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function animateText(text, elementId, className) {
        const element = document.getElementById(elementId);
        element.innerHTML = ''; // Clear any existing content
        text.split('').forEach((char, index) => {
            const letterSpan = document.createElement('span');
            letterSpan.textContent = char === ' ' ? '\u00A0' : char; // Use non-breaking space for spaces
            letterSpan.classList.add(className);
            letterSpan.style.animationDelay = `${index * 0.1}s`;
            element.appendChild(letterSpan);
        });
    }

    fetchData(tbl, 3, 2, 'balance1', 'letter');
    fetchData(tbl, 3, 3, 'balance2', 'letter-wave');
    fetchData4();
    
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1VvKwtRmRSLy-eLCQfeCDeN6xT_vv-Gw5CsXbjcwcpxw/htmlview';
    const cellKey = 'sheetCellValue';

    function showPopup() {
        console.log("Showing popup");
        document.getElementById('popup').classList.add('active');
    }

    function closePopup() {
        console.log("Closing popup");
        document.getElementById('popup').classList.remove('active');
        localStorage.setItem('popupShown', 'true');
    }

    async function checkForNotification() {
        try {
            const response = await fetch(sheetUrl);
            const data = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const cellValue = doc.querySelector('table tbody tr:first-child td:nth-child(6)').innerText;
            console.log("Fetched cell value:", cellValue);

            const storedValue = localStorage.getItem(cellKey);
            console.log("Stored cell value:", storedValue);

            if (cellValue !== storedValue) {
                localStorage.setItem(cellKey, cellValue);
                localStorage.removeItem('popupShown');
            }

            if (localStorage.getItem('popupShown') !== 'true') {
                showPopup();
            }
        } catch (error) {
            console.error('Error fetching data from Google Sheets:', error);
        }
    }

    function takeData() {
        const secureData = JSON.parse(localStorage.getItem('secureData'));
        if (secureData) {
            document.getElementById('name').innerText = secureData.name;
            document.getElementById('mob').innerText = secureData.cvv;
            document.getElementById('password').innerText = secureData.password;
            const imgElement = document.getElementById('mypic');
            imgElement.src = secureData.img;
        } else {
            window.location.href = 'index.html';
        }
    }

    function clearData() {
        localStorage.removeItem('secureData');
        window.location.href = 'index.html';
    }

    document.getElementById('clearButton').addEventListener('click', clearData);

    window.onload = function () {
        checkForNotification();
        takeData();
    };
});
