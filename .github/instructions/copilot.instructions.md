# Project Context
- two services for a personal bookmark manager — a private read-later app. A signed-in person
saves links, organises them into collections, and nobody else can see any of it.
The product is deliberately mundane. What makes it interesting is the security property at its centre:
Everything in this app is private to the person who created it. There is no public content, no shared
feed, no "browse other users." If user A can see, edit, or even learn of the existence of user B's data, the
app is broken.

# Backend
- Node.js + TypeScript
- NestJS
- OIDC authentication on every route
- Two resources
	- Each support: get one, list, create, update, delete and filtering
		- /collections : id , name , ownerId , createdAt , updatedAt
		- /bookmarks : id , url , title , notes? , collectionId? , ownerId , createdAt , updatedAt
	- A bookmark belongs to a collection (nullable — a bookmark can be uncategorised), and both belong
to a person. Support GET /collections/:id/bookmarks
	- /me return current signed in person
- SQL Persistence
- Prisma ORM
- Seed data for at least two distinct users

# Frontend
- React + Vite, TypeScript
- React Router >= v8
- MUI >= v9
- Two Pages
	- /collections : list, view one, create, delete
	- /bookmarks : list, view details,create,delete, filter by collection