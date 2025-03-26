---
layout: post
title: "Keeping the wheels on our six-million-strong enthusiast community"
subtitle: "Lessons learned from building and maintaining the infrastructure of a large multi-platform online community"
---

What is Bapo
- 13 years
- Six million users on Reddit, top 100 (71)
- 100k users on Discord
- Help, discussions, news, massive giveaways (hundreds of thousands of dollars worth)

Our Goals
- Keep the community running
    - Helpful, polite, conducive
    - Also into the future, moving with trends, responding to needs
- Transparency
- Add value for users

Threats we face
- Trolls
  - Disgrunted regulars
  - Disgrunted moderators
- Hackers
- Scammers
- Platforms and partners!

Two types of deployment:
- Keep the community running
    - Automoderator
    - Admin Mail
    - RSL
    - Chat Logger
- Defensive systems (we are just 10 people!)
    - Blastoise (General purpose custom moderation bot)
        - DomainFilter (Block specified and fuzzy-matched domains)
        - Tokenator (Invalidate secrets posted in chat, in response to a vulnerability)
    - Autoresponder (Handling 1000 mod mail messages per hour, just keyword matching and responding)
    - ICBM (Integrated community bot/raid intelligence)
    - Beemo (Raid detection)

Threats typically follow two models:
- Wide but shallow
    - Typically very immediate, little warning
    - Rudimentary
    - Only care about disruption, scale etc.
    - Easily bored or dissuaded, "don't be the slowest when the lion comes" 
    - Examples:
        - Raids
        - Spambots (PUBG Aimbot)
        - Gtits
- Deep but narrow
    - Majority of the workload
    - Long-term trolls
    - High Conflict People 
        - Vendetta, illogical, conspiracy
        - YOU CANNOT HELP THESE PEOPLE
    - Arms race, will seek exploits against you
    - Examples:
        - Benny
        - NS (Disgruntled ex-staff)
20% is deep, but takes 80% of effort


Responses to each type differ:
- Wide
    - Fast response
    - Automation
    - Key individuals (skills we look for in potential team members)
    - Iterate quickly (These things might last 10 minutes, might last 10 days)
    - Examples:
        - Gtits (Pornographic Image Recognition)
        - NS (Staff Application Spam)
- Deep
    - Measured response
    - Over time
    - Surveillance
    - Community outreach and support
    - Work with platforms
    - Clear, documented procedures and policies
    - Examples:
        - Benny

Case Study - Steam/Nitro Scam Bots (Blastoise, DomainFilter, ICBM)
- What
    - Spam Bots + Homograph Attack
    - Free Steam Wallet or Nitro scams with Lookalike URLs
- How
    - Continued for months
    - Spread across communities
    - Increasing numbers of accounts per day
- Response #1 - Blastoise & DomainFilter
- Response #2 - ICBM
- Outcome
    - Caught 97% of 1604 subsequent attempts
- Lessons

Case Study - Gtits (Image recognition, ICBM)
- What
- How
- Response #1 - Image recognition
    - Started by filtering on filenames in URLs, and the usual domain of the host
    - Started using imgur, moved to image recognition
    - For new accounts, basic model to detect skin tones. Not specifically trained on our 'special type of porn'
- Outcome
- Lessons

Case Study - Carding/Fraud Raids (Beemo, Discord DM Alerts)
- ffff

Case Study - Benny (Profiling and NN)
- Long running, so lots of training data
- Take the first posts of users in the community, take Benny's first posts

Honourable mentions 
- Tokenator - Social engineering mitigation with one-hour delivery
- Ansible - Still hands on but easy to deploy and understand
- 


Dealing with Wide Attacks: Flying by the seat of your pants
- All the worst practices!
    - Deploying from local
    - Hotpatching
    - No tests
    - System installation 



Dealing with Deep Attacks: 
- Please write this bit in gpt :)


Dealing with Both: Hail Mary
- Get contacts at these places - cold emails are great for this!
- Regular meetings, sitreps, channels etc. Organization just like any other (i.e. any other business, like 'ours')







Staff application form google scripts for filtering and validating

Times we've needed quick moderation response:
- Reddit released reddit chat without warning us, unmoderated, unmoderatable, unmonitorable
- Raids
    - Gtits, NS

Times we've needed longer, considered responses 
- Benny
    - Watch behaviour over time 


What we do for quick moderation response:

80/20 - push it even further (95% of troll actions can be stopped with the 5% case - getting it out early is the very best option for these)

Effort to get aged accounts into the server stealthily is time consuming and expensive 

Just have to make it difficult enough, don't need to make it bulletproof

Legit looking discord accounts, in volume, are expensive, esp legit to Bapo (Legit accounts with bapo history? Hens Teeth)

act quickly enough, bad actors usually get bored
do not underestimate trolls - discord is not just spats and trolls, it's heavily coordinated efforts

Medi hacked - lesson: always have a security policy, policies are important, don't wing things. Get contacts at these places if you can - invaluable in times of crisis, esp with shit support channels

Ansible - I was one point of failure, add ansible tasks for everything
    - Even non-technical people can do JSON
    - Recruiting non-technical people is a challenge
    - Keep the team in the loop just like anywhere else


Staff application form google scripts for filtering and validating


Able to do unusual or "risky" stuff (eg hamming removals) because we are a small team and have humans in the loop, compare to big companies who can't take as much risk