Rotten Flix
===========

Page automation for getting Netflix movie ratings from Rotten Tomatoes

Disclaimer
===========

Rotten Flix is still in beta, is prone to the occasional crash, is very slow, and begs for improvements, however, it still works so feel free to modify and implement enhancements where you see fit.

What It Does
===========

Rotten Flix logs into your Netflix account, navigates to the genre id you feed it (read how below), grabs every movie title associated with that genre, and then heads over to Rotten Tomatoes and does a search for each movie, returning the ratings into a .txt file. Great for quickly filtering through those awful movies that Netflix offers and finding the good ones.  


How To Use
===========

This program assumes you have already installed PhantomJS and have placed this file in the same directory as the PhantomJS framework.

You must have a Netflix account in order to use this program.

You must hard code in your Netflix username and password.

You must hard code in the genre id in step 4 of Rotten Flix.  The genre id is the unique identifier Netflix uses for a genre. This can be found in the url when you click on a category in Netflix, ex. http://www.netflix.com/WiAltGenre?agid=8883.
