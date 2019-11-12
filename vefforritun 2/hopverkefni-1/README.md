# Hópverkefni 1

**Heroku:** [Heroku-hopverkefni1](https://vef-hopverkefni1.herokuapp.com/)

## Höfundar
- Hjalti Geir Garðarsson
  - hgg29@hi.is
- Guðmundur Óli Norland
  - gon2@hi.is

## Uppsetning
- `npm install`
- `npm run setup`
- `npm start`

## Login

#### Admin
- user: `admin`
- pw: `adminadmin`
#### User
- user: `pleb`
- pw: `plebpleb`

## Dæmi um köll í vefþjónustuna
- **GET: /users?page=1**
- **GET: /products?page=2&search=leita**
- **POST: /users/login**
  ```
  {
    "username":"admin",
    "password":"adminadmin"
  }
  ```
- **PATCH: /users/me**
  ```
  {
    "email": "nytt@email.is"
  }
  ```
- **POST: /categories**,
  ```
  {
    "name": "flottur flokkur"
  }
  ```
- **PATCH: /categories/:id**
  ```
  {
    "name": "flottari flokkur"
  }
  ```

- **POST /products**
  ```
  {
    "name": "flott vara",
    "price": 999,
    "description": "Þessi vara er rosa flott!",
    "image": "img1.jpg",
    "categoryid": 9
  }
  ```
- **PATCH: /products/:id**
  ```
  {
    "description": "ný flott vörulýsing",
    "price": 123456789
  }
  ```

- **POST: /cart**
  ```
  {
    "productid": 999,
    "quantity": 999
  }
  ```
- **PATCH: /cart/line/:id**
  ```
  {
    "quantity": 123
  }
  ```
- **POST: /images**
  ```
  {
    "images": ["img1.jpg", "img2.jpg"]
  }
  ```