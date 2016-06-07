# Beepi - Car Search and Price Range Selector

View live version at http://ayushmehra.com/beepi/ and the likes version (not yet optimized, slow initial page load) at http://ayushmehra.com/beepi/likes/

Renders list of cars from json (js/cars.json in this example) and creates a search bar and price range selector with graph of price buckets as shown below.

![alt text](http://i.imgur.com/fIkNa5N.png "Sample Screenshot")

To run locally, clone or download the repo, and run it on an http server (otherwise car images won't load). For users with python installed you can start a simple local http server by navigating to the repo in terminal and then using the command:
> python -m SimpleHTTPServer 8000

The site will then be available at http://localhost:8000

### Search
Supports multiple search terms separated by spaces and searches for all matching cars in the list against name, year, and body type.
> Nissan 2014 SUV

### Price Range
Draggable price range selector with the active range highlighted in blue on the price-bucket graph (animates). The number of buckets in the graph can be changed at the top of js/beepi.js.

### Likes
Liked cars are stored in local storage and therefore persist for revisits on the same machine. Likes is currently functional but needs optimization as the initial page load time with likes is very high. Until it is fully optimized (I am currently working on it), it will only be on its own branch "likes".

![alt text](http://i.imgur.com/rgdeYKR.png "Sample Screenshot")

### Mobile / Responsive
![alt text](http://i.imgur.com/qpKVNU2.png "Sample Screenshot")

### TODOs

* Improve search and provide search suggestions/autofill
* Improve design, not very efficient on space right now
* Improve performance (especially on likes version)
* Add social sharing buttons
* Further mobile/responsiveness optimization

