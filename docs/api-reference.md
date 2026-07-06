# API Reference

This API reference is generated from the source code in:
- `index.js`
- `controllers/*.js`
- `Model/*.js`
- `middleware/*.js`

General notes:
- Base URL: `http://localhost:5001`
- Routes are mounted at the root path; there is no `/api/v1` prefix.
- There is no centralized validation layer.
- Validation notes below are inferred from controller code and Sequelize model definitions.
- "Service" is always `none` in this project, because controllers call models directly.
- Response formats are inconsistent across endpoints.

## Auth and Users

### POST /signup

- Description: Create a new user account.
- Files involved: `index.js:37`, `controllers/userController.js:9-45`, `Model/signup.js`
- Authentication required: No
- Headers: `Content-Type: application/json`
- Query parameters: none
- Path parameters: none
- Request body:

```json
{
  "data": {
    "name": "Anand",
    "email": "anand@example.com",
    "phone": "9999999999",
    "password": "secret123",
    "loginVia": false
  }
}
```

- Validation rules: `req.body.data` must exist; `name` and `email` are required by the model; controller manually blocks duplicate email; password should be present for normal signup.
- Response body: `{ message: string, status: number }`
- Success response:

```json
{
  "message": "user created successfully",
  "status": 1
}
```

- Error responses: duplicate email returns `200` with `{ "message": "user already exist", "status": 0 }`; server error returns `500` with `{ "message": "Error in sign up", "status": 1 }`.
- Example request:

```http
POST /signup
Content-Type: application/json

{"data":{"name":"Anand","email":"anand@example.com","phone":"9999999999","password":"secret123","loginVia":false}}
```

- Example response:

```json
{
  "message": "user created successfully",
  "status": 1
}
```

- Related database tables: `Users`
- Controller: `createUser`
- Service: none
- Model used: `db.user` from `Model/signup.js`
- Notes: the controller spreads the entire `data` object into the model, so extra fields like `role` would also be accepted if sent.

### POST /login

- Description: Authenticate a user and return a JWT.
- Files involved: `index.js:38`, `controllers/userController.js:49-118`, `Model/signup.js`
- Authentication required: No
- Headers: `Content-Type: application/json`
- Query parameters: none
- Path parameters: none
- Request body:

```json
{
  "data": {
    "email": "anand@example.com",
    "password": "secret123"
  }
}
```

- Alternative social-login-style request body:

```json
{
  "data": {
    "name": "Anand",
    "email": "anand@example.com",
    "loginVia": true
  }
}
```

- Validation rules: `req.body.data.email` is always required; normal login expects `password`; if `loginVia` is truthy, controller skips password check and creates the user if missing.
- Response body: normal login returns `{ message, token, status, role }`; social-login path returns `{ message, token, status }`.
- Success response:

```json
{
  "message": "Authenticated!,User Login Successfuly",
  "token": "Bearer <jwt>",
  "status": true,
  "role": "customer"
}
```

- Error responses: wrong password returns `200` with `{ "message": "Password Incorrect", "status": false }`; unknown user returns `200` with `{ "message": "User does not exist", "status": false }`; server error returns `500`.
- Example request:

```http
POST /login
Content-Type: application/json

{"data":{"email":"anand@example.com","password":"secret123"}}
```

- Example response:

```json
{
  "message": "Authenticated!,User Login Successfuly",
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "status": true,
  "role": "customer"
}
```

- Related database tables: `Users`
- Controller: `loginUser`
- Service: none
- Model used: `db.user` from `Model/signup.js`
- Notes: normal login token expires in `1d`; `loginVia` token expires in `1m`; JWT secret is hardcoded.

### PATCH /updateuser/:id

- Description: Update a user row by numeric id.
- Files involved: `index.js:39`, `controllers/userController.js:121-138`, `Model/signup.js`
- Authentication required: No
- Headers: `Content-Type: application/json`
- Query parameters: none
- Path parameters: `id` - user id
- Request body:

```json
{
  "name": "Anand Patel",
  "phone": "8888888888",
  "password": "newSecret123"
}
```

- Validation rules: controller always hashes `req.body.password`; if frontend omits `password`, behavior may be unsafe.
- Response body: `{ "message": "User Details Updated Successfully", "data": [affectedRows] }`
- Success response:

```json
{
  "message": "User Details Updated Successfully",
  "data": [1]
}
```

- Error responses: unhandled errors bubble to Express and would typically become `500`.
- Example request:

```http
PATCH /updateuser/5
Content-Type: application/json

{"name":"Anand Patel","phone":"8888888888","password":"newSecret123"}
```

- Example response:

```json
{
  "message": "User Details Updated Successfully",
  "data": [1]
}
```

- Related database tables: `Users`
- Controller: `updateUser`
- Service: none
- Model used: `db.user` from `Model/signup.js`
- Notes: route is unprotected.

### DELETE /deleteUser/:id

- Description: Delete a user row by id.
- Files involved: `index.js:40`, `controllers/userController.js:141-160`, `Model/signup.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: `id` - user id
- Request body: none
- Validation rules: no explicit validation beyond path param use.
- Response body: `{ id, message, success }`
- Success response:

```json
{
  "id": "5",
  "message": "User deleted successfully",
  "success": true
}
```

- Error responses: `500` with `{ "message": "Error in deleting user", "success": false }`.
- Example request:

```http
DELETE /deleteUser/5
```

- Example response:

```json
{
  "id": "5",
  "message": "User deleted successfully",
  "success": true
}
```

- Related database tables: `Users`
- Controller: `deleteUser`
- Service: none
- Model used: `db.user` from `Model/signup.js`
- Notes: route is unprotected.

### GET /getalluser

- Description: Return all users.
- Files involved: `index.js:41`, `controllers/userController.js:162-169`, `Model/signup.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: none
- Request body: none
- Validation rules: none
- Response body: array of user rows
- Success response:

```json
[
  {
    "id": 1,
    "name": "Anand",
    "email": "anand@example.com",
    "phone": "9999999999",
    "password": "$2b$10$...",
    "loginVia": false,
    "role": "customer",
    "canAccess": {
      "canManageProducts": false,
      "canManageCategory": false,
      "canManageSubCategory": false,
      "canManageUsers": false,
      "canManageOrders": false
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

- Error responses: unhandled server errors would become `500`.
- Example request:

```http
GET /getalluser
```

- Example response: see success response above.
- Related database tables: `Users`
- Controller: `getAllUser`
- Service: none
- Model used: `db.user` from `Model/signup.js`
- Notes: returns hashed passwords and access flags; route is unprotected.

### GET /getuserbyid/:email

- Description: Return one user by email, despite the route name saying "by id".
- Files involved: `index.js:42`, `controllers/userController.js:171-178`, `Model/signup.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: `email` - user email address
- Request body: none
- Validation rules: controller expects a valid email string in the path.
- Response body: single user row or `null`
- Success response:

