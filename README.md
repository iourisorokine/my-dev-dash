# [Fresh Mentor](https://fresh-mentor.herokuapp.com)

Ironhack 1st Full Stack Application

# Team

### [André](https://github.com/itstheandre)

### [Iouri](https://github.com/iourisorokine)

# Introduction

During the fifth week of Ironhack Berlin's Full Stack Web Developer Bootcamp, we were challenged to design and create a full stack app. The "industry", or ideation was totally on us.

After some conversation, both me and André figured that we wanted to work with external APIs, and create something that could tackle a pain point.

Both of us had started learning how to code before the Bootcamp and faced the same struggles. We learned alone, we went to some meetups for co-learning and met different people around the city.

One thing was clear, experienced feedback is always tremendously valuable, and learning together is, usually, much more fun.

## Fresh Mentor was created

Using a technology stack based on:

| Programming Languages | External Technologies |
| --------------------- | --------------------: |
| NodeJs                |               NewsAPI |
| ExpressJs             |         EventbriteAPI |
| Handlebars            |         CloudinaryApi |
| MongoDB               |                Multer |
| Mongoose              |          Github OAuth |
| PassportJs            |                     - |
| Bootstrap             |                     - |
| HTML5                 |                     - |
| CSS3                  |                     - |

# Approach

### TMI - Too much information

One pain point is that there is _TOO MUCH INFORMATION_ everywhere. We suffer from information overload. We don't know what to read, and, as soon as we know what to read, we get bombarded with a dozen more articles to read and events that we **MUST** go, if we want to be on top of the game.

As professional developers or developer wannabes, we have much more information to read, than the time to **ever** consume it. However, we tend to always want to learn and read more.

The app creates a personalized news and events feed based on the user's interests and city.

Since news and events are, usually, ephemeral, we also wanted to get a chance for people to store these "cards" for see later. No matter if you can't find a news article in your feed - if you "pinned it", you will always be able to go back and check it.

It is true the answer we're providing is giving you more information, but for now you can check the ones you REALLY want to read later, and provide something more curated. If you're learning Javascript, it doesn't make a lot of sense to confuse you and give you news about the state of C programming.

### Learning alone, sometimes, kind of sucks

After figuring out a way to try and solve the TMI problem. We needed to find a way to connect with fellow developers, learners, and mentors in the same as the user so that the code learning journey can be more enjoyable. Or _at least_, make people suffer together.

As a user creates a chance it is given a chance to choose between three cities (for now): Berlin, Paris, and Lisbon.

For demo purposes, we created a button to add people (on the spot), but in the wild, this app, would serve people once a week.

The user that is served with a _random_ in the same city and, with a larger user base, we can also do more specific randomization - according to interests, previously "pinned news and events", programming level, etc.

We connect developers in the same city and give them a chance to meet, each other. This way, they can learn with and from one another.

## Future Updates

The current news feed is sourced from NewsAPI and EventbriteAPI, but ideally, we would want the user to get access to a bigger amount of sources. Plug in more apis, rss feeds and even content types.

We would love to have a chance for people from other cities to be in the app.

We would want to make the matching algorithm more precise and more specific according to programming level and also get "remote buddies" and "remote mentors"

Obviously, as it stands, the communication between users would be done off-platform. In the future, creating an in-app communication interface would be better (messaging, maybe).

In a somewhat distant future, we could integrate courses from some of the best and established course creators - not creating our own - but more on a recommendation basis. Connecting with some learning sources - some Youtube Channels, some Udemy courses and even some useful websites, like [replit](repl.it) and [Code Wars](https://codewars.com).

### Special Thanks

To the people that helped this app be live right now - the Ironhack teaching staff - [Svenja](https://github.com/Svemakawe), [Bruno](https://github.com/brudolce), [Min](https://github.com/angminsheng), and [Pierre](https://github.com/pierreportal) - to the NewsAPI and EventbriteAPI people that created such incredible interfaces for students and developers to learn more.
