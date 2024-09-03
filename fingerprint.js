// Function to check if user is already registered by checking local storage
function checkRegistrationStatus() {
    const storedCredentialId = localStorage.getItem('credentialId');
    const registerButton = document.getElementById('regif');
    const loginButton = document.getElementById('logf');

    if (storedCredentialId) {
        // If credential exists, hide register button and show login button
        registerButton.style.display = 'none';
        loginButton.style.display = 'block';
    } else {
        // If no credential, hide login button and show register button
        registerButton.style.display = 'block';
        loginButton.style.display = 'none';
    }
}

// Register with Fingerprint and Save Input in Local Storage
async function registerWithFingerprint() {
    const cvv = document.getElementById('cvv').value;
    const password = document.getElementById('password').value;

    if (!cvv || !password) {
       alert('No fingerprint credential found. Please register first.');
             return;
    }

    try {
        // Simulate fingerprint registration using WebAuthn API
        const publicKeyCredentialCreationOptions = {
            challenge: new Uint8Array(32), // Random challenge generated on the server-side
            rp: { name: "UPB Web Wallet", id: window.location.hostname }, // Your website's details
            user: {
                id: Uint8Array.from(String(cvv), c => c.charCodeAt(0)), // User ID as a byte array
                name: cvv, // Unique username
                displayName: cvv, // Display name for the user
            },
            pubKeyCredParams: [{ type: "public-key", alg: -7 }], // Algorithm used
            authenticatorSelection: { userVerification: "required" }, // Require user verification
        };

        const credential = await navigator.credentials.create({ publicKey: publicKeyCredentialCreationOptions });

        if (credential) {
            // Store credential ID and values in local storage after fingerprint registration
            const credentialId = credential.rawId;
            localStorage.setItem('credentialId', JSON.stringify(Array.from(new Uint8Array(credentialId))));
            localStorage.setItem('cvv', cvv);
            localStorage.setItem('password', password);
            alert('Registration successful with fingerprint!');
            checkRegistrationStatus(); // Update button visibility after registration
        }
    } catch (err) {
        console.error('Error during fingerprint registration:', err);
    }
}

// Authenticate with Fingerprint, Auto-Fill, and Submit Form
async function authenticateAndSubmit() {
    try {
        // Retrieve the stored credential ID from local storage
        const storedCredentialId = JSON.parse(localStorage.getItem('credentialId'));

        if (!storedCredentialId) {
            alert('No fingerprint credential found. Please register first.');
            return;
        }

        // Convert the stored credential ID back to a Uint8Array
        const credentialIdUint8 = new Uint8Array(storedCredentialId);

        // Simulate fingerprint authentication using WebAuthn API
        const publicKeyCredentialRequestOptions = {
            challenge: new Uint8Array(32), // Random challenge generated on the server-side
            allowCredentials: [{
                id: credentialIdUint8, // User's credential ID
                type: "public-key",
                transports: ["internal"]
            }],
            userVerification: "required",
        };

        const assertion = await navigator.credentials.get({ publicKey: publicKeyCredentialRequestOptions });

        if (assertion) {
            // Retrieve values from local storage
            const cvv = localStorage.getItem('cvv');
            const password = localStorage.getItem('password');

            if (cvv && password) {
                // Auto-fill the form fields
                document.getElementById('cvv').value = cvv;
                document.getElementById('password').value = password;

                // Automatically submit the form
                submitForm();
            } else {
                alert('No data found. Please register first.');
            }
        }
    } catch (err) {
        console.error('Error during fingerprint authentication:', err);
        alert('Authentication failed. Make sure your fingerprint is registered.');
    }
}

// Submit the form after auto-filling it
function submitForm() {
    const cvv = document.getElementById('cvv').value;
    const password = document.getElementById('password').value;
    const button = document.getElementById('sub');
    button.click();
}

// Check registration status on page load
window.onload = checkRegistrationStatus;
