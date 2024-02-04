const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'tennis_club',
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL database:', error);
    return;
  }
  console.log('Connected to MySQL database');
});

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
    connection.query(query, [email, hashedPassword], (error, results) => {
      if (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ success: false, message: 'Registration failed!' });
      } else {
        res.json({ success: true, message: 'Registration successful!' });
      }
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, message: 'Registration failed!' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Received email:', email);
    console.log('Received password:', password);

    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [email], async (error, results) => {
      if (error) {
        console.error('Error querying data:', error);
        res.status(500).json({ success: false, message: 'Login failed!' });
      } else {
        if (results.length > 0) {
          const match = await bcrypt.compare(password, results[0].password);
          if (match) {
            res.json({ success: true, message: 'Login successful!' });
          } else {
            res.status(401).json({ success: false, message: 'Invalid credentials!' });
          }
        } else {
          res.status(401).json({ success: false, message: 'Email not found!' });
        }
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Login failed!' });
  }
});

app.post('/api/reserveCourt', (req, res) => {
  try {
    const { email, date, timeSlot } = req.body;
    console.log('Received date:', date);

    // Check if the time slot is available
    const queryAvailability = 'SELECT * FROM reservations WHERE date = ? AND time_slot = ?';
    connection.query(queryAvailability, [date, timeSlot], (availabilityError, availabilityResults) => {
      if (availabilityError) {
        console.error('Error checking availability:', availabilityError);
        res.status(500).json({ success: false, message: 'Reservation failed!' });
      } else {
        if (availabilityResults.length === 0) {
          // The time slot is available, proceed with the reservation
          const queryReservation = 'INSERT INTO reservations (user_email, date, time_slot) VALUES (?, ?, ?)';
          connection.query(queryReservation, [email, date, timeSlot], (reservationError, reservationResults) => {
            console.log('Query:', queryReservation);
            console.log('Parameters:', [email, date, timeSlot]);

            if (reservationError) {
              console.error('Error inserting reservation data:', reservationError);
              res.status(500).json({ success: false, message: 'Reservation failed!' });
            } else {
              res.json({ success: true, message: 'Reservation successful!' });
            }
          });
        } else {
          // The time slot is already booked
          res.status(400).json({ success: false, message: 'Selected time slot is not available!' });
        }
      }
    });
  } catch (error) {
    console.error('Error during reservation:', error);
    res.status(500).json({ success: false, message: 'Reservation failed!' });
  }
});

// Function to generate all available time slots for a given date
function generateAllTimeSlots(date) {
  const startTime = new Date(`${date}T09:00:00`);
  const endTime = new Date(`${date}T17:00:00`);
  const timeSlots = [];

  let currentTime = new Date(startTime);

  while (currentTime < endTime) {
    const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    timeSlots.push(`${formattedTime}-${(currentTime.getHours() + 1).toString().padStart(2, '0')}:00`);
    currentTime.setHours(currentTime.getHours() + 1);
  }

  return timeSlots;
}

app.get('/api/available-time-slots', async (req, res) => {
  try {
    const date = req.query.date;

    // Get booked time slots for the specified date
    const queryAvailability = 'SELECT DISTINCT time_slot FROM reservations WHERE date = ?';
    connection.query(queryAvailability, [date], (availabilityError, availabilityResults) => {
      if (availabilityError) {
        console.error('Error checking availability:', availabilityError);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        // Generate all available time slots for the specified date
        const allTimeSlots = generateAllTimeSlots(date);

        // Filter out the booked time slots
        const bookedTimeSlots = availabilityResults.map((result) => result.time_slot);
        const availableTimeSlots = allTimeSlots.filter(slot => !bookedTimeSlots.includes(slot));

        res.json({ availableTimeSlots });
      }
    });
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/reserveEquipment', async (req, res) => {
  try {
    const { email, numBalls, numRackets } = req.body;

    const queryEquipmentAvailability = 'SELECT * FROM equipment_reservations WHERE numBalls = ? AND numRackets = ?';
    connection.query(queryEquipmentAvailability, [numBalls, numRackets], (equipmentAvailabilityError, equipmentAvailabilityResults) => {
      if (equipmentAvailabilityError) {
        console.error('Error checking equipment availability:', equipmentAvailabilityError);
        res.status(500).json({ success: false, message: 'Equipment reservation failed!' });
      } else {
        if (equipmentAvailabilityResults.length === 0) {
          const queryEquipmentReservation = 'INSERT INTO equipment_reservations (user_email, numBalls, numRackets) VALUES (?, ?, ?)';
          connection.query(queryEquipmentReservation, [email, numBalls, numRackets], (equipmentError, equipmentResults) => {
            if (equipmentError) {
              console.error('Error inserting equipment reservation data:', equipmentError);
              res.status(500).json({ success: false, message: 'Equipment reservation failed!' });
            } else {
              res.json({ success: true, message: 'Equipment reservation successful!' });
            }
          });
        } else {
          res.status(400).json({ success: false, message: 'Equipment reservation failed!' });
        }
      }
    });
  } catch (error) {
    console.error('Error during equipment reservation:', error);
    res.status(500).json({ success: false, message: 'Equipment reservation failed!' });
  }
});

// Fetch user reservations
app.get('/api/user-reservations', async (req, res) => {
  try {
    const userEmail = req.query.userEmail;

    const query = 'SELECT * FROM reservations WHERE user_email = ?';
    connection.query(query, [userEmail], (error, results) => {
      if (error) {
        console.error('Error fetching user reservations:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch user reservations!' });
      } else {
        res.json({ success: true, userReservations: results });
      }
    });
  } catch (error) {
    console.error('Error fetching user reservations:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user reservations!' });
  }
});

// Fetch user equipment reservations
app.get('/api/user-equipment-reservations', async (req, res) => {
  try {
    const userEmail = req.query.userEmail;

    const query = 'SELECT * FROM equipment_reservations WHERE user_email = ?';
    connection.query(query, [userEmail], (error, results) => {
      if (error) {
        console.error('Error fetching user equipment reservations:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch user equipment reservations!' });
      } else {
        res.json({ success: true, userEquipmentReservations: results });
      }
    });
  } catch (error) {
    console.error('Error fetching user equipment reservations:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user equipment reservations!' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
