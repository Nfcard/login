document.getElementById('scanButton').addEventListener('click', function () {
    const codeReader = new ZXing.BrowserQRCodeReader();
    const video = document.getElementById('video');
    const constraints = { video: { facingMode: 'environment' } };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            video.srcObject = stream;
            video.style.display = 'block';

            codeReader.decodeOnceFromVideoDevice(undefined, 'video')
                .then(result => {
                    stream.getTracks().forEach(track => track.stop());
                    video.style.display = 'none';

                    if (result.text.startsWith('http://') || result.text.startsWith('https://')) {
                        window.location.href = result.text;
                    } else {
                        alert('QR Code does not contain a valid URL');
                    }
                })
                .catch(err => {
                    console.error('Error decoding QR Code: ', err);
                    stream.getTracks().forEach(track => track.stop());
                    video.style.display = 'none';
                });
        })
        .catch(err => {
            console.error('Error accessing camera: ', err);
        });
});