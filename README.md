# Rhythmix - Music Playlist Organizer

## 1. Project Overview

Rhythmix is a DSA-based music playlist organizer built using React. The project provides a modern music-player style interface where users can browse songs, search by title or artist, filter by mood, like songs, view recently played tracks, and generate playlist mixes.

This project was designed to satisfy the CCC project requirement of building a system that uses concepts taught in class, especially Data Structures and Algorithms.

---

## 2. Problem Statement

Music applications often contain a large number of songs, and users need efficient ways to:

- search songs quickly
- organize songs by mood or category
- rank songs by popularity
- generate a good playlist under a fixed time limit

The problem is not only to create a good interface, but also to manage and process song data efficiently using suitable algorithms and data structures.

---

## 3. Objective

The main objectives of this project are:

- to create a realistic GUI-based music playlist organizer
- to apply Data Structures and Algorithms in a practical system
- to show how DSA can improve searching, ranking, grouping, and playlist generation
- to combine class concepts with a user-friendly real-world application

---

## 4. Features

- user-friendly graphical interface
- song browsing interface
- song playback controls
- play, pause, previous, next, and progress bar
- mood-based song filtering
- real-time search by title or artist
- liked songs collection
- recently played songs list
- Top 10 songs ranking
- Smart Mix generation
- Quick Mix generation
- responsive layout for different screen sizes

---

## 5. Technologies Used

- React
- React Router
- JavaScript
- CSS Modules
- Jamendo API

---

## 6. Data Structures and Algorithms Used

This project uses multiple DSA concepts taught in class.

### 6.1 Max Heap

Max Heap is used to rank songs by popularity in the **Top 10** section.

Each song is assigned a popularity score:

```text
score = (0.6 * play_count) + (0.4 * likes)
```

The songs are inserted into a Max Heap, and the highest scoring songs are extracted first.

**Use in project:**
- ranking songs
- showing most popular songs first

**Complexity:**
- insertion: `O(log n)`
- extraction: `O(log n)`
- full ranking: `O(n log n)`

### 6.2 Dynamic Programming

Dynamic Programming is used in the **Smart Mix** section.

The goal is to generate the best playlist under a selected time limit. This is similar to the **0/1 Knapsack Problem**:

- song score = value
- song duration = weight
- time budget = capacity

The algorithm selects the combination of songs that gives the best total value without crossing the time limit.

**Use in project:**
- optimal playlist generation
- best-fit session creation

**Complexity:**
- approximately `O(n * capacity)`

### 6.3 Greedy Algorithm

Greedy Algorithm is used in the **Quick Mix** section.

Songs are selected according to the best score-per-second ratio until the time budget is filled.

**Use in project:**
- fast playlist generation
- quick approximation method

**Complexity:**
- sorting: `O(n log n)`
- selection: `O(n)`

### 6.4 Map

`Map` is used to group songs by mood such as happy, sad, chill, and party.

**Use in project:**
- efficient mood bucketing
- quick filtering by category

**Complexity:**
- average lookup: `O(1)`

### 6.5 Set

`Set` is used to store liked songs.

**Use in project:**
- add/remove liked songs
- check whether a song is already liked

**Complexity:**
- insert: `O(1)`
- delete: `O(1)`
- search: `O(1)`

---

## 7. System Modules

The project is divided into the following modules:

### 7.1 Authentication Module

- login page
- protected dashboard route

### 7.2 Playlist Module

- display songs
- play and manage tracks

### 7.3 Search and Filter Module

- search by song name or artist
- filter by mood

### 7.4 Ranking Module

- Top 10 songs using Max Heap

### 7.5 Mix Generation Module

- Smart Mix using Dynamic Programming
- Quick Mix using Greedy Algorithm

### 7.6 Favorites Module

- like songs
- show liked songs list

---

## 8. Project Structure

```text
music-playlist-organizer/
|-- public/
|   `-- index.html
|-- src/
|   |-- components/
|   |-- context/
|   |-- data/
|   |-- pages/
|   |-- utils/
|   |-- App.jsx
|   |-- index.css
|   `-- index.js
|-- .gitignore
|-- package.json
|-- package-lock.json
`-- README.md
```

---

## 9. How to Run the Project

### Prerequisites

- Node.js
- npm

### Steps

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

---

## 10. Why This Project Matches the CCC Requirement

This project matches the requirement because:

- it is a GUI-based system
- it applies topics taught in class
- it clearly demonstrates Data Structures and Algorithms
- it includes the report details inside the README file
- it is practical and based on a real-world use case

---

## 11. Conclusion

Rhythmix is more than just a music interface. It is a DSA-based application that combines practical user interaction with algorithmic problem solving. By using Max Heap, Dynamic Programming, Greedy Algorithm, Map, and Set, the project shows how classroom concepts can be applied in a realistic software system.

This makes it suitable for the CCC project submission both as a working application and as a report-backed DSA project.
