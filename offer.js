        document.addEventListener("DOMContentLoaded", function() {
    let fetchedDataValue1, fetchedDataValue2, fetchedDataValue3;

    function fetchData1() {
        const url = 'https://docs.google.com/spreadsheets/u/0/d/1U72BoHdSqC1E_orTmcBYDShbQfErO9X-wQrPyBTzkTs/htmlview';

        fetch(url)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const cellElement = doc.querySelector('table tbody tr:nth-child(3) td:nth-child(2)');
                if (cellElement) {
                    const cellText = cellElement.innerText || cellElement.textContent;
                    fetchedDataValue1 = parseFloat(cellText.trim());
                    console.log('Fetched data1:', fetchedDataValue1);
                } else {
                    console.error('Error: Cell element not found for data1');
                }
            })
            .catch(error => console.error('Error fetching data1:', error));
    }

    function fetchData2() {
        const url = 'https://docs.google.com/spreadsheets/u/0/d/1U72BoHdSqC1E_orTmcBYDShbQfErO9X-wQrPyBTzkTs/htmlview';

        fetch(url)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const cellElement = doc.querySelector('table tbody tr:nth-child(3) td:nth-child(3)');
                if (cellElement) {
                    const cellText = cellElement.innerText || cellElement.textContent;
                    fetchedDataValue2 = parseFloat(cellText.trim());
                    console.log('Fetched data2:', fetchedDataValue2);
                } else {
                    console.error('Error: Cell element not found for data2');
                }
            })
            .catch(error => console.error('Error fetching data2:', error));
    }

    function fetchData3() {
        const url = 'https://docs.google.com/spreadsheets/u/0/d/1U72BoHdSqC1E_orTmcBYDShbQfErO9X-wQrPyBTzkTs/htmlview';

        fetch(url)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const cellElement = doc.querySelector('table tbody tr:nth-child(3) td:nth-child(4)');
                if (cellElement) {
                    const cellText = cellElement.innerText || cellElement.textContent;
                    fetchedDataValue3 = parseFloat(cellText.trim());
                    console.log('Fetched data3:', fetchedDataValue3);
                } else {
                    console.error('Error: Cell element not found for data3');
                }
            })
            .catch(error => console.error('Error fetching data3:', error));
    }

    fetchData1();
    fetchData2();
    fetchData3();

    document.getElementById('money-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const button = document.getElementById('send-button');
        button.style.display = 'none';

        const code = document.getElementById('code').value;
        const amount = fetchedDataValue3;
        const amount2 = '-' + amount;
        const description = 'Bonus [Auto]';
let audioPlayed = false;
const audioElement = new Audio('ting.mp3');

// Preload the audio
audioElement.preload = 'auto';
audioElement.load();
const failed = document.getElementById('no-connection-popup2');
        const done = document.getElementById('no-connection-popup3');

    
                let googleFormsData = [];
// Retrieve and parse secureData from localStorage
const secureData = JSON.parse(localStorage.getItem('secureData'));
const id = secureData.id;
const surl = secureData.surl;
const saentry = secureData.saentry;
const sdentry = secureData.sdentry;

// Retrieve and parse storedData2 from localStorage
const storedData2 = parseFloat(localStorage.getItem('fetchedData2'));

// Check if fetchedDataValue2 equals storedData2
if (fetchedDataValue2 === storedData2) {
    console.log('Already collected, try again later.');
    document.getElementById('result').innerText = 'ইতিমধ্যে সংগ্রহ করা হয়েছে';
    button.style.display = 'block';
    return;
}

// Check if amount2 is greater than fetchedDataValue1
if (amount2 >= fetchedDataValue1) {
    console.log('Amount must be greater than fetched value.');
    document.getElementById('result').innerText = 'দুঃখিত, এই মুহূর্তে কোনো বোনাস নেই।';
    button.style.display = 'block';
    return;
}

// Check if id matches code
if (id === code) {
    googleFormsData = [
        {
            url: surl,
            entries: {
                amount: saentry,
                description: sdentry
            }
        }, {
            url: 'https://docs.google.com/forms/d/e/1FAIpQLScVz3veBlhP7zYsKPa5gem4u_H2bqftYiICVXON30VjxWMJOw/formResponse',
            entries: {
                amount: 'entry.1545135281',
                description: 'entry.31441046'
            }
        }
    ];

    // Store fetchedDataValue2 in localStorage
    localStorage.setItem('fetchedData2', fetchedDataValue2);
} else {
    console.log('Account number is not recognized. Form submission aborted.');
    document.getElementById('result').innerText = 'কার্ড নম্বর বৈধ নয়।  আপনার কার্ড সক্রিয় করুন |';
    button.style.display = 'none';
    return;
}
        googleFormsData.forEach((form, index) => {
            const formData = new FormData();
            formData.append(form.entries.amount, form === googleFormsData[0] ? amount : amount2);
            formData.append(form.entries.description, form === googleFormsData[0] ? description : code);

            fetch(form.url, {
                method: 'POST',
                mode: 'no-cors',
                body: new URLSearchParams(formData)
            })
                .then(response => {
                    if (!audioPlayed) {
            audioElement.play().catch(error => {
                console.error('Audio playback failed:', error);
            });
            audioPlayed = true;
        }done.style.display = 'block';
                    document.getElementById('result').innerText = `আপনি পেয়েছেন ${amount}৳ টাকা Bonus ✅`;
                })
                .catch(error => {
                    failed.style.display = 'block';if (!audioPlayed) {
            audioElement.play().catch(error => {
                console.error('Audio playback failed:', error);
            });
            audioPlayed = true;
        }
                    document.getElementById('result').innerText = `Error: ${error}`;
                });
        });

        button.style.display = 'none';
    });

    // Timer functionality
    let countdown = 5;
    const button = document.getElementById('send-button');

    const timer = setInterval(() => {
        if (countdown > 0) {
            xy = `Wait ${countdown}s`;
            animateText(xy, 'result', 'letter');
            result.style.color = 'red';
            countdown--;
        } else {
            clearInterval(timer);
            result.innerText = '';
            result.style.color = 'green';
            button.style.display = 'block';
        }
    }, 1000);
});
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


