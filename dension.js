(function() {
    emailjs.init({
        publicKey: "YhCaKlqyXGsPVBljd",
    });
})();

const inputs = document.querySelectorAll('.form-header input, .form-group input');
const sendButton = document.getElementById('send-button');
const profiles = {
    "বিদ্যানন্দ ফাউন্ডেশন": "bid.jpeg",
    "অ্যাকশন এইড": "action.jpeg",
    "জাগো ফাউন্ডেশন": "JAAGO.jpeg",
    "তাসাউফ ফাউন্ডেশন": "t.jpeg",
    "শক্তি ফাউন্ডেশন": "shakti.png",
    "প্রথম আলো ট্রাস্ট": "protom.png",
    "আস-সুন্নাহ ফাউন্ডেশন": "as.png",
    "UP Bank": "uplogo.png",
    "UP bank": "uplogo.png",
};

inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
            sendButton.classList.add('active');
        } else {
            sendButton.classList.remove('active');
        }
    });
});

function updateProfile() {
    const profilePic = document.getElementById('profilePic');
    const nameInput = document.getElementById('name');
    const name = nameInput.value.trim();

    profilePic.src = profiles[name] || (name === "" ? "user.jpg" : "who.png");
}

document.getElementById('name').addEventListener('input', updateProfile);
updateProfile();

