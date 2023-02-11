# Parcels Management App V2.0 Angular Front-End

for a Live Demo: [Live Demo](https://parcels-management-demo.netlify.app)

A newer version of the original parcels management app, done with Angular,
please visit the original [parcels management app page](https://lior-reuven.netlify.app/main_projects/6) to learn about the core of the app
This version added:
Increased speed and performance,
Cleaner and more scaleable code,
Full mobile support,
Better UI, done with PrimeNG,
Adding companies and their respective release url feature,
Exporting reports to Excel / PDF / CSV files,
Improved filtering and searching in many pages,being able to filter faster and with more options.

## Features

### General:

- Full historical data of every parcel including all vital information.
- Storage units management allows you to add/edit and assign parcels.
- Companies management and their respective release url.
- Quick parcels release - takes you directly to the proper parcel release form, reducing the waiting time of customers.
- Reports - export a monthly report of either all parcels or parcels of a specific delivery company to a PDF/EXCEL/CSV file.
- Multiple error preventing measures(preventing human made errors).
- Storage unit auto assigns itself to a specific delivery company based on parcels inserted.
- Live application - can be opened on multiple computers,changes will be updates automatically(no refresh needed).

### Technicalities:
- Made with Angular and NodeJs.
- MongoDB.
  - mongoose.
  - users database.
  - parcels database.
  - storage units database.
  - companies database.
- Angular's rxjs, utilizing http requests,subjects, behavior subjects etc...
- jspdf - for PDF exports.
- Css
- Socket.io
- Angular Router
- Authentication
  -Jsonwebtoken(with middleware)
- Bcrypt

## Images

I did not want to bloat the file with images,please check them on my portfolio website here:[Parcels App V2.0 Page](https://lior-reuven.netlify.app/main_projects/7)


