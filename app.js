const express = require('express');
const app = express();
app.use(express.json()); // Middleware untuk menguraikan JSON

const port = 3000;

// In-memory storage untuk menyimpan status
const statuses = {};

// Endpoint POST untuk memperbarui status
app.post('/multi-isp-status', (req, res) => {
    // Logging data yang diterima
    console.log('Received data:', req.body);

    const { node, isp, status } = req.body;
    
    // Validasi data
    if (!node || !isp || status === undefined) {
        return res.status(400).send('Invalid data provided');
    }

    const key = `${node}-${isp}`; // Membangun kunci unik untuk setiap kombinasi node dan ISP
    const timestamp = Math.floor(Date.now() / 1000); //mendapatkan timestamp Unix saat ini
    statuses[key] = {status, timestamp }; // Memperbarui status di memori

    res.send(`Status updated for node: ${node}, ISP: ${isp}, Status: ${status}`);
});

// Endpoint GET untuk mengambil semua status
app.get('/multi-isp-status', (req, res) => {
    let response = '';
    for (const key in statuses) {
        const [node, isp] = key.split('-');
        const { status, timestamp } = statuses[key];
        response += `multiisp_status{node="${node}",isp="${isp}"} ${status}\n`;
        response += `status_lastupdate{node="${node}",isp="${isp}"} ${timestamp}\n`;
    }
    res.send(response.trim());
});

// Memulai server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
