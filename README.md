
# Hotel Management System

An ready-to-deploy hotel management website written in Node.js, utilizing MongoDB as the database, available as a Docker container.


  
## API Usage

### AUTH
#### LOGIN

```http
  GET /login
```
- Login form page

```http
  POST /login
```

| Param | Type     | Explanation               |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. User email. |
| `password` | `string` | **Required**. User password. |

#### REGISTER

```http
  GET /register
```
- Register form page

```http
  POST /register
```

| Param | Type     | Explanation               |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. User email. |
| `name` | `string` | **Required**. Username. |
| `password` | `string` | **Required**. User password. |
| `repassword` | `string` | **Required**. User repassword. |

#### FORGET PASSWORD

```http
  GET /forgotpassword
```
- Forgot password form page

```http
  POST /forgotpassword
```

| Param | Type     | Explanation               |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. User email. |
| `name` | `string` | **Required**. Username. |
| `password` | `string` | **Required**. User password. |
| `repassword` | `string` | **Required**. User repassword. |

#### RESET PASSWORD

```http
  GET /resetpassword/:id/:token
```
- Reset password email link token generate

```http
  GET /resetpassword
```
- Reset password page

```http
  POST /resetpassword
```

| Param | Type     | Explanation               |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. User MongoDB object id. |

#### LOGOUT

```http
  GET /logout
```

### USER
#### Main Page
```http
  POST /rooms
```
- Show all rooms

#### Rooms Page
```http
  GET /rooms/:id
```
- Get specific room

| Param | Type     | Explanation               |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Room MongoDB object id. |

#### Rooms Page
```http
  GET /rooms/book/:id
```
- Booking room for user

| Param | Type     | Explanation               |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Room MongoDB object id. |

#### Payment Page
```http
  GET /rooms/payment/:id
```
- Payment page for room

| Param | Type     | Explanation               |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Room MongoDB object id. |

#### User Profile Page
```http
  GET /rooms/profile/user
```
- Get user profile page

#### User Profile Edit Page
```http
  GET /rooms/profile/edit
```
- Get user profile edit page

#### User Profile Edit 
```http
  POST /rooms/profile/user
```
- Edit user profile


| Param | Type     | Explanation               |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. Username. |
| `email` | `string` | **Required**. Email. |
| `address` | `string` | **Required**. Address. |
| `tc` | `string` | **Required**. Government ID NO. |
| `phone` | `string` | **Required**. Phone No. |

## Technologies

**Client:** EJS, HTML, CSS

**Server:** Node, Express, Docker

**Database:** MongoDB

  
## Developer

- [@nurettinberkaydemirkol](https://github.com/nurettinberkaydemirkol)

  
## Support
Feel free to send me mail for support: berkaydemirkol2@gmail.com

  
