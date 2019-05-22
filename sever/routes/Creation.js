const express = require('express');
const router = express.Router();
const DButilsAzure = require('../DButils');


router.post('/createDB', (req, res) => {
    DButilsAzure.execQuery(`CREATE TABLE countries(countryID int  PRIMARY KEY,countryName VARCHAR(30))`)
        .then((response, err) => {
            if (err)
                res.status(400).json({location: "counties/then", message: err.message});
            else {
                res.status(201).json({message: "Countries Table was created!"});
            }
        })
        .catch(function (err) {
            if (err.message.startsWith("Violation of PRIMARY KEY constrain")) {
                res.status(400).json({location: "counties/catch/if", message: "Country Name exists"});
            } else {
                res.status(400).json({location: "counties/catch/else", message: err.message});
            }
        });
    for (let i = 0, countries = req.body['countries']; i < countries.length; i++) {
        DButilsAzure.execQuery(`INSERT INTO countries VALUES ('${countries[i][0]}','${countries[i][1]}')`)
            .then((response, err) => {
                if (err)
                    res.status(400).json({location: "counties/then", message: err.message});
                else {
                    res.status(201).json({message: "Countries Added!"});
                }
            })
            .catch(function (err) {
                if (err.message.startsWith("Violation of PRIMARY KEY constrain")) {
                    res.status(400).json({location: "counties/catch/if", message: "Country Name exists"});
                } else {
                    res.status(400).json({location: "counties/catch/else", message: err.message});
                }
            });
    }
    DButilsAzure.execQuery(`SELECT * FROM countries

CREATE TABLE users (
    username varchar(30) PRIMARY KEY,
    password varchar(30) NOT NULL,
    firstName varchar(30),
    lastName varchar(30),
    city varchar(30),
    country int,
    email varchar(50) NOT NULL,
    FOREIGN KEY (country) REFERENCES countries(countryID) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO users
VALUES
(
 'p','1Q2w3e4r','Shawn','Seiref','Beer-Sheva',1,'shawn@post.bgu.ac.il'
),
(
 'a','a','a','a','a',1,'a'
),
(
 'b','b','b','b','b',1,'b'
)

GO

SELECT * FROM users

Create TABLE categories(
    categoryName varchar(100) PRIMARY KEY
);

Create TABLE poi(
    poiID int NOT NULL IDENTITY(1,1) PRIMARY KEY,
    name varchar(50) NOT NULL,
    description nvarchar(max),
    views int NOT NULL,
    image VARCHAR(1000) NOT NULL,
    ranking FLOAT(3) NOT NULL,
 );

CREATE TABLE poi_category(
    poiID int NOT NULL,
    categoryName varchar(100),
    FOREIGN KEY (poiID) REFERENCES poi(poiID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (categoryName) REFERENCES categories(categoryName)  ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (poiID, categoryName)
);



INSERT INTO categories
VALUES
('Restaurant'),('Bar'),('Museum'),('Park'),('EXTREME'),('Sports'),('Street Food'),('Cinema'),('Shows'),('Shopping'),('Tour')
GO

SELECT * FROM categories

INSERT INTO poi
(
 name, description, views, image, ranking
)
VALUES
( -- 1
 'Rosa Bonheur',
 'What is it? Parc des Buttes-Chaumont’s iconic bar.

Why go? What a pretty name for such a bucolic drinking spot, found inside a little house at Buttes-Chaumont’s highest point. Enjoy an apéro beneath the big trees, making the most of the last evening sun as well as the superb view. Don’t miss the impressive selection of house wines and tapas.

Don’t miss? Come during the summer when the park stays open all night – that’s where the party’s at.',
 0,
 'https://media.timeout.com/images/105202179/380/285/image.jpg',
 0
),( -- 2
 'l’Atelier des Lumières',
 'What is it? A brand new 300m2 studio space dedicated to digital art, bang in the middle of the 11th district.

Why go? A former smelting plant,  this building remained empty for almost twenty years until Culturespaces decided to launch the city\`s first ever digital art centre. Its goal? To give the works the attention they deserve by projecting them across the ten-metre high walls using first-rate equipment including 140 film projectors with BARCO lasers, as well as 50 state-of-the-art Nexo speakers. 

Don\`t miss? Have a beer at the excellent Enkore next door.',
0,
 'https://media.timeout.com/images/105313305/380/285/image.jpg',
 0
),( -- 3
 'Little Red Door',
'What is it? For the (undeniably) best cocktails in the capital. 

Why go? Discreetly hidden at 60 rue Charlot, with no door sign, the Little Red Door doesn’t draw attention to itself. With its speakeasy charm and enigmatic entrance, its heady atmosphere and quirky interiors, this Little Red door opens straight into heaven. The menu is unique, take the unusual Art Deco cocktail: Bulleit Rye whiskey, Merlet Cognac, fermented dates with violet tea, served in an incredible glass shaped like a diamond.

Don’t miss? While you’re there, pop into Bisou round the corner, another fantastic cocktail bar...this time with no menu!',
0,
 'https://media.timeout.com/images/105183936/380/285/image.jpg',
 0
),( -- 4
 'Théâtre des Amandiers',
'What is it? A theatre with one of the best programmes in the country.

Why go? Yes, getting there may be a slog for some, but the experience is well worth it. Throughout the year, top actors, choreographers and directors perform on the Amandiers stage, reminding us that nothing compares to the joy of watching live theatre.

Don’t miss? Stop for lunch at the house café.',
0,
 'https://media.timeout.com/images/105313306/380/285/image.jpg',
 0
),( -- 5
 'Piscine Joséphine Baker',
'What is it? The only swimming pool in Paris on a barge.

Why go? This floating swimming pool is a true slice of paradise, with an unbeatable setting. Flanked by the Seine on either side, facing Bercy and only minutes from Bibliothèque Nationale de France-François Mitterrand, the Joséphine Baker barge is the star of the city’s bathing spots. There’s also a handsome pool complex covered by a majestic steel and glass structure by the architect Robert de Busni.

Don’t miss? Follow up your swim with a concert at Petit Bain, which is just a stone’s throw away.',
0,
 'https://media.timeout.com/images/100012907/380/285/image.jpg',
 0
),( -- 6
 'bouquinistes along the Seine',
'What is it? One of Paris’ most classic cultural activities.

Why go? Selling thousands of imprints, there are over 200-second hand booksellers (bouquinistes) lining the banks of the Seine, continuing a tradition that harks back to the 16th century. The wide green makeshift bookshelves chained to the railings should definitely be made a UNESCO World Heritage site.

Don’t miss? Pack a picnic to enjoy on the banks l’Île de la Cité, or a bottle of wine will do.',
0,
 'https://media.timeout.com/images/105313331/380/285/image.jpg',
 0
),( -- 7
 'Eiffel Tower',
'What is it? An unmatchable view that is worth every dizzying moment of the ascent. 

Why go? Is Paris the world’s most beautiful city? You only have to stand on the third floor of the Eiffel Tower – with 360 views and a clear horizon of 65 kilometres in good weather – to know the answer. Check out Gustave Eiffel’s office and treat yourself to a drink at the champagne bar.


Don’t miss? After getting your head back out of the clouds, head to Musée du Quai Branly to visit its unbeatable collection of tribal art.',
0,
 'https://media.timeout.com/images/103168484/380/285/image.jpg',
 0
),( -- 8
 'Parc des Princes',
'What is it? The capital’s flagship football stadium.

Why go? Since the arrival of the Qatari and Neymar in particular, the Parc des Princes has become a tourist hotspot. Football and potential tension with Angers aside, the club now offers a raft of activities across its enclosure, including an escape room that will delight all football fans across the capital.

Dont miss? After the match, everyone heads down to the Brasserie d’Auteuil for Italian fare.',
0,
 'https://media.timeout.com/images/105313332/380/285/image.jpg',
 0
),( -- 9
 'Parc des Buttes-Chaumont cave',
'What is it? A place so wild it could easily be the Gardens of Babylon.

Why go? To escape the cliché of burnt sunbathers piled on top of one another, take refuge in the empty cave of Buttes-Chaumont. A journey through space and time guaranteed.

Dont miss? Take a picture at the Pavillon Puebla, its retro, jungle design will look great on Instagram.',
0,
 'https://media.timeout.com/images/105205189/380/285/image.jpg',
 0
),( -- 10
 'La Belle Hortense',
'What is it? A bookshop for insomniacs in the heart of the Marais.

Why go? If you’re looking for a quiet escape from the hustle and bustle of the Maris, La Belle Hortense is the hideaway of dreams. In this little bar with a charming blue front, you’ll find a gentle, tasteful soundtrack that won’t interrupt your reading, as well as plenty of good wine. This is a genius concept that brings together students, intellectuals and hedonists in equal measure.

Don’t miss? Don’t mini-exhibition in the back room.',
0,
 'https://media.timeout.com/images/105305954/380/285/image.jpg',
 0
),( -- 11
 'Fondation Giacometti',
'What is it? The new art space entirely dedicated to the works of Albert Giacometti.

Why go? In the 350m2 Fondation Giacometti, there are several different exhibition areas, with the most important display being the remodelling of his famous studio. A little busier than Giacometti’s original, this studio groups 70 of his works, including one of the Busts of Lotar – the artist’s famous terracotta sculptures – which is showcased for the very first time. Other previously unseen artefacts include the studio’s walls, previously located on rue Hippolyte-Maindron.

Dont miss? If you’re coming all the way out to the 14th district for Giacometti, ',
0,
 'https://media.timeout.com/images/105180879/380/285/image.jpg',
 0
),( -- 12
 'Comédie-Française',
'What is it? The most famous theatre in the whole of France.

Why go? You don’t need to be a thesp to appreciate the beautiful red and gold finery of the Comédie-Française, a bastion of French theatre in which you can shiver in horror with Phèdre or laugh at poor Orgon’s misfortunes.

Dont miss? Good news for kids, tickets cost as little as €7.',
0,
 'https://media.timeout.com/images/100007499/380/285/image.jpg',
 0
),( -- 13
 'La Marais',
'What is it? The Jewish quarter’s enlightening museums prove there’s far more to the Marais than chocolate and falafel. 

Why go? A nucleus for Jewish culture in Paris, this area boasts two important places dedicated to the religion’s history: Le Mémorial de la Shoah, which commemorates the Jews that were killed during the Second World War, and Musée d’Art et d’Histoire du Judaïsme, which contains collections tracing the complex spiritual and cultural heritage of Moses and his people.

Don’t miss? Walk around the area, and you’ll come face to face with the remains of the Philippe Auguste wall, one of Paris’ oldest surrounding walls dating all the way back to the 12th century.',
0,
 'https://media.timeout.com/images/103322482/380/285/image.jpg',
 0
),( -- 14
 'Parc de la Villette',
'What is it ? THE place to be during the summer months.

Why go ? Stretching across 35 hectares, this is the largest of Paris’ parks, and from mid-July, it hosts the annual open-air cinema festival. There’s always a good vibe, and we’ve even witnessed a crowd of over 2000 people get up and dance beneath the stars at the end of “Grease”.

Dont miss? Finish off your summer nights at beach-style nightclub Plage du Glazart, kitted out with sand and deckchairs.',
0,
 'https://media.timeout.com/images/100013511/380/285/image.jpg',
 0
),( -- 15
 'Pavillon des Canaux',
'What is it? A place you can truly make yourself at home.

Why go? Located in an old two-floor house with views of Canal de l’Ourcq canal, the Pavillon is a luminous oasis of calm. Ring the bell upon entering and a member of staff will personally welcome you into a large sitting room decorated like a doll’s house: think sinking sofas, mismatched furniture, teapots, plants and even a birdcage.

Don’t miss? After a cosy hour at the Pavillon, head to Kiez Kanal for a quick jaunt to Hambourg.',
0,
 'https://media.timeout.com/images/105171292/380/285/image.jpg',
 0
),( -- 16
 'Espace Niemeyer beehives',
'What is it? An agricultural hotspot on the roof of the French Communist Party’s HQ.

Why go? It’s impossible to miss the beauty of the French Community Party building, designed in 1971 by Brazilian architect Oscar Niemeyer, with its domed roof peppered with beehives. So, fancy a pot of activist honey?

Dont miss? Sweet treats aside, the rest of the building is worth exploring for the architecture alone.',
0,
 'https://media.timeout.com/images/105313345/380/285/image.jpg',
 0
),( -- 17
 'Disneyland Paris',
'What is it? One of Europe’s biggest theme parks from Walt Disney.

Why go? Get ready to make some tough decisions: Fantasyland for the kids, or Walt Disney Studios for the parents? Regardless of age, bumping into Mickey or Minnie never fails to put a smile on everyone’s face.

Dont miss? Experience the full package with a night at Disneyland Hotel, similar to the Disney Hotel in New York. ',
0,
 'https://media.timeout.com/images/104689206/380/285/image.jpg',
 0
),( -- 18
 'Le Panthéon',
'What is it? The iconic Panthéon and its incredible architecture.

Why go? This neoclassical megastructure commissioned by Louis XV and conceived by Soufflot was the great architectural success of its time. But many things have changed since then: in 1970, during the revolution, the building was converted into a “temple to reason” and welcomed graves of the nation’s most revered men. On the famous front entrance is inscribed the well-known phrase: “To the great men, the grateful homeland.” The austere vaulted crypt includes the tombs of Voltaire, Rousseau, Hugo, Zola and resistance fighter Jean Moulin.

Dont miss? You’re in the 5th arrondissement, so choose between a drink on rue Mouffetard or a stroll in Jardin du Luxembourg. ',
0,
 'https://media.timeout.com/images/100007581/380/285/image.jpg',
 0
),( -- 19
 'Supersonic',
'What is it? A rock-focused venue in Bastille where every gig is free.

Why go? This 250-venue capacity, reminiscent of a New York loft, hosts some of the best names in the rock scene today. Rock nights run every weekend, and the bi-monthly Sunday Tributes event is not to be missed.

Dont miss? The live rock nights and DJ sets go until 6am, so come energised.',
0,
 'https://media.timeout.com/images/105313350/380/285/image.jpg',
 0
),( -- 20
 'Louvre',
'What is it? Do you really need an introduction to the Louvre?

Why go? There are hours and hours of art to see beneath the glass IM Pei pyramid, commissioned by Mitterrand in 1983. With treasures across ancient civilisations, from the Egyptians to the Romans and the Greeks, as well as the legendary “Mona Lisa”, the Louvre contains one of the world’s very best collections of art.

Dont miss? You’d need several years to see everything displayed in the Louvre, so stick to a plan. ',
0,
 'https://media.timeout.com/images/105313359/380/285/image.jpg',
 0
),( -- 21
 'Grand Palais',
'What is it? One of the best views in the city. 

Why go? Built at the height of France’s artistic glory for the Exposition Universelle of 1900, Grand Palais has been putting on many exhibitions such as the FIAC International Contemporary Art Fair since 1990. Turn your attention away from the art for a moment, and you’ll notice several beehives on the Grand Palais roof, which have helped support urban biodiversity since 2009.

Dont miss? Make it a double with a trip to the Grand Palais’ sibling Petit Palais across the road.  ',
0,
 'https://media.timeout.com/images/105313362/380/285/image.jpg',
 0
),( -- 22
 'Le Baron Rouge',
'What is it? A neighbourhood wine bar with a menu from yesteryear. 

Why go? You’ll find true Bacchanalian glory in this tiny drinking den, with its walls covered in tapestries, and towers of beer barrels and bottles of wine reaching up to the ceiling. Here you’ll find a list of local wines of good vintage in a typically French setting, without having to make a show of your oenology credentials.

Dont miss? On Sundays, you can top off your outing with a shopping trip at Marché d’Aligre. ',
0,
 'https://media.timeout.com/images/100015027/380/285/image.jpg',
 0
),( -- 23
 'The Broken Arm',
'What is it? The place to be for fashion lovers and foodies.

Why go? Thought up by three members from the “Young Modern People” collective, this is a neat and tasteful boutique full of handpicked clothes, books, records, furniture and shoes. After satisfying your shopping itch, sit down at one of the lovely wooden tables for an excellent cup of coffee and a pastry (the cookies are better than perfect, as is the blueberry cheesecake)',
0,
 'https://media.timeout.com/images/105296245/380/285/image.jpg',
 0
),( -- 24 
 'Musée de l’Orangerie',
'What is it? An impressionist and post-impressionist art gallery in the Jardin des Tuileries. 

Why go? To marvel at the eight, tapestry-sized Nymphéas (water lilies) paintings housed in two plain oval rooms at the Musée de l’Orangerie. They provide a simple backdrop for the astonishing, ethereal romanticism of Monet’s works, painted late in his life. Expect to feel deeply calmed by them, despite the crowds.

Dont miss? Bring an Angelina hot chocolate to brave the queue with when it gets cold. ',
0,
 'https://media.timeout.com/images/103233450/380/285/image.jpg',
 0
),( -- 25
 'Musée de l’Absinthe',
'What is it? The only museum in the world dedicated to this infamous spirit.

Why go? After paying Vincent Van Gogh’s grave your respects at Auvers-sur-Oise, it’s only right you learn more about the drink that killed him – nicknamed “the green fairy” as a result of its potency.

Don’t miss? While you’re at Auvers-sur-Oise, make the most of your location by stopping by the Auvers castle as well as its “Journey among the Impressionists” exhibition. ',
0,
 'https://media.timeout.com/images/103397000/380/285/image.jpg',
 0
),( -- 26
 'Cathédrale Notre-Dame de Paris',
'What is it? France’s most famous cathedral.

Why go? Towering up from the heart of the city in l’île de la Cité, Cathédrale Notre-Dame is fascinating from every angle. Inside, take a moment to admire the five-rowed nave and its giant columns decorated with delicate leaves, as well as the organ and raised marble altar at which stands the marble Pietà sculpture of Jean Cousteau. Between the two spires, you’ll see the many gargoyles lining the Galerie des Chimères.

Dont miss? Go to the Dame de Cœur, the cathedral’s magnificent festival of light and sound. ',
0,
 'https://media.timeout.com/images/100004631/380/285/image.jpg',
 0
),( -- 27
 'South Pigalle',
'hat is it? An elegant, old-school bistro serving fuss-free fare.

Why go? With its large bar behind which the maître d’ advises punters on the best red to enjoy with confit beef cheeks, this bistro is perfect for Sunday lunch, a boozy dinner with mates or the best idea yet: a solo meal for savouring every single bite, sans interruption. 

Dont miss? You won’t find sausage and mash like this anywhere else so loosen your top button and dig in.',
0,
 'https://media.timeout.com/images/103257444/380/285/image.jpg',
 0
),( -- 28
 'Palais Garnier',
'What is it? An ode to both opera and ballet with styles old and new across two different rooms.

Why go? L’Opéra Garnier is one of the city’s pride and joys, and since its inauguration during the second half of the 19th century, its stage has hosted the arts in their finest forms, as has its brother venue, Opéra Bastille, which will celebrate its 30th birthday in 2019.

Dont miss? Try the Opéra Escape Game and finally unmask that damned ghost!',
0,
 'https://media.timeout.com/images/100007295/380/285/image.jpg',
 0
),( -- 29
 'La Cinémathèque Française',
'What is it? A venerated historical institution, over which presides the good-natured ghost of French film archivist Henri Langlois. 

Why go? For just a couple of euros, you can spend a day exploring hundreds of hidden cinematic treasures within the library, as well as network, attend talks and join cinema clubs inspired by the legendary Jean Douchet, or even visit the tongue-in-cheek exhibitions dedicated to filmmaking.

Dont miss? After indulging your inner cinephile, catch a gig at the lAccorHotels ',
0,
 'https://media.timeout.com/images/100014769/380/285/image.jpg',
 0
),( -- 30
 'Piscine Molitor',
'hat is it? Put simply: the most beautiful swimming pool in Paris. 

Why go? This legendary establishment and listed historical building was bought by the AccorHotels group several years ago. The result? A luxury complex with a five-star hotel, a very good restaurant, a 48-metre spa and all round architectural beauty.

Dont miss? Order cocktails from the bar without leaving the pool.',
0,
 'https://media.timeout.com/images/105290298/380/285/image.jpg',
 0
),( -- 31
 'Marché aux Puces de St-Ouen',
'What is it? Billed as the world’s largest flea market, you can get truly lost in its labyrinthine stalls.

Why go? The scale of commerce at this flea market is remarkable. Around 1000 traders sell artisan products, new and second-hand clothes, and 2,500 traders sell antique goods. There’s a knickknack to suit every taste. Just don’t forget to negotiate your price.

Don’t miss? Your purchases done, head to La Recyclerie for a drink',
0,
 'https://media.timeout.com/images/103631677/380/285/image.jpg',
 0
),( -- 32
 'Jardin des Plantes',
'What is it? A green haven in the centre of Paris.

Why go? Here, you can choose between a small zoo with over 1200 animals, giant recently renovated greenhouses, as well as museums of mineralogy, geology, palaeontology, anatomy and botany.

Dont miss? Take the perfect profile picture under those Japanese cherry trees.',
0,
 'https://media.timeout.com/images/100004431/380/285/image.jpg',
 0
),( -- 33
 'Canal Saint-Martin',
'What is it? A Mediterranean canteen with Israelian influences.

Why go? Come here from 10am for a breakfast of excellent coffee and colourful brunch dishes that taste as good as on the port of Jaffa. The Shakshuka is also worth mentioning: a delicious dish of baked eggs, tomato, peppers, onions and feta cheese.

Dont miss? Continuing the Israeli theme, finish your meal with a pita sandwich from Miznon.',
0,
 'https://media.timeout.com/images/105215867/380/285/image.jpg',
 0
),( -- 34
 'Bouillon-Chartier',
'What is it? Founded in 1896, Bouillon Chartier (housed in a former railway station) expresses all the charm of Belle Epoque Paris. If you can last through the queue, it’s the perfect mood-booster: uniformed waiters scurry around, your neighbour will probably try to engage you in conversation, and American couples loudly discuss the merits of their saucission ardéchois.

Why go? A vast menu covers everything you could ever want from a Parisian brasserie: snails, oeuf mayonnaise, andouillette with mustard, several types of steak frites and bargain wine. The wallet-friendly prices and jolly art deco brouhaha has well and truly won our hearts.

Dont miss? Dont let the waiters hurry you, make it as languorous as by ordering everything you can stomach',
0,
 'https://media.timeout.com/images/101634265/380/285/image.jpg',
 0
)
GO


SELECT * from poi



INSERT INTO poi_category
(
    poiID, categoryName
)
VALUES(1, 'Bar'),(1, 'Restaurant'),
(2, 'Museum'),(3, 'Bar'),(3, 'Restaurant'),
(4, 'Cinema'),(4,'Shows'),(5, 'Sports'),
(6, 'Shopping'),(7, 'Tour'),
(7, 'Park'),(8, 'Sports'),(9, 'Park'),
(10, 'Bar'),(11,'Museum'),(12, 'Cinema'),
(13,'Museum'),(14,'Park'),(15, 'Restaurant'),
(15,'Bar'),(16,'Tour'),(16, 'Park'),
(17,'Park'),(17,'EXTREME'),(17,'Shopping'),(17,'Shows'),
(18,'Tour'),(18,'Museum'),(19,'Bar'),(19,'Shows'),
(20,'Tour'),(20,'Museum'),(20,'Park'),
(23,'Restaurant'),(24,'Museum'),(24,'Tour'),
(25,'Bar'),(25,'Museum'),(26,'Park'),(27,'Restaurant'),
(28,'Shows'),(29,'Cinema'),(30,'Sports'),(31,'Shopping'),
(32,'Park'),(32,'Tour'),(33,'Restaurant'),(34,'Restaurant')
GO



SELECT * FROM poi_category


Create TABLE favorites(
    username varchar(30),
    poiID int NOT NULL,
    position int NOT NULL,
    date datetime NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ( poiID ) REFERENCES poi ( poiID ) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (username, poiID)
);


INSERT INTO favorites
(
 username, poiID, position, date
)
VALUES
(
 'p', 1, 0, GETDATE()
),
(
 'p', 2, 1, GETDATE()
),
(
    'p', 3, 2, GETDATE()
),
(
    'a', 1, 0, GETDATE()
)
GO
SELECT * FROM favorites

Create TABLE questions(
    questionBody varchar(100) NOT NULL,
    PRIMARY KEY (questionBody),
);

GO

INSERT INTO questions
(
 questionBody
)
VALUES
(
 'Where were you born?'
),
(
 'What is the Name of your first pet?'
),
(
    'Who is your favorite super-hero?'
),
(
    'What was the Name of your first teacher?'
),
(
    'Who was your first crush?'
)
GO
SELECT * FROM questions

Create TABLE user_qa (
    username varchar(30) PRIMARY KEY,
    question1 varchar(100) NOT NULL,
    answer1 varchar(40) NOT NULL,
    question2 varchar(100) NOT NULL,
    answer2 varchar(40) NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username),
    FOREIGN KEY (question1) REFERENCES questions(questionBody),
    FOREIGN KEY (question2) REFERENCES questions(questionBody)
);
GO

-- Insert rows into table 'user_qa' in schema '[dbo]'
INSERT INTO user_qa
VALUES
(
 'a','What is the Name of your first pet?','a','What is the Name of your first pet?','a'
),
(
    'b','What is the Name of your first pet?','b','What is the Name of your first pet?','b'
),
(
    'p','What is the Name of your first pet?','cat','What is the Name of your first pet?','here'
)
GO

SELECT * FROM user_qa

Create TABLE user_categories(
    username varchar(30),
    categoryName varchar(100),
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ( categoryName ) REFERENCES categories ( categoryName ) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (username, categoryName)
);

INSERT INTO user_categories
(
 username, categoryName
)
VALUES
('a', 'Bar'),
('a','Park'),
('b', 'Sports'),
('b', 'Bar'),
('p', 'Street Food'),
('p', 'Park'),
('p', 'Museum')
SELECT * FROM user_categories
GO


Create TABLE reviews(
    poiID int NOT NULL,
    username varchar(30),
    description nvarchar(max),
    ranking int NOT NULL,
    date datetime NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (poiID) REFERENCES poi(poiID) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(poiID, username, date)
);
GO

CREATE TRIGGER computeAvgRank
ON reviews
AFTER INSERT
AS
    UPDATE poi
    SET ranking = (SELECT avg(Cast(ranking as [float])) FROM reviews
                         WHERE poi.poiID = reviews.poiID)
    WHERE poi.poiID IN (SELECT poiID FROM inserted);
GO

SELECT * FROM reviews`)
        .then((response, err) => {
            if (err)
                res.status(400).json({location: "All/then", message: err.message});
            else {
                res.status(201).json({message: "All Added!"});
            }
        })
        .catch(function (err) {
            if (err.message.startsWith("Violation of PRIMARY KEY constrain")) {
                res.status(400).json({location: "All/catch/if", message: "Something went wrong"});
            } else {
                res.status(400).json({location: "All/catch/else", message: err.message});
            }
        });
});


