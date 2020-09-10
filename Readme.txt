Within Lattice-Vibrations there are four directories, each holding a different version of the lattice vibrations suite.
These are: 1.) The "HTML-Version", 2.) "Python-Version", 3.) "Vue-Version", and 4.) "Vue-test-scrollable". 

Contained in each folder is differen content, they have:
1.) The HTML version:
This contains suites in the same style as done in the summer of 2019. Inside this, there are two main outputs. These are
"d3Suite.html", and "plotlySuite.html", which have the purpose of displaying the same suite content, but using different 
graphics packages (just for purpose of demonstration of the packages). To see these, just run file from the file explorer
and everything should work. The "Test cases" folder is just junk that Darren (the author) will eventually throw, but he's
not quite finished cleaning up yet so that's there for now.

2.) The Python version:
This contains the computational algorithms required to produce the plots seen the "HTML version", but written in python.
It doesn't contain anything else, and the file only exists as legacy from the days of when development of Lattice-Vibrations
started.

3.) The Vue-Version
This has individual pages of the suite in .vue format. These are navigated through main.js. To see this content, must run
"npm run serve" at the folder level of "Vue-Version" in a terminal. To change what page doing this displays, comment out
all but the page you want to see in the "main.js" file contained within Vue-Version. Note, components used in this
visualisation are all contained within a "components" folder, and are accessed from there.

4.) Vue-test-scrollable
This is identical to the "Vue-Version" folder, but is still a work in progress. This is meant to show all of the pages as
they appear in the HTML version (similar style to the scrollable summer 2019 stuff), but in the new 2020 template, using
components. This will be attached to an index.html file using vue.config. Rob will do this using some black magic.


Don't worry about the .DS-Store file.