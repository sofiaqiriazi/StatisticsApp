# StatisticsApp - A Web Page to display statistics of the LHCb Nightly Builds.

The web application is focusing on the today's statistics of the LHCb Nightly Builds.
There is also a timeline for comparison of the today's progress with the last six days.
The Pie chart splits in three main categories:

1.Unstarted Slots - slots that don't yet have a job start inside the database.
2.Unfinished Slots - slots that don't yet have a job end inside the database.
3.Completed Slots - slots that have a job start and job end inside the database.

The bottom part of the web page is actually a carousel.
The upper half part focuses on the first slot inside the slideshow.
The slideshow that sits at the bottom of the page contains all the slots and the label indicates which category it represents.
The user can then hover on the slides of the piechart and the slideshow will show only the selected category slots.
The active slot inside the slideshow will be the one that the user can focus on.
Each click on the page triggers a reload so the latest information that was added in the database will be displayed.

## Run application locally

1.Install Flask [http://flask.pocoo.org/docs/0.10/installation/](http://flask.pocoo.org/docs/0.10/installation/)
2.Follow the instuctions to get couchdbkit [http://couchdbkit.org/download.html](http://couchdbkit.org/download.html)
3.Clone this repository.
```sh
$ git clone https://github.com/sofiaqiriazi/StatisticsApp.git
```
4.Move to directory.
```sh
$ cd StatisticsApp
```
5.Run the application.
```sh
python statistics.py
````

