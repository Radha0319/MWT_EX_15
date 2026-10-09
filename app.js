const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// Doctor Model
const Doctor = mongoose.model("Doctor", new mongoose.Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    department: { type: String, required: true }
}));

// Appointment Model
const Appointment = mongoose.model("Appointment", new mongoose.Schema({
    patientName: { type: String, required: true },
    patientEmail: { type: String, required: true },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    date: { type: Date, required: true }
}));

// Home Route
app.get("/", (req, res) => {
    res.send("Hospital API deployed successfully");
});

// Add Doctor
app.post("/doctors", async (req, res) => {
    try {
        res.status(201).json(await Doctor.create(req.body));
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get Doctors
app.get("/doctors", async (req, res) => {
    try {
        res.json(await Doctor.find());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Appointment
app.post("/appointments", async (req, res) => {
    try {
        if (!await Doctor.findById(req.body.doctorId))
            return res.status(404).json({ message: "Doctor not found" });

        res.status(201).json(await Appointment.create(req.body));
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get Appointments
app.get("/appointments", async (req, res) => {
    try {
        res.json(await Appointment.find().populate("doctorId"));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
        app.listen(process.env.PORT || 3000, () =>
            console.log(`Server running on port ${process.env.PORT || 3000}`)
        );
    })
    .catch(err => console.error("MongoDB connection failed:", err.message));