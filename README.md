# discordBotProject
A personal project for a Discord Bot, integrated with different API's

~help  
This menu lists all the available commands.

~roll  
This will roll two dice, each with values between 1 and 6.

~coin  
This will flip a coin and return head or tail.

~8ball <question>  
Use this command to ask the magic eight ball a question.

~pokemon  
When this command is used by itself, a random pokemon will be chosen for you.
~pokemon <name/id> will return a specific pokemon

~weather <location>  
This command will take either a zipcode, city, or city and country code combination.
e.g. ~weather 95121, ~weather san jose, or ~weather tokyo, jp

~yelp <location>  
This command will take either a zipcode or a city and return a random restaurant in that area.
A search term can also be used after the location and seperated by a comma to narrow down searches. 
e.g ~yelp san jose or ~yelp 95125, korean bbq
  
Specific search of a business can be used by adding a '?' in front of the search term with no space in between.
e.g. ~yelp san jose, ?tacobell - The closest match will be return in this case. When a business has multiple locations, use zipcode to get the closest location.    

This bot can be invited at https://discordapp.com/api/oauth2/authorize?client_id=591099636270235648&permissions=0&scope=bot  
