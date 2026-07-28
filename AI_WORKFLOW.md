# TOOLS AND MODELS
- AI / AGENT
    - Github Copilot
    - Claude
- Tools
    - Postman (for checking API)

# WORKFLOW
- After reading the requirements I received from my email, I decided to start working with the backend first, since that's where all the important parts of the project are located (OIDC authentication with PKCE, Prisma ORM)

## Backend Workflow
- Here are the key features I implemented, listed from first implemented to last:

  1. Prisma ORM + SQLite database
  2. OIDC authentication + PKCE
  3. Basic API for CRUD Bookmarks and Collections, and API for creating a user
  4. Implement authguard to prevent unauthorized users from accessing private information in the database

- After some time working on the Authguard feature, unfortunately, **my Github Copilot's token for the Free Plan ran out**
- Admittedly, I barely work on the API design

## Frontend Workflow
- For this part, since my Github Copilot token ran out, I decided to switch to using the Free Plan of Claude instead (which is not an agentic AI) to implement features and fix any bugs I found later on
- Here are the key features I implemented, listed from first implemented to last:
  1. AppRouter
  2. Main page for login and navigation between collections and bookmarks pages
  3. Integration test for Log In with OAuth between frontend and backend
  4. Implement Collections Page and API integration tests for: fetching list of collections, fetching bookmarks within one collection, creating collections, and deleting collections
  5. Do the same as step 4, but this time for the Bookmarks Page and Bookmarks-related APIs: fetching list and single bookmarks, filtering based on collection, creating and deleting bookmarks

# 2 Things AI Did Well
1. On the frontend side, the implementation of authguard, API calls, and the web design were really well done. There was barely anything I needed to change besides some parameter name mismatches inside API calls. The same can be said for the implementation of the API on the backend side.
2. Another thing the AI did really well was following the instructions inside the given instruction file, meaning I didn't have to elaborate much in my prompts and still got the desired result.

# 3 Things AI Failed At, How I Recovered
1. At some point during the build, the AI left a temporary variable that was only meant to show a feature worked. When that code was built upon again, the AI treated the temporary code as if it were necessary or intentional, resulting in me having to refer to past projects or manually change parts of the code.
2. The AI sometimes forgot what it had proposed after I asked a few follow-up questions about its proposal, then proceeded to implement incomplete code.
3. After implementing code, the AI agent would run `npm run build` every time to check for errors. Sometimes, when it found an error, it would make large, unwanted changes affecting how modules worked together, resulting in me having to ask the AI to fix it in a follow-up prompt.

# Token Usage Awareness
- Admittedly, this is the first time I've used an AI agent to help build code. I've noticed that many times the AI agent misunderstood my intention or made its own assumptions, then proceeded to build something unrelated or use tools I didn't intend — due to my poorly written prompts. This resulted in a lot of rewrites and, in turn, consumed a lot of tokens.