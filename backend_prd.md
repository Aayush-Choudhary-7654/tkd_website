# 🥋 BACKEND PRD

## ACTIVE TAEKWONDO WEBSITE

---

## 1. 📌 Overview

**Product Name:** ACTIVE TAEKWONDO Backend System
**Type:** API + Database + Admin System

**Objective:**
To build a scalable backend system that:

* Handles student registrations
* Manages inquiries and contacts
* Stores academy data (programs, schedule, gallery)
* Supports future features (payments, dashboard)

---

## 2. 🧩 Core Backend Modules

---

### 👤 2.1 User / Student Management

**Features:**

* Register new students
* Store student details
* View all students (admin)

**Fields:**

* Full Name
* Age
* Phone Number
* Parent Name (if minor)
* Experience Level (Beginner/Intermediate/Advanced)
* Program Enrolled
* Registration Date

---

### 📩 2.2 Contact / Inquiry System

**Features:**

* Store contact form submissions
* Track inquiries

**Fields:**

* Name
* Phone
* Message
* Timestamp

---

### 🥋 2.3 Programs Management

**Features:**

* Add / Edit / Delete programs
* Display on frontend

**Fields:**

* Program Name
* Description
* Age Group
* Schedule
* Fees (optional)
* Image URL

---

### 📅 2.4 Schedule Management

**Features:**

* Manage class timings

**Fields:**

* Day (Mon–Sat)
* Time Slot
* Program Type

---

### 🖼️ 2.5 Gallery Management

**Features:**

* Upload images
* Delete images

**Fields:**

* Image URL
* Category (Training / Events / Competition)
* Upload Date

---

### 🏆 2.6 Achievements Management

**Features:**

* Add achievements

**Fields:**

* Title
* Description
* Image
* Date

---

## 3. 🔐 Admin Panel

**Features:**

* Secure login (Admin only)
* Dashboard overview

### Admin Capabilities:

* View students
* Manage programs
* Update schedule
* Upload gallery images
* View contact inquiries

---

## 4. 🔗 API Design

### Base URL:

`/api/v1/`

---

### 📌 Endpoints

#### Students

* POST `/students` → Register student
* GET `/students` → Get all students

#### Contact

* POST `/contact` → Submit inquiry
* GET `/contact` → Get all inquiries

#### Programs

* GET `/programs`
* POST `/programs`
* PUT `/programs/:id`
* DELETE `/programs/:id`

#### Schedule

* GET `/schedule`
* POST `/schedule`

#### Gallery

* GET `/gallery`
* POST `/gallery`
* DELETE `/gallery/:id`

#### Achievements

* GET `/achievements`
* POST `/achievements`

---

## 5. 🗄️ Database Design

### Recommended DB:

* MongoDB (easy & flexible)
  OR
* MySQL (structured)

---

### Collections / Tables:

#### Students

* id
* name
* age
* phone
* parent_name
* level
* program
* created_at

#### Contacts

* id
* name
* phone
* message
* created_at

#### Programs

* id
* name
* description
* age_group
* schedule
* fees
* image

#### Schedule

* id
* day
* time
* program

#### Gallery

* id
* image_url
* category
* created_at

#### Achievements

* id
* title
* description
* image
* date

---

## 6. ⚙️ Tech Stack

### Backend Options:

* Node.js + Express (Recommended 🔥)
* Django (Python alternative)

### Database:

* MongoDB Atlas (cloud)
* OR MySQL

### File Storage:

* Cloudinary (for images)

---

## 7. 🔐 Security

* JWT Authentication (for admin)
* Password hashing (bcrypt)
* Rate limiting (prevent spam)
* Input validation

---

## 8. ⚡ Performance

* API response < 500ms
* Use caching (optional future)
* Optimize database queries

---

## 9. 🔔 Integrations

* WhatsApp API (lead capture)
* Email notifications (contact form)

---

## 10. 🚀 Deployment

### Backend Hosting:

* Render / Railway / AWS / Vercel (serverless)

### Database:

* MongoDB Atlas

---

## 11. 🔮 Future Enhancements

* Online payment integration
* Attendance system
* Student dashboard login
* Mobile app API support

---

## END OF BACKEND PRD