```json
{
  "id": 1,
  "name": "Anand",
  "email": "anand@example.com",
  "phone": "9999999999",
  "password": "$2b$10$...",
  "loginVia": false,
  "role": "customer",
  "canAccess": {
    "canManageProducts": false,
    "canManageCategory": false,
    "canManageSubCategory": false,
    "canManageUsers": false,
    "canManageOrders": false
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

- Error responses: unhandled server errors would become `500`.
- Example request:

```http
GET /getuserbyid/anand@example.com
```

- Example response: see success response above.
- Related database tables: `Users`
- Controller: `getUserById`
- Service: none
- Model used: `db.user` from `Model/signup.js`
- Notes: route is unprotected and exposes hashed password.

### PATCH /roleupdate/:id

- Description: Update a user's role and fine-grained access flags.
- Files involved: `index.js:43`, `controllers/userController.js:180-215`, `Model/signup.js`
- Authentication required: No
- Headers: `Content-Type: application/json`
- Query parameters: none
- Path parameters: `id` - user id
- Request body:

```json
{
  "role": "admin",
  "canManageProducts": true,
  "canManageCategory": true,
  "canManageSubCategory": true,
  "canManageUsers": true,
  "canManageOrders": true
}
```

- Validation rules: `role` should be one of `admin`, `vandor`, `customer`; booleans are packed into `canAccess`.
- Response body: `{ message, data, success }`
- Success response:

```json
{
  "message": "Role updated successfully.",
  "data": {
    "role": "admin",
    "canManageProducts": true,
    "canManageCategory": true,
    "canManageSubCategory": true,
    "canManageUsers": true,
    "canManageOrders": true
  },
  "success": 1
}
```

- Error responses: logical failure returns `200` with `{ "message": "Error in update role", "success": 0 }`; server error returns `500`.
- Example request:

```http
PATCH /roleupdate/5
Content-Type: application/json

