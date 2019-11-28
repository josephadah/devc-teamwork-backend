# Teamwork Backend
Teamwork is an internal social network for employees of an organization. The goal of this
application is to facilitate more interaction between colleagues and promote team bonding.
Teamwork Backend is the backend for the application. It's built with Nodejs, Express, Postgresql, deployed on Heroku, images on Cloudinary.
This is an assignment project from Andela Facebook DevCTraining Exercise.

## How to Test Live Deployment
1. Use postman doc: [TeamWork-Backend-Docs](https://documenter.getpostman.com/view/5227850/SW7f1Rup)
2. Set environment to Heroku
3. Sign in from endpoint /api/v1/auth/signin using email: john@example.com, password: password

## How to run project Locally
1. Run: Npm install
2. Enter Postgresql credentials and Cloudinary Credentials in .env file
3. Run: Npm run start or Npm run start-dev
4. Test endpoints using postman with environment set to local

## Feature include the following:
1. Admin can create an employee user account.
2. Admin/Employees can sign in.
3. Employees can post gifs.
4. Employees can write and post articles.
5. Employees can edit their articles.
6. Employees can delete their articles.
7. Employees can delete their gifs post.
8. Employees can comment on other colleagues' article post.
9. Employees can comment on other colleagues' gif post.
10. Employees can view all articles and gifs, showing the most recently posted articles or gifs
first.
11. Employees can view a specific article.
12. Employees can view a specific gif post.




