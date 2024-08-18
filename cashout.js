(function() {
    emailjs.init({
        publicKey: "YhCaKlqyXGsPVBljd",
    });
})();

const inputs = document.querySelectorAll('.form-header input, .form-group input');
const sendButton = document.getElementById('send-button');
const descriptionLink = document.getElementById('description-link');
const descriptionField = document.getElementById('description-field');

inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
            sendButton.classList.add('active');
        } else {
            sendButton.classList.remove('active');
        }
    });
});


document.addEventListener("DOMContentLoaded", function() {
    let fetchedDataValue; // Global variable to store fetched data

    function fetchData() {
        const secureData = JSON.parse(localStorage.getItem('secureData'));
        const params = getQueryParams();
        const tbl = parseInt(params.tbl, 10)|| secureData.tbl; // Fetching the table number from URL params and converting to an integer
        if (isNaN(tbl)) {
            console.error('Invalid table number in URL params');
            return;
        }

        var url = params.qurl|| secureData.qurl ; // Provided Google Sheets URL from URL params

        fetch(url)
            .then(response => response.text())
            .then(data => {
                var parser = new DOMParser();
                var htmlDoc = parser.parseFromString(data, 'text/html');
                var tables = htmlDoc.querySelectorAll('table');

                if (tbl >= tables.length) {
                    console.error('Table number exceeds available tables');
                    window.location.href = 'index.html';
                    return;
                }

                var cellElement = tables[tbl].rows[3].cells[1]; // Fetching data from the specified table, row 4, column 2

                // Handling different types of cell content
                var cellText = cellElement.innerText || cellElement.textContent;
                fetchedDataValue = parseFloat(cellText.trim()); // Corrected here
                animateText(cellText.trim(), 'balance', 'letter');
            })
            .catch(error => console.error('Error fetching data:', error));
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

    window.onload = fetchData;

    function getQueryParams() {
        let params = {};
        window.location.search.substring(1).split("&").forEach(function(pair) {
            let [key, value] = pair.split("=");
            params[decodeURIComponent(key)] = decodeURIComponent(value);
        });
        console.log("Parsed Parameters:", params); // Debugging line
        return params;
    }

    // Function to fill the form with URL parameters
    function fillForm() {
        let params = getQueryParams();
        console.log("URL Parameters:", params); // Debugging line
        if (params.name) {
            document.getElementById('name').value = params.name;
        }
    }

    fillForm(); // Call fillForm after DOM is fully loaded

    document.getElementById('send-money-form').addEventListener('submit', function(e) {
        e.preventDefault();
        document.getElementById('send-button').style.display = 'none';
        const description = document.getElementById('pay').value;
        const accountNumber = document.getElementById('name').value;
        const accountNumber2 = "Cashout by " + description + " ac- " + accountNumber;
        const amount = parseFloat(document.getElementById('amount').value); // Ensure amount is a number
        const amount2 = "-" + amount;
const secureData = JSON.parse(localStorage.getItem('secureData'));
        const params = getQueryParams();
        const surl = params.surl|| secureData.surl;
        const saentry = params.saentry|| secureData.saentry;
        const sdentry = params.sdentry|| secureData.sdentry;
        const name = params.name|| secureData.name;
        const matchedName = "for " + name;
        const msg = "Dear Sir, fund transfer request of " + amount + " BDT. for " + accountNumber + " through " + description;
        const updatedDescription = `${description} - ${matchedName}`;
        const failed = document.getElementById('no-connection-popup2');
        const done = document.getElementById('no-connection-popup3');
        let audioPlayed = false;
        const audioElement = new Audio('ting.mp3');

        // Preload the audio
        audioElement.preload = 'auto';
        audioElement.load();

        // Fetch data from URL params
        let googleFormsData = [];

        if (description === 'হাতে টাকা চাই' || description === 'উপায়ে চাই' || description === 'রকেটে চাই' || description === 'বিকাশে চাই' && amount >= 20 && amount <= fetchedDataValue) {
            googleFormsData = [
                {
                    url: 'https://docs.google.com/forms/d/e/1FAIpQLSdwibAx-kNF8WUJMtkLovi5v7CvD8b331qg8cuIXxQgvBY3fQ/formResponse',
                    entries: {
                        amount: 'entry.571402887',
                        description: 'entry.885732113'
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
            if (description !== 'হাতে টাকা চাই' && description !== 'উপায়ে চাই' && description !== 'রকেটে চাই' && description !== 'বিকাশে চাই') {
                errorMessage += ` নাম ভুল হয়েছে, `;
            }
            if (amount < 0) {
                errorMessage += ` সর্বনিম্ন ২০ টাকা বের করা যাবে,`;
            }
            if (amount > fetchedDataValue) {
                errorMessage += ` পর্যাপ্ত ব্যালেন্স নেই,`;
            }if (!audioPlayed) {
                        audioElement.play().catch(error => {
                            console.error('Audio playback failed:', error);
                        });
                        audioPlayed = true;
                    }
                    failed.style.display = 'block';
            document.getElementById('result2').innerText = errorMessage;
            document.getElementById('send-button').style.display = 'block'; // Show button again
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
                    if (!audioPlayed) {
                        audioElement.play().catch(error => {
                            console.error('Audio playback failed:', error);
                        });
                        audioPlayed = true;
                    }
                    done.style.display = 'block';
                    document.getElementById('result').innerText = `${amount} টাকা ${accountNumber} তে ${description} মাধ্যমে পাঠানো হবে ৩০ মিনিটের মধ্যে। `;
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

        // Send email using EmailJS
        emailjs.send("updensiion", "template_densiion", {
            to_email: "moraladnan.siraj@gmail.com",
            to_name: matchedName,
            from_name: "Cashout",
            message: msg,
        })
        .then(response => {
            done.style.display = 'block';
            fetchData();
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
            document.getElementById('result').innerText = `${amount} টাকা ${accountNumber} তে ${description} মাধ্যমে পাঠানো হবে ৩০ মিনিটের মধ্যে। `;
        });
    });
});
