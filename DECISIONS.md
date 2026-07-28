# ADR 001: Use Cookie-Based JWT Storage for Auth

## Status
Accepted

## Context
We need to persist the access token from Auth0's callback so that
subsequent requests are authenticated. Options considered: `localStorage`,
`sessionStorage`, or an httpOnly cookie.

Since the callback uses `res.redirect()` to return the user to the
frontend, the response carries only a `Location` header — there is no
response body the frontend can read the token from. This rules out
returning the token directly in a JSON response or reading it from
`localStorage`/`sessionStorage`, since both require the token to reach
the frontend as readable data in the first place. A cookie, set via
`Set-Cookie`, is the only mechanism the browser will pick up
automatically from a redirect response.

## Decision
Store the access token in an httpOnly, secure cookie set by the backend
after the OIDC callback, rather than in `localStorage`.

## Consequences
- Slightly more backend logic is required: the `AuthGuard` strategy
  needs to be adjusted to extract the token from the request cookie
  instead of the `Authorization` header, and cookie signing/expiry
  needs to be handled.

---

# ADR 002: Add a Main Page for Login and Navigation Between Collections and Bookmarks

## Status
Accepted

## Context
Two options were considered for structuring login and navigation:
turn the login/logout button into part of a shared layout that wraps
the Collections and Bookmarks pages directly, or create a separate
main page for anonymous users to log in from, which also handles
navigation between the two pages once authenticated.

## Decision
Create a separate main page for anonymous users to log in from, and
use it to control navigation between the Collections and Bookmarks
pages after authentication.

## Consequences
- An authentication guard is needed to prevent unauthenticated users
  from reaching the Collections and Bookmarks pages, redirecting them
  back to the main page to authenticate instead.

---

# ADR 003: Do Not Implement Update for Bookmarks and Collections

## Status
Rejected

## Context
The frontend requirements only specify create, delete, and view
(list, get one, filter) functionality. Updating existing bookmarks
and collections was not requested.

## Decision
The backend already supports `PATCH` and `PUT` for Bookmarks and
Collections, as required on the backend side, and the frontend
already implements everything asked of it. Given that, the update
feature is left out of the frontend.

## Consequences
- A smaller application with less code to maintain and defend.

---

# ADR 004: Let Users Copy Their Collections to Clipboard for Sharing

## Status
Accepted

## Context
Another requirement stated that users may want to share their
collections with others, but didn't specify where or how — whether
collections should be made public and viewable by others inside the
app, or shared outside the app entirely.

## Decision
Rather than adding that complexity, and since a Collection is simply
a group of bookmark URLs, format the collection as readable text and
copy it to the user's clipboard so they can share it through
whatever channel they choose.

## Consequences
- A small adjustment is needed on the Collections page to add a
  share button.
- Users can share their collections anywhere without sharing being
  the application's responsibility.
