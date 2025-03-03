Letter Sharing Web App

This web app is heavily influenced by another pen pal app called Slowly https://slowly.app/

Pen pal is a relationship between two people where they write and exchange letters to each other. Popular during the older days before the social media and instant messaging became prevalent.  Although it fell out of fashion, there was still a need to communicate with someone similar to how people have been pen pals in the past. Apps like Slowly and other sites that offer similar services have filled that gap.

Users are able to create an account on our platform and start exchanging letters with strangers. Letters can range from short to long and takes time to be delivered to someone depending on distance between people exchanging letters.

This web app is made with intention that it shouldn’t steer away from what it’s meant to be. A platform for finding fellow pen pals and being able to exchange letters with people. So there must be principles that we stick with. Same principles that draw people to having pen pals in the first place.

1. Anonymity - Due to technological advancements, privacy has become concern that’s often forgotten. It is vital that the amount of information that a user can share is restricted and protected. 
2. Anticipation - Letters that are shared are meant to take long to arrive. It builds anticipation and people are rewarded for their patience. Short delivery or instant deliveries fail to make people realise the importance of distance and especially importance of someone.
3. Platonic friendship - Users should not be incentivised to use the web app in order to look for relationships. Failure of previous 2 principles often attracts a crowd not interested in exchanging letters and alienate people who want to exchange letters

Features

- Session Persistence 
- Account login and creation
- Storage of account information, name, password, location and friends
- Storage of letters, sender, recipient, posted date, arrival date, length
- Relation between accounts. Sort through accounts that an user is not friends or friends with
- History of letters between accounts
- Creation of letter to a recipient
- Account edit page
- Hero page explaining the concept and functionality of the web app

Development 

This web will be made using React and its backend will be made with Express. Requests will be made from the front end to express API. The express API will be able to communicate with PostgreSQL server which is a database that holds user details and letters etc. 

Alongside React, it will use react router in order to route pages correctly. A user will always need to be authenticated to reach the pages that create requests to the API. Session details will be stored using cookies and verified at the backend each request in order to handle the correct data

Milestones 

1. Basic react front end and express back end 
2. Kit out the backend with basic request handlers and session persistence 
3. Create the schema for the postgreSQL database
4. Create the database with example data
5. Create functions that interact with the backend
6. Create a request handler to login and store the logged details in cookie 
7. Middleware to check the cookie for login
8. Create request handlers that use functions above
9. Create illustration of all the possible routes and pages for front end
10. Start work on the routes 
11. Logged details context
12. Login route and page
13. Register route and page
14. Navbar
15. Friends browser
16. User page with history of letter
17. Compose letter 
18. Letter modal
19. Letter content hidden until delivery
20. Exchanged letters create mutual friends. letter to letter or open letter to letter
21. Polish navbar, footer
22. Polish menu
23. Toggle switch to no longer receive letters from a user
24. Delete history of letters 