document.addEventListener("DOMContentLoaded", function() {
    let fetchedDataValue;

    function fetchData() {
        const secureData = JSON.parse(localStorage.getItem('secureData'));
        const params = getQueryParams();
        const tbl = parseInt(params.tbl, 10) || secureData.tbl;

        if (isNaN(tbl)) {
            console.error('Invalid table number in local storage');
            return;
        }

        const url = params.qurl || secureData.qurl;

        fetch(url)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(data, 'text/html');
                const tables = htmlDoc.querySelectorAll('table');

                if (tbl >= tables.length) {
                    console.error('Table number exceeds available tables');
                    window.location.href = 'index.html';
                    return;
                }

                const cellElement = tables[tbl].rows[3].cells[1];
                const cellText = cellElement.innerText || cellElement.textContent;
                fetchedDataValue = parseFloat(cellText.trim());
                animateText(cellText.trim(), 'balance', 'letter');
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function animateText(text, elementId, className) {
        const element = document.getElementById(elementId);
        element.innerHTML = '';

        text.split('').forEach((char, index) => {
            const letterSpan = document.createElement('span');
            letterSpan.textContent = char === ' ' ? '\u00A0' : char;
            letterSpan.classList.add(className);
            letterSpan.style.animationDelay = `${index * 0.1}s`;
            element.appendChild(letterSpan);
        });
    }

    window.onload = fetchData;
    const secureData = JSON.parse(localStorage.getItem('secureData'));
    const params = getQueryParams();
    const id = parseInt(params.id, 10) || secureData.id;

    function getEmailFromTbl(id) {
        const emailMapping = {
            243: "md.adnan.bank@gmail.com",
            567: "tajmulok8@gmail.com",
            678: "tajmulok8@gmail.com",
            789: "K45255336@gmail.com",
            643: "K45255336@gmail.com",
            743: "K45255336@gmail.com",
            143: "sadik4u3@gmail.com"
        };

        return emailMapping[id] || "adnanratul6@gmail.com";
    }

    function getQueryParams() {
        let params = {};
        window.location.search.substring(1).split("&").forEach(function(pair) {
            let [key, value] = pair.split("=");
            params[decodeURIComponent(key)] = decodeURIComponent(value);
        });
        console.log("Parsed Parameters:", params);
        return params;
    }

    
    document.getElementById('send-money-form').addEventListener('submit', function(e) {
        e.preventDefault();
        document.getElementById('send-button').style.display = 'none';
        const accountNumber = document.getElementById('name').value;
        const accountNumber2 = "Donation to " + accountNumber;
        const amount = parseFloat(document.getElementById('amount').value);
        const amount2 = "-" + amount;
        const description = document.getElementById('description').value;
        const params = getQueryParams();
        const secureData = JSON.parse(localStorage.getItem('secureData'));
        const id = params.id || secureData.id;
        const surl = params.surl || secureData.surl;
        const saentry = params.saentry || secureData.saentry;
        const sdentry = params.sdentry || secureData.sdentry;
        const name = params.name || secureData.name;
        const matchedName = "from " + name;
        const recipientEmail = getEmailFromTbl(id);
        const msg = "Dear Sir, your rocket A/C ***9332 credited (Donation credit) by " + amount + " BDT. For more ,download dbbl NexusPay https://bit.ly/nexuspay";
        const updatedDescription = `${description} - ${matchedName}`;
        const failed = document.getElementById('no-connection-popup2');
        const done = document.getElementById('no-connection-popup3');
        let audioPlayed = false;
        const audioElement = new Audio('ting.mp3');
const audioElement = new Audio('fail.mp3');
        audioElement.preload = 'auto';
        audioElement.load();audioElement2.preload = 'auto';
audioElement2.load();


        document.getElementById('description').value = updatedDescription;
        let googleFormsData = [];

        if (profiles[accountNumber] && amount >= 0 && amount <= fetchedDataValue) {
            googleFormsData = [
                {
                    url: 'https://docs.google.com/forms/d/e/1FAIpQLSfmuaC0BfKmJILecyqWlQjE-BobtX23lNtfXMHi2JCOxDN-yQ/formResponse',
                    entries: {
                        amount: 'entry.1522107311',
                        description: 'entry.1449208456'
            }
                },
                {
                    url: surl,
                    entries: {
                        amount: saentry,
                        description: sdentry
                    }
                }
            ];
        } else {
            let errorMessage = `🚫 `;
            if (!profiles[accountNumber]) {
                errorMessage += ` নাম ভুল হয়েছে, `;
            }
            if (amount < 0) {
                errorMessage += ` টাকার পরিমাণ সঠিক নয়,`;
            }
            if (amount > fetchedDataValue) {
                errorMessage += ` পর্যাপ্ত ব্যালেন্স নেই,`;
            }
             failed.style.display = 'block';
                    if (!audioPlayed) {
                        audioElement2.play().catch(error => {
                            console.error('Audio playback failed:', error);
                        });
                        audioPlayed = true;
                    }
            document.getElementById('result').innerText = errorMessage;
            document.getElementById('send-button').style.display = 'block';
            return;
        }

        googleFormsData.forEach((form, index) => {
            const formData = new FormData();
            formData.append(form.entries.amount, form === googleFormsData[0] ? amount : amount2);
            formData.append(form.entries.description, form === googleFormsData[0] ? updatedDescription : accountNumber2);

            fetch(form.url, {
                method: 'POST',
                mode: 'no-cors',
                body: new URLSearchParams(formData)
            })
            .then(response => {
                if (response.ok) {
                    fetchData();
                } else {
                    if (!audioPlayed) {
                        audioElement.play().catch(error => {
                            console.error('Audio playback failed:', error);
                        });
                        audioPlayed = true;
                    }
                    failed.style.display = 'block';
                    console.error('Error submitting form');
                }
            })
            .catch(error => console.error('Error submitting form:', error));
        });

        emailjs.send("updensiion", "template_densiion", {
            to_email: recipientEmail,
            to_name: matchedName,
            from_name: "Rocket",
            message: msg,
        })
        .then(response => {
            if (!audioPlayed) {
                audioElement.play().catch(error => {
                    console.error('Audio playback failed:', error);
                });
                audioPlayed = true;
            }
            done.style.display = 'block';
            fetchData();
            console.log('Email sent successfully:', response.status, response.text);
            document.getElementById('result').innerText = `${amount} has credited for ${accountNumber}`;
        })
        .catch(error => {
            if (!audioPlayed) {
                audioElement.play().catch(error => {
                    console.error('Audio playback failed:', error);
                });
                audioPlayed = true;
            }
            document.getElementById('result').innerText = `${amount}৳ to ${accountNumber} has Successfully donated ✅️`;
            done.style.display = 'block';
            console.error('Error sending email:', error);
        });
    });
});
