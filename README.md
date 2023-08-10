# test_task_backend

# how to ran the codebase

1. `npm install`
2. `npm start`
3. User Flows to test
    - First signup using email and password
    - Login using the email and password and get a QRCODE data:image
    - go to this website to convert the data:image to png 'https://onlinepngtools.com/convert-base64-to-png'
    - Scan using google authenticator to get OTP. (android app)[https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US]
    - pass the OTP to the verify endpoint to get JWT token
    - use the JWT token for bearer authorization to change password
4. GraphQL Endpoint: http://localhost:4000/graphql
     - use their playground to do request
5. REST API
     - POST: http://localhost:4545/user/login
          - body: {
            	"email":"tomorrow@gmail.com",
            	"password":"password"
            }
     - POST: http://localhost:4545/user/signup
          - body: {
            	"email":"tomorrow@gmail.com",
            	"password":"password"
            }
     - POST: http://localhost:4545/user/verify
          - body: {
                  	"email":"tomorrow@gmail.com",
                  	"token":"249629"
                  }
     - POST: http://localhost:4545/user/changePassword
           - Bearer Token passed in Header - Authorization
           - body: {
              	"email":"tomorrow@gmail.com",
              	"oldPassword":"onetwo",
              	"newPassword":"password"
              }