router.post('/WriteReviews', (req, res) => {
    DButilsAzure.execQuery(`SELECT poiID FROM poi`)
        .then((response, err) => {
            if (err)
                res.status(400).json({location: "counties/then", message: err.message});
            else {
                const comments = [[1, 'didnt like it'], [1, 'it was bad'], [2, 'could have been better'], [2, 'nah'], [3, 'i dont know..'], [3, 'i have had better'], [4, 'was very nice'], [4, 'i liked it'], [5, 'Was Awesome!'], [5, 'LOVED IT!']]
                const users= ['a','b','p'];
                for (let i = 0; i < response.length; i++) {
                    let randComment = Math.floor(Math.random() * Math.floor(comments.length));
                    let randUser = Math.floor(Math.random() * Math.floor(users.length));

                    DButilsAzure.execQuery(`INSERT INTO reviews(poiID, username, description, ranking, date)VALUES(${response[i]['poiID']},'${users[randUser]}','${comments[randComment][1]}', ${comments[randComment][0]}, GETDATE())`)
                        .then((response, err) => {
                            if (err)
                                res.status(400).json({location: "Review/then", message: err.message});
                            else {
                                res.status(201).json({message: "Review was added!"});
                            }
                        })
                        .catch(function (err) {
                            if (err.message.startsWith("Violation of PRIMARY KEY constrain")) {
                                res.status(400).json({location: "Review/catch/if", message: "Review Name exists"});
                            } else {
                                res.status(400).json({location: "Review/catch/else", message: err.message});
                            }
                        });
                }
                res.status(201).json({message: "Review was created!"});
            }
        })
        .catch(function (err) {
            if (err.message.startsWith("Violation of PRIMARY KEY constrain")) {
                res.status(400).json({location: "Review/catch/if", message: "Review Name exists"});
            } else {
                res.status(400).json({location: "Review/catch/else", message: err.message});
            }
        });
});

// {
// 	"countries":[
// 		[1,"Australia"],
// 		[2,"Bolivia"],
// 		[3,"China"],
// 		[4,"Denemark"],
// 		[5,"Israel"],
// 		[6,"Latvia"],
// 		[7,"Monaco"],
// 		[8,"August"],
// 		[9,"Norway"],
// 		[10,"Panama"],
// 		[11,"Switzerland"],
// 		[12,"USA"]]
// }


module.exports = router;