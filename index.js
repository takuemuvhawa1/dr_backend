const express = require('express');
require('dotenv').config();
const cors = require('cors');
const https = require('https');

// const axios = require('axios');


// const membersDbOperations = require('./cruds/member'); 

// Peses pay
const { Pesepay } = require('pesepay');

//Payment Gateway

// const resultUrl = 'http://localhost:3000/dashboard'; // Update with your result URL
// const returnUrl = 'http://localhost:3000/dashboard'; // Update with your return URL
const resultUrl = 'https://datingradar.tankak.tech/home'; // Update with your result URL
const returnUrl = 'https://datingradar.tankak.tech/home'; // Update with your return URL
const pesepayInstance = new Pesepay("96aa2f37-063a-4b4f-ae30-c6332e985db8", "f3e0d62f7b6640f5b3fef5e8d545278e");

// Auth
const authenticateToken = require('./utilities/authenticateToken');

const pool = require('./cruds/poolapi');

const multer = require('multer');
const axios = require('axios');

const nodemailer = require('nodemailer');
const Imap = require('imap');
const { simpleParser } = require('mailparser');

const path = require('path');
const fs = require('fs');

// Route path
const mailerRouter = require('./routes/mailer');
const onBoardingRouter = require('./routes/onboarding');
const subscriptionsRouter = require('./routes/subscriptions');
const resultsRouter = require('./routes/results');
const memberRouter = require('./routes/members');
const likesRouter = require('./routes/likes');
const chatsRouter = require('./routes/chats');
const messagesRouter = require('./routes/messages');
const accountRouter = require('./routes/account');
const pendingRouter = require('./routes/acc_pending');
const userRouter = require('./routes/users');

const corsOptions = {
  // origin: ['http://localhost:3000', 'http://localhost:3003/account/cashout' ],
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

//App Route Usage
app.use('/mailer', mailerRouter);
app.use('/onboarding', onBoardingRouter);
app.use('/members', memberRouter);
app.use('/likes', likesRouter);
app.use('/chats', chatsRouter);
app.use('/messages', messagesRouter);
app.use('/subscriptions', subscriptionsRouter);
app.use('/accounts', accountRouter);
app.use('/accpending', pendingRouter);
app.use('/users', userRouter);
app.use('/results', authenticateToken, resultsRouter);

//FILE UPLOADS
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = function (req, file, cb) {
  cb(null, true); // Allow all file types
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const uploadedFilename = req.file.filename;
  console.log('File uploaded:', uploadedFilename);

  res.status(200).send(`File uploaded successfully. Filename: ${uploadedFilename}`);
});

// Set up a route for file retrieval
app.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found.');
  }

  // Stream the file as the response
  res.sendFile(filePath);
});

// Endpoint for downloading files
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(404).send('File not found.');
    }
  });
});

// Endpoint for deleting files
app.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;

  fs.unlink(`uploads/${filename}`, (err) => {
    if (err) {
      console.log(err);
      return res.status(404).send('File not found.');
    } else {
      console.log(`File ${filename} deleted successfully`);
      return;
    }
  })
  res.status(200).send(`File deleted successfully.`);
});

// app.get('/initiate-payment/:member_id/:amount/:exp_date/:ref', async (req, res) => {

//   const member_id = req.params.member_id;
//   const amount = req.params.amount;
//   const exp_date = req.params.exp_date;
//   const ref = req.params.ref;

//   const axios = require('axios');

//   // Sample data to post
//   const data = {
//     member_id,
//     amount,
//     exp_date
//   };

//   // Sample data to post
//   const data2 = {
//     member_id: ref,
//     amount
//   };

//   // Post request
//   axios.post(`${pool}/subscriptions/`, data)
//     .then(response => {
//       console.log('Response Data:', response.data);
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });

//   // Post request
//   axios.post(`${pool}/accounts/`, data2)
//     .then(response => {
//       console.log('Response Data:', response.data);
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
// }

// );

app.get('/initiate-payment/:member_id/:amount/:exp_date/:ref', async (req, res) => {
  try {
    const member_id = req.params.member_id;
    const amount = req.params.amount;
    const exp_date = req.params.exp_date;
    const ref = req.params.ref;


    const currencyCode = 'USD'; // Update with the actual currency code
    const paymentReason = 'Pay Subscription'; // Update with the actual payment reason

    const transaction = pesepayInstance.createTransaction(amount, currencyCode, paymentReason);

    pesepayInstance.resultUrl = resultUrl;
    pesepayInstance.returnUrl = returnUrl;

    pesepayInstance.initiateTransaction(transaction).then(response => {
      console.log(response);
      if (response.success) {
        const redirectUrl = response.redirectUrl;
        const referenceNumber = response.referenceNumber;
        const pollUrl = response.pollUrl;

        // Check payment status
        pesepayInstance.pollTransaction(pollUrl).then(response => {
          if (response.success) {
            if (response.paid) {
              console.log('Payment was successful');
            } else {
              console.log('Payment is pending');

              let loops = 0;
              let paymentProcessed = false; // Flag to prevent double posting
              const intervalId = setInterval(() => {
                pesepayInstance.checkPayment(referenceNumber).then(response => {
                  if (response.success) {
                    if (response.paid && !paymentProcessed) {
                      console.log('Payment was successful');

                      const axios = require('axios');

                      // Sample data to post
                      const data = {
                        member_id,
                        amount,
                        exp_date
                      };

                      const data2 = {
                        module_id: ref,
                        amount
                      };

                      // Post request
                      axios.post(`${pool}/subscriptions/`, data)
                        .then(response => {
                          console.log('Response Data:', response.data);
                        })
                        .catch(error => {
                          console.error('Error:', error);
                        });

                       // Post request
                       axios.post(`${pool}/accounts/`, data2)
                      .then(response => {
                       console.log('Response Data:', response.data);
                       })
                       .catch(error => {
                         console.error('Error:', error);
                       });

                      paymentProcessed = true; // Set the flag to true to prevent further posting
                      clearInterval(intervalId);
                    }
                  } else {
                    console.error(`Error: ${response.message}`);
                  }
                }).catch(error => {
                  console.error(error);
                });
                loops++;
                if (loops >= 18) {
                  clearInterval(intervalId);
                }
              }, 5000); // Check every 5 seconds
            }
          } else {
            console.error(`Error: ${response.message}`);
          }
        }).catch(error => {
          console.error(error);
        });

        res.redirect(redirectUrl);
      } else {
        console.error(`Error: ${response.message}`);
        res.status(500).send({ error: 'Failed to initiate payment' });
      }
    }).catch(error => {
      console.error(error);
      res.status(500).send({ error: 'Failed to initiate payment' });
    });



  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});


// Load SSL certificates
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/srv702611.hstgr.cloud/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/srv702611.hstgr.cloud/fullchain.pem')
};

// Create HTTPS server
const PORT = process.env.APPPORT || '3009';
https.createServer(options, app).listen(PORT, () => {
  console.log(`App is listening on https://srv702611.hstgr.cloud:${PORT}`);
});


// app.listen(process.env.APPPORT || '3009', () => {
//   console.log('app is listening to port' + process.env.APPPORT);
// });