{"role":"admin","canManageProducts":true,"canManageCategory":true,"canManageSubCategory":true,"canManageUsers":true,"canManageOrders":true}
```

- Example response: see success response above.
- Related database tables: `Users`
- Controller: `roleUpdate`
- Service: none
- Model used: `db.user` from `Model/signup.js`
- Notes: route is unprotected even though it controls authorization.

## Staff

### POST /addstaff

- Description: Create a new staff member.
- Files involved: `index.js:47`, `middleware/verifyToken.js`, `controllers/staffMemberController.js:33-56`, `Model/staffMember.js`
- Authentication required: Yes, Bearer token
- Headers: `Authorization: Bearer <jwt>`, `Content-Type: application/json`
- Query parameters: none
- Path parameters: none
- Request body:

```json
{
  "name": "Staff One",
  "email": "staff@example.com",
  "phone": "7777777777",
  "password": "staffSecret"
}
```

- Validation rules: `name` and `email` are required by the model; controller blocks duplicate email and hashes password.
- Response body: `{ message, newMember }`
- Success response:

```json
{
  "message": "Staff Member Created Successfully",
  "newMember": {
    "id": 1,
    "name": "Staff One",
    "email": "staff@example.com",
    "phone": "7777777777",
    "password": "$2b$10$...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

- Error responses: duplicate email returns `500` with `{ "message": "Staff Member already exists" }`; invalid token returns JSON from auth middleware.
- Example request:

```http
POST /addstaff
Authorization: Bearer <jwt>
Content-Type: application/json

{"name":"Staff One","email":"staff@example.com","phone":"7777777777","password":"staffSecret"}
```

- Example response: see success response above.
- Related database tables: `staffMembers`
- Controller: `createstaffMember`
- Service: none
- Model used: `db.staffMember` from `Model/staffMember.js`
- Notes: this is the only staff route protected by JWT.

### GET /getstaffs

- Description: Return all staff members.
- Files involved: `index.js:48`, `controllers/staffMemberController.js:9-17`, `Model/staffMember.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: none
- Request body: none
- Validation rules: none
- Response body: array of staff rows
- Success response:

```json
[
  {
    "id": 1,
    "name": "Staff One",
    "email": "staff@example.com",
    "phone": "7777777777",
    "password": "$2b$10$...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

- Error responses: unhandled server errors would become `500`.
- Example request:

```http
GET /getstaffs
```

- Example response: see success response above.
- Related database tables: `staffMembers`
- Controller: `getstaffMember`
- Service: none
- Model used: `db.staffMember` from `Model/staffMember.js`
- Notes: route is unprotected and exposes hashed passwords.

### GET /getsinglestaff/:id

- Description: Return one staff member by id.
- Files involved: `index.js:49`, `controllers/staffMemberController.js:20-30`, `Model/staffMember.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: `id` - staff id
- Request body: none
- Validation rules: valid numeric id expected.
- Response body: single staff row or `null`
- Success response:

```json
{
  "id": 1,
  "name": "Staff One",
  "email": "staff@example.com",
  "phone": "7777777777",
  "password": "$2b$10$...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

- Error responses: unhandled server errors would become `500`.
- Example request:

```http
GET /getsinglestaff/1
```

- Example response: see success response above.
- Related database tables: `staffMembers`
- Controller: `getsinglestaffMember`
- Service: none
- Model used: `db.staffMember` from `Model/staffMember.js`

### PATCH /updatestaff/:id

- Description: Update one staff member by id.
- Files involved: `index.js:51`, `controllers/staffMemberController.js:60-77`, `Model/staffMember.js`
- Authentication required: No
- Headers: `Content-Type: application/json`
- Query parameters: none
- Path parameters: `id` - staff id
- Request body:

```json
{
  "name": "Updated Staff",
  "email": "staff@example.com",
  "phone": "6666666666",
  "password": "newStaffSecret"
}
```

- Validation rules: controller hashes `password` on every update.
- Response body: `{ success, message }`
- Success response:

```json
{
  "success": 1,
  "message": "Data updated Successfully"
}
```

- Error responses: logical failure returns `500` with `{ "success": 0, "message": "Data does not updated" }`; other failures bubble as `500`.
- Example request:

```http
PATCH /updatestaff/1
Content-Type: application/json

{"name":"Updated Staff","email":"staff@example.com","phone":"6666666666","password":"newStaffSecret"}
```

- Example response: see success response above.
- Related database tables: `staffMembers`
- Controller: `updatestaffMember`
- Service: none
- Model used: `db.staffMember` from `Model/staffMember.js`
- Notes: route is unprotected.

### DELETE /deletestaff/:id

- Description: Delete a staff row by id.
- Files involved: `index.js:50`, `controllers/staffMemberController.js:80-89`, `Model/staffMember.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: `id` - staff id
- Request body: none
- Validation rules: none
- Response body: `{ message }`
- Success response:

```json
{
  "message": "Deleted the user"
}
```

- Error responses: unhandled server errors would become `500`.
- Example request:

```http
DELETE /deletestaff/1
```

- Example response: see success response above.
- Related database tables: `staffMembers`
- Controller: `deletestaffMember`
- Service: none
- Model used: `db.staffMember` from `Model/staffMember.js`
- Notes: route is unprotected.

## Categories

### POST /addcategory

- Description: Create a top-level category.
- Files involved: `index.js:56`, `controllers/categoryController.js:12-26`, `Model/category.js`
- Authentication required: No
- Headers: `Content-Type: application/json`
- Query parameters: none
- Path parameters: none
- Request body:

```json
{
  "category_name": "Electronics",
  "uploadby": "admin@example.com"
}
```

- Validation rules: `category_name` is required by the model.
- Response body: `{ message, data }`
- Success response:

```json
{
  "message": "Category has been created successfully",
  "data": {
    "id": 1,
    "category_name": "Electronics",
    "uploadby": "admin@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

- Error responses: unhandled server errors would become `500`.
- Example request:

```http
POST /addcategory
Content-Type: application/json

{"category_name":"Electronics","uploadby":"admin@example.com"}
```

- Example response: see success response above.
- Related database tables: `categories`
- Controller: `createCategory`
- Service: none
- Model used: `db.category` from `Model/category.js`
- Notes: earlier image-upload logic is commented out; category images are not active.

### GET /getallcategory

- Description: Return all categories.
- Files involved: `index.js:57`, `controllers/categoryController.js:28-40`, `Model/category.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: none
- Request body: none
- Validation rules: none
- Response body: array of categories
- Success response:

```json
[
  {
    "id": 1,
    "category_name": "Electronics",
    "uploadby": "admin@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

- Error responses: `404` with `{ "message": "No Category Found" }` if `findAll()` somehow returns a falsy value; otherwise server errors become `500`.
- Example request:

```http
GET /getallcategory
```

- Example response: see success response above.
- Related database tables: `categories`
- Controller: `getCategory`
- Service: none
- Model used: `db.category` from `Model/category.js`

### GET /getsignlecategory/:id

- Description: Return category rows matching one id.
- Files involved: `index.js:58`, `controllers/categoryController.js:42-52`, `Model/category.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: `id` - category id
- Request body: none
- Validation rules: valid numeric id expected.
- Response body: array, not object, because controller uses `findAll()`
- Success response:

```json
[
  {
    "id": 1,
    "category_name": "Electronics",
    "uploadby": "admin@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

- Error responses: unhandled server errors would become `500`.
- Example request:

```http
GET /getsignlecategory/1
```

- Example response: see success response above.
- Related database tables: `categories`
- Controller: `getsingleCategory`
- Service: none
- Model used: `db.category` from `Model/category.js`

### PATCH /updatecategory/:id

- Description: Rename a category.
- Files involved: `index.js:60`, `controllers/categoryController.js:69-112`, `Model/category.js`
- Authentication required: No
- Headers: `Content-Type: application/json`
- Query parameters: none
- Path parameters: `id` - category id
- Request body:

```json
{
  "category_name": "Consumer Electronics"
}
```

- Validation rules: controller only reads `category_name`.
- Response body: Sequelize update result array, typically `[1]`
- Success response:

```json
[1]
```

- Error responses: unhandled server errors would become `500`.
- Example request:

```http
PATCH /updatecategory/1
Content-Type: application/json

{"category_name":"Consumer Electronics"}
```

- Example response:

```json
[1]
```

- Related database tables: `categories`
- Controller: `updateCategory`
- Service: none
- Model used: `db.category` from `Model/category.js`
- Notes: route is unprotected.

### DELETE /deletecategory/:id

- Description: Delete a category by id.
- Files involved: `index.js:59`, `controllers/categoryController.js:54-67`, `Model/category.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: `id` - category id
- Request body: none
- Validation rules: none
- Response body: `{ message }`
- Success response:

```json
{
  "message": "Category Deleted Succesfully"
}
```

- Error responses: unknown id returns `400` with `{ "message": "No such Category found." }`; unhandled server errors become `500`.
- Example request:

```http
DELETE /deletecategory/1
```

- Example response: see success response above.
- Related database tables: `categories`
- Controller: `deleteCategory`
- Service: none
- Model used: `db.category` from `Model/category.js`
- Notes: there is no safeguard for child subcategories or products.

## Subcategories

### POST /addsubcategory

- Description: Create a subcategory under a category.
- Files involved: `index.js:63`, `controllers/subCategoryController.js:4-13`, `Model/subCategory.js`
- Authentication required: No
- Headers: `Content-Type: application/json`
- Query parameters: none
- Path parameters: none
- Request body:

```json
{
  "category_id": 1,
  "subcategory_name": "Mobiles",
  "uploadby": "admin@example.com"
}
```

- Validation rules: `category_id` and `subcategory_name` are required by the model.
- Response body: created subcategory row
- Success response:

```json
{
  "id": 1,
  "category_id": 1,
  "subcategory_name": "Mobiles",
  "uploadby": "admin@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

- Error responses: thrown controller errors would become `500`.
- Example request:

```http
POST /addsubcategory
Content-Type: application/json

{"category_id":1,"subcategory_name":"Mobiles","uploadby":"admin@example.com"}
```

- Example response: see success response above.
- Related database tables: `subcategory`, `categories`
- Controller: `AddSubCategory`
- Service: none
- Model used: `db.subcategory` from `Model/subCategory.js`

### GET /getallsubcategory

- Description: Return all subcategories with their parent category included.
- Files involved: `index.js:64`, `controllers/subCategoryController.js:15-29`, `Model/subCategory.js`, `Model/category.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: none
- Request body: none
- Validation rules: none
- Response body: array of subcategory rows with nested category object
- Success response:

```json
[
  {
    "id": 1,
    "category_id": 1,
    "subcategory_name": "Mobiles",
    "uploadby": "admin@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "category": {
      "id": 1,
      "category_name": "Electronics",
      "uploadby": "admin@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
]
```

- Error responses: unhandled server errors would become `500`.
- Example request:

```http
GET /getallsubcategory
```

- Example response: see success response above.
- Related database tables: `subcategory`, `categories`
- Controller: `getAllSubCategory`
- Service: none
- Model used: `db.subcategory` with included `db.category`

### GET /getsinglesubcat

- Description: Intended to return one subcategory, but the route is misconfigured.
- Files involved: `index.js:65`, `controllers/subCategoryController.js:31-40`, `Model/subCategory.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: none declared
- Request body: none
- Validation rules: controller expects `req.params.id`, but the route does not provide `:id`.
- Response body: likely `null` or an ineffective lookup result
- Success response: behavior is uncertain because the route definition and controller do not match.
- Error responses: unhandled server errors would become `500`.
- Example request:

```http
GET /getsinglesubcat
```

- Example response: uncertain; do not rely on this endpoint without fixing the backend.
- Related database tables: `subcategory`
- Controller: `getSingleSubCat`
- Service: none
- Model used: `db.subcategory` from `Model/subCategory.js`
- Notes: this is a backend bug that directly affects frontend planning.

### PATCH /updatesubcat/:id

- Description: Update a subcategory by id.
- Files involved: `index.js:67`, `controllers/subCategoryController.js:54-66`, `Model/subCategory.js`
- Authentication required: No
- Headers: `Content-Type: application/json`
- Query parameters: none
- Path parameters: `id` - subcategory id
- Request body:

```json
{
  "category_id": 1,
  "subcategory_name": "Smartphones",
  "uploadby": "admin@example.com"
}
```

- Validation rules: request body is passed straight into `update()`.
- Response body: `{ status, data }`
- Success response:

```json
{
  "status": 1,
  "data": {
    "category_id": 1,
    "subcategory_name": "Smartphones",
    "uploadby": "admin@example.com"
  }
}
```

- Error responses: thrown errors become `500`.
- Example request:

```http
PATCH /updatesubcat/1
Content-Type: application/json

{"category_id":1,"subcategory_name":"Smartphones","uploadby":"admin@example.com"}
```

- Example response: see success response above.
- Related database tables: `subcategory`
- Controller: `updateSubCat`
- Service: none
- Model used: `db.subcategory` from `Model/subCategory.js`

### DELETE /removesubcate/:id

- Description: Delete a subcategory by id.
- Files involved: `index.js:66`, `controllers/subCategoryController.js:43-52`, `Model/subCategory.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: `id` - subcategory id
- Request body: none
- Validation rules: none
- Response body: raw destroy count
- Success response:

```json
1
```

- Error responses: thrown errors become `500`.
- Example request:

```http
DELETE /removesubcate/1
```

- Example response:

```json
1
```

- Related database tables: `subcategory`
- Controller: `removeSubCat`
- Service: none
- Model used: `db.subcategory` from `Model/subCategory.js`

## Products

### POST /addProduct

- Description: Create a new product with one or more uploaded images.
- Files involved: `index.js:70`, `middleware/verifyToken.js`, `middleware/multer.js`, `controllers/productController.js:145-164`, `Model/product.js`
- Authentication required: Yes, Bearer token
- Headers: `Authorization: Bearer <jwt>`, `Content-Type: multipart/form-data`
- Query parameters: none
- Path parameters: none
- Request body: multipart form with fields `subcateId`, `name`, `price`, `description`, `categ`, optional `place`, optional `uploadby`, and one or more `image` files.
- Example multipart fields:

```text
subcateId=1
name=iPhone 15
price=79999
description=Latest model
categ=1
place=Main carousel
uploadby=vendor@example.com
image=<file1>
image=<file2>
```

- Validation rules: model requires `subcateId`, `name`, `price`, `description`, `categ`, and `image`; controller builds `image` from uploaded files.
- Response body: created product row
- Success response:

```json
{
  "id": 1,
  "subcateId": "1",
  "name": "iPhone 15",
  "price": "79999",
  "description": "Latest model",
  "categ": "1",
  "image": ["image_1710000000000.jpg", "image_1710000001000.jpg"],
  "place": "Main carousel",
  "uploadby": "vendor@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

- Error responses: invalid token returns auth middleware JSON; server error returns `500` with `{ "message": "Something went wrong in add Product ctrl" }`.
- Example request:

```http
POST /addProduct
Authorization: Bearer <jwt>
Content-Type: multipart/form-data
```

- Example response: see success response above.
- Related database tables: inferred `Product` table
- Controller: `addProduct`
- Service: none
- Model used: `db.product` from `Model/product.js`
- Notes: uploaded files are stored in `upload/images` and served from `/upload/images/<filename>`.

### GET /getSingleProduct/:id

- Description: Return one product by id.
- Files involved: `index.js:71`, `controllers/productController.js:180-195`, `Model/product.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: `id` - product id
- Request body: none
- Validation rules: valid numeric id expected.
- Response body: one product object with `image` parsed to an array
- Success response:

```json
{
  "id": 1,
  "subcateId": 1,
  "name": "iPhone 15",
  "price": 79999,
  "description": "Latest model",
  "categ": 1,
  "image": ["image_1710000000000.jpg", "image_1710000001000.jpg"],
  "place": "Main carousel",
  "uploadby": "vendor@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

- Error responses: `500` with `{ "message": "Something went wrong in get Product by id ctrl" }`.
- Example request:

```http
GET /getSingleProduct/1
```

- Example response: see success response above.
- Related database tables: inferred `Product` table
- Controller: `getProductById`
- Service: none
- Model used: `db.product` from `Model/product.js`

### GET /getAllProduct

- Description: Return all products.
- Files involved: `index.js:72`, `controllers/productController.js:167-178`, `Model/product.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: none
- Request body: none
- Validation rules: none
- Response body: array of product objects with `image` parsed to arrays
- Success response:

```json
[
  {
    "id": 1,
    "subcateId": 1,
    "name": "iPhone 15",
    "price": 79999,
    "description": "Latest model",
    "categ": 1,
    "image": ["image_1710000000000.jpg", "image_1710000001000.jpg"],
    "place": "Main carousel",
    "uploadby": "vendor@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

- Error responses: unhandled errors become `500`.
- Example request:

```http
GET /getAllProduct
```

- Example response: see success response above.
- Related database tables: inferred `Product` table
- Controller: `getAllProduct`
- Service: none
- Model used: `db.product` from `Model/product.js`

### GET /getProductByCate/:id

- Description: Return all products for one category id.
- Files involved: `index.js:73`, `controllers/productController.js:198-211`, `Model/product.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: `id` - category id used against `Product.categ`
- Request body: none
- Validation rules: valid numeric category id expected.
- Response body: array of products
- Success response: same shape as `GET /getAllProduct`, filtered by category.
- Error responses: `500` with `{ "message": "Something went wrong in get Product by category ctrl" }`.
- Example request:

```http
GET /getProductByCate/1
```

- Example response: array of filtered product objects.
- Related database tables: inferred `Product` table, logical link to `categories`
- Controller: `getProductByCategory`
- Service: none
- Model used: `db.product` from `Model/product.js`

### GET /getProductByCategAndSubCate/:subcate/:categ

- Description: Return products filtered by both subcategory and category.
- Files involved: `index.js:74`, `controllers/productController.js:213-227`, `Model/product.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: `subcate` - subcategory id; `categ` - category id
- Request body: none
- Validation rules: both path params are used directly in the Sequelize `where` clause.
- Response body: array of products
- Success response: same product shape as `GET /getAllProduct`.
- Error responses: controller only logs on failure and does not send a clear error body.
- Example request:

```http
GET /getProductByCategAndSubCate/2/1
```

- Example response: array of filtered product objects.
- Related database tables: inferred `Product` table, logical links to `categories` and `subcategory`
- Controller: `getProductByCategAndSubCate`
- Service: none
- Model used: `db.product` from `Model/product.js`

### POST /updateProductImg/:id

- Description: Append one or more new images to an existing product.
- Files involved: `index.js:75`, `middleware/multer.js`, `controllers/productController.js:243-281`, `Model/product.js`
- Authentication required: No
- Headers: `Content-Type: multipart/form-data`
- Query parameters: none
- Path parameters: `id` - product id
- Request body: multipart form with one or more `image` files
- Validation rules: controller reads existing product, parses stored image JSON, and appends uploaded filenames.
- Response body: `{ "message": "Updated  Successfully" }`
- Success response:

```json
{
  "message": "Updated  Successfully"
}
```

- Error responses: `500` with `{ "message": "Something went wrong in update Product by id ctrl" }`.
- Example request:

```http
POST /updateProductImg/1
Content-Type: multipart/form-data
```

- Example response: see success response above.
- Related database tables: inferred `Product` table
- Controller: `updateProductImgById`
- Service: none
- Model used: `db.product` from `Model/product.js`
- Notes: route is unprotected; this function is defined twice in the file and the later definition is the active one.

### POST /specificImgDelete/:id/:index

- Description: Delete one product image by its array index.
- Files involved: `index.js:76`, `controllers/productController.js:283-317`, `Model/product.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: `id` - product id; `index` - image array index
- Request body: none
- Validation rules: controller expects the product to exist and the index to point to a valid image element.
- Response body: raw Sequelize update result
- Success response:

```json
[1]
```

- Error responses: `500` with `{ "message": "Something went wrong in specific img ctrl" }`.
- Example request:

```http
POST /specificImgDelete/1/0
```

- Example response:

```json
[1]
```

- Related database tables: inferred `Product` table
- Controller: `specificImgDelete`
- Service: none
- Model used: `db.product` from `Model/product.js`
- Notes: likely buggy because it deletes from `../uploads/` instead of `upload/images`; it also uses `POST` instead of `DELETE`.

### PATCH /updateProductDetail/:id

- Description: Update main product fields, and optionally replace the image array if files are included.
- Files involved: `index.js:77`, `middleware/multer.js`, `controllers/productController.js:65-111`, `Model/product.js`
- Authentication required: No
- Headers: `Content-Type: multipart/form-data`
- Query parameters: none
- Path parameters: `id` - product id
- Request body: multipart form with text fields `subcateId`, `name`, `price`, `description`, `categ`, optional `place`, optional `uploadby`, optional repeated `image` files.
- Validation rules: controller parses `price`, `categ`, `subcateId`, and `id` to integers; if image files are present, it replaces `image` with the new filename list.
- Response body: `{ status, data }`
- Success response:

```json
{
  "status": 1,
  "data": {
    "id": 1,
    "subcateId": 1,
    "name": "Updated iPhone 15",
    "price": 80999,
    "description": "Updated description",
    "categ": 1,
    "place": "Hot deal",
    "uploadby": "vendor@example.com"
  }
}
```

- Error responses: unhandled errors become `500`.
- Example request:

```http
PATCH /updateProductDetail/1
Content-Type: multipart/form-data
```

- Example response: see success response above.
- Related database tables: inferred `Product` table
- Controller: `updateProductDetailById`
- Service: none
- Model used: `db.product` from `Model/product.js`
- Notes: route is unprotected.

### DELETE /deleteProduct/:id

- Description: Delete a product by id.
- Files involved: `index.js:78`, `controllers/productController.js:319-331`, `Model/product.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: `id` - product id
- Request body: none
- Validation rules: none
- Response body: `{ "message": "Item Deleted Succesfully" }`
- Success response:

```json
{
  "message": "Item Deleted Succesfully"
}
```

- Error responses: `500` with `{ "message": "Something went wrong in delete Product by id ctrl" }`.
- Example request:

```http
DELETE /deleteProduct/1
```

- Example response: see success response above.
- Related database tables: inferred `Product` table
- Controller: `deleteProductById`
- Service: none
- Model used: `db.product` from `Model/product.js`
- Notes: route is unprotected.

### GET /getproductbyvandor

- Description: Return vendor-filtered products with in-memory pagination.
- Files involved: `index.js:80`, `controllers/productController.js:333-373`, `Model/product.js`
- Authentication required: No
- Headers: none required
- Query parameters: `vendor` - vendor name or `all`; `page` - page number; `pageSize` - items per page
- Path parameters: none
- Request body: none
- Validation rules: `page` and `pageSize` are parsed with `parseInt`; `vendor` drives the filter.
- Response body: `{ products, total, currentpage }`
- Success response:

```json
{
  "products": [
    {
      "id": 1,
      "subcateId": 1,
      "name": "iPhone 15",
      "price": 79999,
      "description": "Latest model",
      "categ": 1,
      "image": ["image_1710000000000.jpg"],
      "place": "Main carousel",
      "uploadby": "vendor@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 3,
  "currentpage": 1
}
```

- Error responses: `500` with `{ "message": "Something went wrong in get Product by id ctrl" }`.
- Example request:

```http
GET /getproductbyvandor?vendor=vendor@example.com&page=1&pageSize=10
```

- Example response: see success response above.
- Related database tables: inferred `Product` table
- Controller: `getProductByVandor`
- Service: none
- Model used: `db.product` from `Model/product.js`
- Notes: `total` means total pages, not total records.

### GET /getproManageByCate

- Description: Return vendor products filtered by category with in-memory pagination.
- Files involved: `index.js:81`, `controllers/productController.js:375-399`, `Model/product.js`
- Authentication required: No
- Headers: none required
- Query parameters: `vandor` - vendor string; `page` - page number; `pageSize` - items per page; `category` - category id
- Path parameters: none
- Request body: none
- Validation rules: all query values are read as strings except `page` and `pageSize`, which are parsed to integers.
- Response body: `{ products, total, currentpage }`
- Success response: same pagination shape as `/getproductbyvandor`.
- Error responses: thrown errors would become `500`.
- Example request:

```http
GET /getproManageByCate?vandor=vendor@example.com&page=1&pageSize=10&category=1
```

- Example response: paginated product payload.
- Related database tables: inferred `Product` table
- Controller: `getProManageByCate`
- Service: none
- Model used: `db.product` from `Model/product.js`
- Notes: query key is misspelled as `vandor` in code and must match that.

### GET /getProManageBySub

- Description: Return vendor products filtered by category and subcategory with in-memory pagination.
- Files involved: `index.js:82`, `controllers/productController.js:401-424`, `Model/product.js`
- Authentication required: No
- Headers: none required
- Query parameters: `vandor`, `page`, `pageSize`, `category`, `subcate`
- Path parameters: none
- Request body: none
- Validation rules: query keys are used directly in the `where` clause.
- Response body: `{ products, total, currentpage }`
- Success response: same pagination shape as `/getproductbyvandor`.
- Error responses: thrown errors would become `500`.
- Example request:

```http
GET /getProManageBySub?vandor=vendor@example.com&page=1&pageSize=10&category=1&subcate=2
```

- Example response: paginated product payload.
- Related database tables: inferred `Product` table
- Controller: `getProManageBySub`
- Service: none
- Model used: `db.product` from `Model/product.js`

### GET /getProOnNext

- Description: Another paginated vendor/product fetch endpoint with conditional filtering.
- Files involved: `index.js:83`, `controllers/productController.js:426-461`, `Model/product.js`
- Authentication required: No
- Headers: none required
- Query parameters: `vendor`, `page`, `pageSize`, optional `category`, optional `subcate`
- Path parameters: none
- Request body: none
- Validation rules: `page` and `pageSize` are parsed to integers.
- Response body: `{ products, total, currentpage }`
- Success response: same pagination shape as `/getproductbyvandor`.
- Error responses: controller mostly logs errors instead of returning structured failures.
- Example request:

```http
GET /getProOnNext?vendor=all&page=1&pageSize=10&category=1&subcate=2
```

- Example response: paginated product payload.
- Related database tables: inferred `Product` table
- Controller: `getProOnNext`
- Service: none
- Model used: `db.product` from `Model/product.js`
- Notes: the conditional logic is flawed, so category/subcategory filters may not behave as the route name suggests.

## Orders and Payments

### GET /getallorder

- Description: Return all stored customer orders.
- Files involved: `index.js:88`, `controllers/orderController.js:9-21`, `Model/customerOrder.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: none
- Request body: none
- Validation rules: none
- Response body: array of order rows
- Success response:

```json
[
  {
    "id": 1,
    "name": "Anand",
    "email": "anand@example.com",
    "address": "123 Main St",
    "city": "Ahmedabad",
    "pincode": 380001,
    "phone": 9999999999,
    "status": "pending",
    "products": [
      {
        "id": 1,
        "name": "iPhone 15",
        "price": 79999
      }
    ],
    "quantity": 1,
    "total": 79999,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

- Error responses: if `findAll()` returned falsy the code would send `500` with `"Customer order not Found"`; other failures become `500`.
- Example request:

```http
GET /getallorder
```

- Example response: see success response above.
- Related database tables: `customerOders`
- Controller: `getAllCustomerOrders`
- Service: none
- Model used: `db.customerOrder` from `Model/customerOrder.js`
- Notes: route is unprotected.

### GET /getsingleorder/:id

- Description: Return one order by id, wrapped in an array because the controller uses `findAll()`.
- Files involved: `index.js:89`, `controllers/orderController.js:24-40`, `Model/customerOrder.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: `id` - order id
- Request body: none
- Validation rules: valid numeric id expected.
- Response body: array with one order, or error message
- Success response:

```json
[
  {
    "id": 1,
    "name": "Anand",
    "email": "anand@example.com",
    "address": "123 Main St",
    "city": "Ahmedabad",
    "pincode": 380001,
    "phone": 9999999999,
    "status": "pending",
    "products": [
      {
        "id": 1,
        "name": "iPhone 15",
        "price": 79999
      }
    ],
    "quantity": 1,
    "total": 79999,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

- Error responses: missing order returns `404` with `"The Customer Order you are looking for is not available!"`; other failures become `500`.
- Example request:

```http
GET /getsingleorder/1
```

- Example response: see success response above.
- Related database tables: `customerOders`
- Controller: `getSingleCustomerOrder`
- Service: none
- Model used: `db.customerOrder` from `Model/customerOrder.js`

### POST /addorder

- Description: Create a Razorpay order object for checkout. This does not save the order to MySQL yet.
- Files involved: `index.js:90`, `controllers/orderController.js:124-158`
- Authentication required: No
- Headers: `Content-Type: application/json`
- Query parameters: none
- Path parameters: none
- Request body:

```json
{
  "total": 79999
}
```

- Validation rules: controller uses `req.body.total`; amount is converted to paise via `total * 100`.
- Response body: raw Razorpay order response
- Success response:

```json
{
  "id": "order_Q123456789",
  "entity": "order",
  "amount": 7999900,
  "amount_paid": 0,
  "amount_due": 7999900,
  "currency": "INR",
  "receipt": "receipt_order_74394",
  "status": "created"
}
```

- Error responses: `500` with `"Some error occured"` or raw Razorpay/server error object.
- Example request:

```http
POST /addorder
Content-Type: application/json

{"total":79999}
```

- Example response: see success response above.
- Related database tables: none written here; payment gateway only
- Controller: `addCustomerOrder`
- Service: none
- Model used: none in this step
- Notes: actual order persistence happens later in `/success`.

### POST /success

- Description: Verify Razorpay payment signature and save the order to MySQL.
- Files involved: `index.js:94`, `controllers/orderController.js:160-197`, `Model/customerOrder.js`
- Authentication required: No
- Headers: `Content-Type: application/json`
- Query parameters: none
- Path parameters: none
- Request body:

```json
{
  "orderCreationId": "order_Q123456789",
  "razorpayPaymentId": "pay_Q123456789",
  "razorpayOrderId": "order_Q123456789",
  "razorpaySignature": "generated_signature_here",
  "data": {
    "name": "Anand",
    "email": "anand@example.com",
    "address": "123 Main St",
    "city": "Ahmedabad",
    "pincode": 380001,
    "phone": 9999999999,
    "status": "pending",
    "products": [
      {
        "id": 1,
        "name": "iPhone 15",
        "price": 79999
      }
    ],
    "quantity": 1,
    "total": 79999
  }
}
```

- Validation rules: all top-level Razorpay ids/signature must exist; `data` must satisfy the order model fields; signature is verified against a hardcoded secret string.
- Response body: `{ msg, orderId, paymentId }`
- Success response:

```json
{
  "msg": "success",
  "orderId": "order_Q123456789",
  "paymentId": "pay_Q123456789"
}
```

- Error responses: invalid signature returns `400` with `{ "msg": "Transaction not legit!" }`; other failures return `500`.
- Example request:

```http
POST /success
Content-Type: application/json

{"orderCreationId":"order_Q123456789","razorpayPaymentId":"pay_Q123456789","razorpayOrderId":"order_Q123456789","razorpaySignature":"generated_signature_here","data":{"name":"Anand","email":"anand@example.com","address":"123 Main St","city":"Ahmedabad","pincode":380001,"phone":9999999999,"status":"pending","products":[{"id":1,"name":"iPhone 15","price":79999}],"quantity":1,"total":79999}}
```

- Example response: see success response above.
- Related database tables: `customerOders`
- Controller: `paymentCapture`
- Service: none
- Model used: `db.customerOrder` from `Model/customerOrder.js`
- Notes: this is the endpoint that actually saves the order row.

### PATCH /updateorder/:id

- Description: Update an order row by id.
- Files involved: `index.js:92`, `controllers/orderController.js:214-229`, `Model/customerOrder.js`
- Authentication required: No
- Headers: `Content-Type: application/json`
- Query parameters: none
- Path parameters: `id` - order id
- Request body:

```json
{
  "data": {
    "status": "processing"
  }
}
```

- Validation rules: controller expects a nested `data` object.
- Response body: `{ status, data }`
- Success response:

```json
{
  "status": [1],
  "data": {
    "status": "processing"
  }
}
```

- Error responses: server errors become `500`.
- Example request:

```http
PATCH /updateorder/1
Content-Type: application/json

{"data":{"status":"processing"}}
```

- Example response: see success response above.
- Related database tables: `customerOders`
- Controller: `updateCustomerOrder`
- Service: none
- Model used: `db.customerOrder` from `Model/customerOrder.js`
- Notes: route is unprotected.

### DELETE /deleteorder/:id

- Description: Delete an order by id.
- Files involved: `index.js:91`, `controllers/orderController.js:199-212`, `Model/customerOrder.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: `id` - order id
- Request body: none
- Validation rules: none
- Response body: `{ data, id }` where `data` is the destroy count
- Success response:

```json
{
  "data": 1,
  "id": "1"
}
```

- Error responses: server errors become `500`.
- Example request:

```http
DELETE /deleteorder/1
```

- Example response: see success response above.
- Related database tables: `customerOders`
- Controller: `deleteCustomerOrder`
- Service: none
- Model used: `db.customerOrder` from `Model/customerOrder.js`
- Notes: route is unprotected.

## FAQ

### GET /getFaq/:id

- Description: Return FAQ rows matching one id.
- Files involved: `index.js:97`, `controllers/faqCtrl.js:4-16`, `Model/faq.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: `id` - FAQ id
- Request body: none
- Validation rules: valid numeric id expected.
- Response body: array because controller uses `findAll()`
- Success response:

```json
[
  {
    "id": 1,
    "title": "Shipping",
    "ques": "How long does shipping take?",
    "ans": "3 to 5 business days",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

- Error responses: server errors become `500`.
- Example request:

```http
GET /getFaq/1
```

- Example response: see success response above.
- Related database tables: inferred `Faq` table
- Controller: `getFaq`
- Service: none
- Model used: `db.faq` from `Model/faq.js`

### GET /getAllFaq

- Description: Return all FAQs.
- Files involved: `index.js:98`, `controllers/faqCtrl.js:18-26`, `Model/faq.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: none
- Request body: none
- Validation rules: none
- Response body: array of FAQ rows
- Success response:

```json
[
  {
    "id": 1,
    "title": "Shipping",
    "ques": "How long does shipping take?",
    "ans": "3 to 5 business days",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

- Error responses: server errors become `500`.
- Example request:

```http
GET /getAllFaq
```

- Example response: see success response above.
- Related database tables: inferred `Faq` table
- Controller: `getAllFaq`
- Service: none
- Model used: `db.faq` from `Model/faq.js`

### POST /addFaq

- Description: Create an FAQ entry.
- Files involved: `index.js:99`, `controllers/faqCtrl.js:28-36`, `Model/faq.js`
- Authentication required: No
- Headers: `Content-Type: application/json`
- Query parameters: none
- Path parameters: none
- Request body:

```json
{
  "title": "Shipping",
  "ques": "How long does shipping take?",
  "ans": "3 to 5 business days"
}
```

- Validation rules: `title` and `ques` are required by the model.
- Response body: created FAQ row
- Success response:

```json
{
  "id": 1,
  "title": "Shipping",
  "ques": "How long does shipping take?",
  "ans": "3 to 5 business days",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

- Error responses: server errors become `500`.
- Example request:

```http
POST /addFaq
Content-Type: application/json

{"title":"Shipping","ques":"How long does shipping take?","ans":"3 to 5 business days"}
```

- Example response: see success response above.
- Related database tables: inferred `Faq` table
- Controller: `createFaq`
- Service: none
- Model used: `db.faq` from `Model/faq.js`

### PATCH /updateFaq/:id

- Description: Update one FAQ by id.
- Files involved: `index.js:100`, `controllers/faqCtrl.js:38-50`, `Model/faq.js`
- Authentication required: No
- Headers: `Content-Type: application/json`
- Query parameters: none
- Path parameters: `id` - FAQ id
- Request body:

```json
{
  "title": "Shipping Updates",
  "ques": "How long does shipping take?",
  "ans": "2 to 4 business days"
}
```

- Validation rules: request body is passed directly into `update()`.
- Response body: `{ "message": "Faq Updated Successfully" }`
- Success response:

```json
{
  "message": "Faq Updated Successfully"
}
```

- Error responses: server errors become `500`.
- Example request:

```http
PATCH /updateFaq/1
Content-Type: application/json

{"title":"Shipping Updates","ques":"How long does shipping take?","ans":"2 to 4 business days"}
```

- Example response: see success response above.
- Related database tables: inferred `Faq` table
- Controller: `updateFaq`
- Service: none
- Model used: `db.faq` from `Model/faq.js`

### DELETE /deleteFaq/:id

- Description: Delete an FAQ by id.
- Files involved: `index.js:101`, `controllers/faqCtrl.js:52-64`, `Model/faq.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: `id` - FAQ id
- Request body: none
- Validation rules: none
- Response body: `{ "message": "Deleted succesfully" }`
- Success response:

```json
{
  "message": "Deleted succesfully"
}
```

- Error responses: server errors become `500`.
- Example request:

```http
DELETE /deleteFaq/1
```

- Example response: see success response above.
- Related database tables: inferred `Faq` table
- Controller: `deleteFaq`
- Service: none
- Model used: `db.faq` from `Model/faq.js`

## Contact

### POST /addcontact

- Description: Create a contact message.
- Files involved: `index.js:106`, `controllers/contactController.js:6-13`, `Model/contact.js`
- Authentication required: No
- Headers: `Content-Type: application/json`
- Query parameters: none
- Path parameters: none
- Request body:

```json
{
  "name": "Anand",
  "email": "anand@example.com",
  "subject": "Need help",
  "message": "Please contact me about my order."
}
```

- Validation rules: `name`, `email`, `subject`, and `message` are required by the model.
- Response body: `{ message, data }`
- Success response:

```json
{
  "message": "Message has been sended succesfully",
  "data": {
    "id": 1,
    "name": "Anand",
    "email": "anand@example.com",
    "subject": "Need help",
    "message": "Please contact me about my order.",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

- Error responses: thrown errors become `500`.
- Example request:

```http
POST /addcontact
Content-Type: application/json

{"name":"Anand","email":"anand@example.com","subject":"Need help","message":"Please contact me about my order."}
```

- Example response: see success response above.
- Related database tables: inferred `contact` table
- Controller: `addContact`
- Service: none
- Model used: `db.contact` from `Model/contact.js`

### GET /getAllcontact

- Description: Return all contact messages.
- Files involved: `index.js:104`, `controllers/contactController.js:15-22`, `Model/contact.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: none
- Request body: none
- Validation rules: none
- Response body: array of contact rows
- Success response:

```json
[
  {
    "id": 1,
    "name": "Anand",
    "email": "anand@example.com",
    "subject": "Need help",
    "message": "Please contact me about my order.",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

- Error responses: thrown errors become `500`.
- Example request:

```http
GET /getAllcontact
```

- Example response: see success response above.
- Related database tables: inferred `contact` table
- Controller: `getAllContact`
- Service: none
- Model used: `db.contact` from `Model/contact.js`
- Notes: this endpoint returns HTTP `201`, not the usual `200`.

### GET /getcontact/:id

- Description: Return one contact message by id.
- Files involved: `index.js:105`, `controllers/contactController.js:24-34`, `Model/contact.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: `id` - contact message id
- Request body: none
- Validation rules: valid numeric id expected.
- Response body: one contact row or `null`
- Success response:

```json
{
  "id": 1,
  "name": "Anand",
  "email": "anand@example.com",
  "subject": "Need help",
  "message": "Please contact me about my order.",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

- Error responses: thrown errors become `500`.
- Example request:

```http
GET /getcontact/1
```

- Example response: see success response above.
- Related database tables: inferred `contact` table
- Controller: `getOneContact`
- Service: none
- Model used: `db.contact` from `Model/contact.js`
- Notes: this endpoint returns HTTP `201`, not `200`.

### PATCH /updatecontact/:id

- Description: Update a contact message by id.
- Files involved: `index.js:108`, `controllers/contactController.js:49-65`, `Model/contact.js`
- Authentication required: No
- Headers: `Content-Type: application/json`
- Query parameters: none
- Path parameters: `id` - contact message id
- Request body:

```json
{
  "subject": "Updated subject",
  "message": "Updated message"
}
```

- Validation rules: controller first loads the row; if found, it updates with the raw request body.
- Response body: `{ Message, updatedData }`
- Success response:

```json
{
  "Message": "Data Updated Successfully",
  "updatedData": [1]
}
```

- Error responses: missing row returns `401` with `{ "Message": "User not found" }`; other failures become `500`.
- Example request:

```http
PATCH /updatecontact/1
Content-Type: application/json

{"subject":"Updated subject","message":"Updated message"}
```

- Example response: see success response above.
- Related database tables: inferred `contact` table
- Controller: `updateContact`
- Service: none
- Model used: `db.contact` from `Model/contact.js`
- Notes: endpoint returns HTTP `201` on success.

### DELETE /deletecontact/:id

- Description: Delete a contact message by id.
- Files involved: `index.js:107`, `controllers/contactController.js:37-47`, `Model/contact.js`
- Authentication required: No
- Headers: none required
- Query parameters: none
- Path parameters: `id` - contact message id
- Request body: none
- Validation rules: none
- Response body: `{ Message, data }`
- Success response:

```json
{
  "Message": "data deleted succesfully",
  "data": 1
}
```

- Error responses: thrown errors become `500`.
- Example request:

```http
DELETE /deletecontact/1
```

- Example response: see success response above.
- Related database tables: inferred `contact` table
- Controller: `deleteContact`
- Service: none
- Model used: `db.contact` from `Model/contact.js`
- Notes: endpoint returns HTTP `201` on success.

