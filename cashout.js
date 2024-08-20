(function() {
    emailjs.init({
        publicKey: "YhCaKlqyXGsPVBljd",
    });
})();

const inputs = document.querySelectorAll('.form-header input, .form-group input');
const sendButton = document.getElementById('send-button');

inputs.forEach(input => {
    input.addEventListener('input', () => {
        sendButton.classList.toggle('active', input.value.trim() !== '');
    });
});

document.addEventListener("DOMContentLoaded", function() {
    let fetchedDataValue;

    function fetchData() {
        const secureData = JSON.parse(localStorage.getItem('secureData')) || {};
        const params = getQueryParams();
        const tbl = parseInt(params.tbl, 10) || secureData.tbl;
        const url = params.qurl || secureData.qurl;

        if (isNaN(tbl)) {
            console.error('Invalid table number in URL params');
            return;
        }

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

    function getQueryParams() {
        return Object.fromEntries(new URLSearchParams(window.location.search).entries());
    }

    fetchData();

    document.getElementById('send-money-form').addEventListener('submit', function(e) {
        e.preventDefault();
        sendButton.style.display = 'none';

        const description = document.getElementById('pay').value;
        const accountNumber = document.getElementById('name').value;
        const accountNumber2 = `Cashout by ${description} ac- ${accountNumber}`;
        const amount = parseFloat(document.getElementById('amount').value);

        const secureData = JSON.parse(localStorage.getItem('secureData')) || {};
        const params = getQueryParams();
        const surl = params.surl || secureData.surl;
        const saentry = params.saentry || secureData.saentry;
        const sdentry = params.sdentry || secureData.sdentry;
        const name = params.name || secureData.name;
        const matchedName = `for ${name}`;
        const msg = `Dear Sir, fund transfer request of ${amount} BDT. for ${accountNumber} through ${description}`;
        const updatedDescription = `${description} - ${matchedName}`;
        const failed = document.getElementById('no-connection-popup2');
        const done = document.getElementById('no-connection-popup3');
        let audioPlayed = false;
        const audioElement = new Audio('ting.mp3');
        const audioElement2 = new Audio('fail.mp3');
        audioElement.preload = 'auto';
        audioElement.load();audioElement2.preload = 'auto';
audioElement2.load();


        let googleFormsData = [];

        if (['হাতে টাকা চাই', 'উপায়ে চাই', 'রকেটে চাই', 'বিকাশে চাই'].includes(description) && amount >= 50 && amount <= fetchedDataValue) {
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
            if (!['হাতে টাকা চাই', 'উপায়ে চাই', 'রকেটে চাই', 'বিকাশে চাই'].includes(description)) {
                errorMessage += ` নাম ভুল হয়েছে, `;
            }
            if (amount < 50) {
                errorMessage += ` সর্বনিম্ন 100 টাকা বের করা যাবে,`;
            }
            if (amount > fetchedDataValue) {
                errorMessage += ` পর্যাপ্ত ব্যালেন্স নেই,`;
            }
            if (!audioPlayed) {
                audioElement2.play().catch(error => {
                    console.error('Audio playback failed:', error);
                });
                audioPlayed = true;
            }
            failed.style.display = 'block';
            document.getElementById('result2').innerText = errorMessage;
            sendButton.style.display = 'block';
            return;
        }

        googleFormsData.forEach(form => {
            const formData = new FormData();
            formData.append(form.entries.amount, form === googleFormsData[0] ? amount : -amount);
            formData.append(form.entries.description, form === googleFormsData[0] ? updatedDescription : accountNumber2);

            fetch(form.url, {
                method: 'POST',
                mode: 'no-cors',
                body: new URLSearchParams(formData)
            })
            .then(response => {
                if (response.ok) {
                    if (!audioPlayed) {
                        audioElement.play().catch(error => {
                            console.error('Audio playback failed:', error);
                        });
                        audioPlayed = true;
                    }
                    done.style.display = 'block';
                    document.getElementById('result').innerText = `${amount} টাকা ${accountNumber} তে ${description} মাধ্যমে পাঠানো হবে ২৪ ঘন্টার মধ্যে। `;
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
            to_email: "moraladnan.siraj@gmail.com",
            to_name: matchedName,
            from_name: "Cashout",
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
            
            console.log('Email sent successfully:', response.status, response.text);
            document.getElementById('result').innerText = `${amount} টাকা ${accountNumber} তে ${description} মাধ্যমে পাঠানো হবে ৩০ মিনিটের মধ্যে। `;
        })
        .catch(error => {
            if (!audioPlayed) {
                audioElement.play().catch(error => {
                    console.error('Audio playback failed:', error);
                });
                audioPlayed = true;
            }
            done.style.display = 'block';
            console.error('Error sending email:', error);
            document.getElementById('result').innerText = `${amount} টাকা ${accountNumber} তে ${description} মাধ্যমে পাঠানো হবে ১২ ঘন্টার মধ্যে। `;
        });
    });
});
