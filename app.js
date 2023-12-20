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

    // Membangun kunci unik untuk setiap kombinasi node dan ISP
    const key = `${node}-${isp}`;
    // Memperbarui status di memori
    statuses[key] = status;

    res.send(`Status updated for node: ${node}, ISP: ${isp}, Status: ${status}`);
});

// Endpoint GET untuk mengambil semua status
app.get('/multi-isp-status', (req, res) => {
    let response = '';
    for (const key in statuses) {
        const [node, isp] = key.split('-');
        response += `multiisp_status{node="${node}",isp="${isp}"} ${statuses[key]}\n`;
    }
    res.send(response.trim());
});

// Memulai server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
