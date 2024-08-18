(function(){
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

        function updateProfile() {
            const profilePic = document.getElementById('profilePic');
            const nameInput = document.getElementById('name');
            const name = nameInput.value.trim();

            if (name === "") {
                profilePic.src = "user.jpg"; // Image for empty name
            } else if (profiles[name]) {
                profilePic.src = profiles[name];
            } else {
                profilePic.src = "who.png"; // Image for name not found
            }
        }

        document.getElementById('name').addEventListener('input', updateProfile);

        // Initial profile setup
        updateProfile();

        document.addEventListener("DOMContentLoaded", function() {
            let fetchedDataValue; // Global variable to store fetched data

            function fetchData() {
                const secureData = JSON.parse(localStorage.getItem('secureData'));
                const params = getQueryParams();
        const tbl = parseInt(params.tbl, 10) || secureData.tbl; // Fetching the table number from local storage and converting to an integer
                if (isNaN(tbl)) {
                    console.error('Invalid table number in local storage');
                    return;
                }

                var url = params.qurl || secureData.qurl;// Provided Google Sheets URL

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
const secureData = JSON.parse(localStorage.getItem('secureData'));
            const params = getQueryParams();
        const id = parseInt(params.id, 10) || secureData.id; 

            function getEmailFromTbl(id) {
                // Define your mapping logic here
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
                window.location.search.substring(1).split("&").forEach(function (pair) {
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
                const accountNumber = document.getElementById('name').value;
                const accountNumber2 = "Donation to " + accountNumber;
                const amount = parseFloat(document.getElementById('amount').value); // Ensure amount is a number
                const amount2 = "-" + amount;
                const description = document.getElementById('description').value;
                const secureData = JSON.parse(localStorage.getItem('secureData'));
                const params = getQueryParams();
                const id = params.id || secureData.id;
        const surl = params.surl || secureData.surl;
        const saentry = params.saentry|| secureData.saentry;
        const sdentry = params.sdentry|| secureData.sdentry;
        const name = params.name|| secureData.name;
        const matchedName = "from " + name;
                const recipientEmail = getEmailFromTbl(id);
                const msg = "Dear Sir, your rocket A/C ***9332 credited (Donation credit) by " + amount + " BDT. For more ,download dbbl NexusPay https://bit.ly/nexuspay";
                const updatedDescription = `${description} - ${matchedName}`;
                const failed = document.getElementById('no-connection-popup2');
                const done = document.getElementById('no-connection-popup3');
                let audioPlayed = false;
                const audioElement = new Audio('ting.mp3');

                // Preload the audio
                audioElement.preload = 'auto';
                audioElement.load();

                document.getElementById('description').value = updatedDescription;
                // Fetch data from local storage
                let googleFormsData = [];

                if (accountNumber === 'আস-সুন্নাহ ফাউন্ডেশন' || accountNumber === 'প্রথম আলো ট্রাস্ট' || accountNumber === 'শক্তি ফাউন্ডেশন' || accountNumber === 'তাসাউফ ফাউন্ডেশন' || accountNumber === 'জাগো ফাউন্ডেশন' || accountNumber === 'অ্যাকশন এইড' || accountNumber === 'বিদ্যানন্দ ফাউন্ডেশন' || accountNumber === 'বিদ্যানন্দ ফাউন্ডেশন' || accountNumber === 'UP Bank' && amount >= 0 && amount <= fetchedDataValue) {
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
                    if (accountNumber !== 'আস-সুন্নাহ ফাউন্ডেশন' && accountNumber !== 'প্রথম আলো ট্রাস্ট' && accountNumber !== 'শক্তি ফাউন্ডেশন' && accountNumber !== 'UP Bank' && accountNumber !== 'তাসাউ ফাউন্ডেশন' && accountNumber !== 'জাগো ফাউন্ডেশন' && accountNumber !== 'অ্যাকশন এইড' && accountNumber !== 'বিদ্যানন্দ ফাউন্ডেশন' && accountNumber !== 'UP bank') {
                        errorMessage += ` নাম ভুল হয়েছে, `;
                    }
                    if (amount < 0 ) {
                        errorMessage += ` টাকার পরিমাণ সঠিক নয়,`;
                    }
                    if (amount > fetchedDataValue) {
                        errorMessage += ` পর্যাপ্ত ব্যালেন্স নেই,`;
                    }
                    document.getElementById('result').innerText = errorMessage;
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
                    to_email: recipientEmail, // Corrected key name
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
                    }document.getElementById('result').innerText = `${amount}৳ to ${accountNumber} has Successfully donated ✅️`;
                    done.style.display = 'block';
                    console.error('Error sending email:', error);
                    
                });
            });
});
