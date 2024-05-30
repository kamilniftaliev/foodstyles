# FoodStyles

**Required functionality is SUPER EASY BUT, unfortunately, instructions were unclear**. Too many questions made me spend more time thinking about how exactly `extractEntities` function should parse a string in order to split it to chunks that I can deal with. At one point I even thought about parsing it with AI so that I can understand it fully.

Some of the questions are:

1. What if a search term matches multiple types? Which one should I use?
2. Should I start searching for each word again and again every single time or should I skip the already found type? E.g: McDonald's is a brand name. So should I skip looking for brand names for following words?
3. What about words like "in" and "or"? Should I also consider "and", "with", "near", etc.? Because I need to have list of words, behaviors and categorize them to make the functionality work according to the search term.
4. What if the search term starts with "in", "both" or something similar? How should the app behave?
5. Should I store all entity names as slugs too (escaping non-word characters). Because, otherwise it at least hurts performance to escape entity names every single time and makes the code harder to read.

**I can easily implement it again but only if I fully understand the requirements.**

### Follow these steps

#### Prerequisites:

Make sure you have PosgresSQL installed and database with this credentials:

Name: `foodstylesdb`
Username: `foodstyles`
Password: `foodstyles`
Port: `5432`

Fill this database with your mock data.

#### Setup

1. `yarn` - to install all the dependencies
2. `yarn dev` - to run the app
