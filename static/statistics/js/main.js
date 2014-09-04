//From float seconds format ---> "HH:MM:SS"
function TranslateToTime(data) {

	var sec_num = parseInt(data, 10);
	var hours   = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	var seconds = sec_num - (hours * 3600) - (minutes * 60);

	if (hours   < 10) {hours   = "0"+hours;}
	if (minutes < 10) {minutes = "0"+minutes;}
	if (seconds < 10) {seconds = "0"+seconds;}
	var time    = hours+':'+minutes+':'+seconds;

	return time;
}
//
function loadSlideshow(){

	var $frame = $('#frame');
	var $wrap = $frame.parent();
	$frame.sly('destroy');
	$frame.sly({
		horizontal: 1,
		itemNav: 'forceCentered',
		smart: 1,
		activateOn: 'click',
		mouseDragging: 1,
		touchDragging: 1,
		releaseSwing: 1,
		startAt: 0,
		scrollBar: $wrap.find('.scrollbar'),
		scrollBy: 1,
		speed: 300,
		elasticBounds: 1,
		easing: 'easeOutExpo',
		dragHandle: 1,
		dynamicHandle: 1,
		clickBar: 1,
		// // Buttons
		prev: $(document).find('.prev'),
		next: $(document).find('.next'),
	},
	{
		active: function(e, i){
			$('.slotfocus').empty();
			var sha = ($('.wrap').find('.active').children().children()[0].id);
			console.log(e+" and "+ sha);
			clicktheslot(sha);
		}
	}
);

	$wrap.show();
	$frame.sly('reload');
	return;	
}


//initialize the sub-slideshow for the focus of a specific slot
function createSubSlideshow(slot){
	
	$('#'+slot+'-subframe').sly('destroy');
	$('#'+slot+'-subframe').sly({

		horizontal: 1,
		itemNav: 'forceCentered',
		smart: 1,
		activateOn: 'click',
		mouseDragging: 1,
		touchDragging: 1,
		releaseSwing: 1,
		startAt: 0,
		scrollBar: $('.subwrap').find('.subscrollbar'),
		scrollBy: 1,
		speed: 300,
		elasticBounds: 1,
		easing: 'easeOutExpo',
		dragHandle: 1,
		dynamicHandle: 1,
		clickBar: 1,
	});

	$('#'+slot+'-subframe').sly('reload');
}

//create Timeline chart with all the projects' progresses
function LoadProgressOfProjects(id){

	//get the slot from the id
	var slot = id.split('?')[0];
	//get the platform from the id 
	var platform = id.split('?')[1];	

	$('.slotfocus').append('<div id='+id+'linechart'+' class="columnchart"></div>');

	//get times of projects for specific slot and platform
	$.get('projectTimes/'+slot+'/'+platform,function(data){

		var data = jQuery.parseJSON(data);
		
		var build_times = data.build;
		var tests_times = data.tests;
		var projects = data.projects;

		var builds = [];
		for (var p in projects){

			var startdate = (build_times[projects[p]].start_build).split('T')[0];	
			var enddate = (build_times[projects[p]].complet_build).split('T')[0];
			var starttime = (build_times[projects[p]].start_build).split('T')[1];	
			var endtime = (build_times[projects[p]].complet_build).split('T')[1];

			var temp = [projects[p],'build',new Date(startdate.split('-')[0],startdate.split('-')[1],startdate.split('-')[2],
								 starttime.split(':')[0],starttime.split(':')[1],starttime.split(':')[2]),
							new Date(enddate.split('-')[0],enddate.split('-')[1],enddate.split('-')[2],
								 endtime.split(':')[0],endtime.split(':')[1],endtime.split(':')[2])];

			builds.push(temp);

			var startdate = (tests_times[projects[p]].start_build).split('T')[0];	
			var enddate = (tests_times[projects[p]].complet_build).split('T')[0];
			var starttime = (tests_times[projects[p]].start_build).split('T')[1];	
			var endtime = (tests_times[projects[p]].complet_build).split('T')[1];

			var temp = [projects[p],'tests',new Date(startdate.split('-')[0],startdate.split('-')[1],startdate.split('-')[2],
								 starttime.split(':')[0],starttime.split(':')[1],starttime.split(':')[2]),
							new Date(enddate.split('-')[0],enddate.split('-')[1],enddate.split('-')[2],
								 endtime.split(':')[0],endtime.split(':')[1],endtime.split(':')[2])];

			builds.push(temp);

		}
		

		google.load("visualization", "1", {packages:["corechart"],callback: drawTimeline});

		function drawTimeline(){

			var container = document.getElementById(slot+'?'+platform+'?'+'timeinfoslinechart');
			var chart = new google.visualization.Timeline(container);

			var dataTable = new google.visualization.DataTable();

			dataTable.addColumn({ type: 'string', id: 'Project' });
			dataTable.addColumn({ type: 'string', id: 'Results' });
			dataTable.addColumn({ type: 'date', id: 'Start' });
			dataTable.addColumn({ type: 'date', id: 'End' });
			dataTable.addRows(builds);

			var options={
				width:400,	
			};

			chart.draw(dataTable,options);
		}

	});

}
//create Slideshow inside Focus window for slot
function appendTimeInfoTable(slot){

	$('.subwrap').remove();
	$('.slotfocus').append('<div class="subwrap">'+
					'<div class="subscrollbar">'+
						'<div class="subhandle">'+
							'<div class="submousearea"></div>'+
						'</div>'+
					'</div>'+
					'<div id='+ slot + "-subframe" +' class="subframe">'+
						'<ul class="comparison"></ul>'+
					'</div>'+
				'</div>');


	$.get('slotTimeInfo/'+slot,function(data){

		var data = jQuery.parseJSON(data);

		var now = new Date();
		var secsnow = now.getHours()*3600 + now.getMinutes()*60+now.getSeconds();

		//for each platform create a table	
		for (var platform in data[slot]){
			
			var starttime = data[slot][platform]['start'];
			var endtime = data[slot][platform]['end'];
			var avgtime = data[slot][platform]['avgcompletion'];

			var secsstarted = (parseInt(starttime.split(':')[0])*3600+
					   parseInt(starttime.split(':')[1])*60+
					   parseInt(starttime.split(':')[2]));

			var secsrunning = secsnow-secsstarted;

			var table = $('<table id='+slot +"?"+ platform+"?timeinfos"+' ></table>');

			var row;

			row = $('<tr></tr>').addClass('bar').text(platform);
			table.append(row);

			row = $('<tr></tr>').addClass('bar').text('Start Time: '+ starttime.split('.')[0]); 
			row.append('<td><img src="static/statistics/img/Clock.png"  style="width:40%;" /></td>');
			table.append(row); 
	
			row = $('<tr></tr>').addClass('bar').text(' Actual End Time: '+ endtime.split('.')[0]); 
			row.append('<td><img src="static/statistics/img/Clock.png"  style="width:40%;" /></td>');
			table.append(row);

			var expected = parseInt(avgtime) + parseInt(secsstarted);
			row = $('<tr></tr>').addClass('bar').text('Average Time: '+ TranslateToTime(expected));

			row.append('<td><img src="static/statistics/img/Clock.png"  style="width:40%;" /></td>');
			table.append(row);

			row = $('<tr><td><div id ='+ slot + platform + "progressbar" +
				'></div></td></tr>');		
			table.append(row);

			var listel = $('<li></li>');
			listel.append(table);
			$(".comparison").append(listel);
			
			InitializeSubProgressbar();
		}

		function InitializeSubProgressbar(){
			var progress = secsrunning*100/avgtime;
		
			if (endtime){
				progress = 100;
			}
		
			if(progress > 100 ){
				($("#"+slot+platform+"progressbar").find(".ui-progressbar-value")).css({
						"background": '#FF0000'
				});
			}

			($("#"+slot+platform+"progressbar")).progressbar({
				value:progress,
			});

			($("#"+slot+platform+"progressbar").find(".ui-progressbar-value")).css({
				"background": '#0000FF'
			});

		}

	}).done(function(){
		createSubSlideshow(slot);

		$('.comparison li').click(function(){
			$('.columnchart').remove();
			LoadProgressOfProjects(($(this).children()[0]).id);
		});

	});
}

function makeSlotPieChart(slot){

	var domain = $('#frame ul');
	domain.append('<li><div class="packet"><div id='+ slot +'></div><div id=' + slot + "-frame" +'></div></div></li>');

	$.get('slotsResults/'+slot,function(data){

		data = jQuery.parseJSON(data);
		
		var finished = data[0].finished;
		var unfinished = data[0].unfinished;
		var unstarted = data[0].unstarted;

		var stats = new google.visualization.DataTable();
		stats.addColumn('string', 'Topping');
		stats.addColumn('number', 'Slices');
		stats.addRows([
				['Finished', finished.length],
				['Unfinished', unfinished.length],
				['Unstarted', unstarted.length],
				]);

		var options = {};

		options['backgroundColor'] = '#CCCCCC';
		options['title'] = data[0].slot;
		options['height'] = 300;
		options['pieSliceText']='value';
		options['enableInteractivity'] = false;

		var chartdiv = $('#'+slot)
		var chart = new google.visualization.PieChart(document.getElementById(slot));
		chart.draw(stats, options);

	});

}


function clicktheslot(slot){
	$.get('slotsResults/'+slot,function(data){
			//if there is not a slot on which there is focus
		data = jQuery.parseJSON(data);
		
			$('.slotfocus').empty();
			if ($('.slotfocus').is(':empty')){
				//do something
				$('#frontline').animate({
					marginTop: "0px",	
				}, {duration:1500,queue:false});
				$('#carousel').animate({
					margin:"auto",
				}, {duration:1500,queue:false});	
				$('.slotfocus').animate({
					width: "80%",
					height:"200px",
					border:"inset",
					borderWidth:"0.5em",
					borderColor:"#CCCCCC",
				}, {duration:1500,queue:false}).promise().done(function(){
					$('.subframe').sly('reload');
				});
				
			}
					
			$newslotchart =  '<div id='+slot+"-focuschart"+' class="focuschart"></div>';
			$('.slotfocus').append($newslotchart);



			var finished = data[0].finished;
			var unfinished = data[0].unfinished;
			var unstarted = data[0].unstarted;
	
			var stats = new google.visualization.DataTable();
			stats.addColumn('string', 'Topping');
			stats.addColumn('number', 'Slices');
			stats.addRows([
				['Finished', finished.length],
				['Unfinished', unfinished.length],
				['Unstarted', unstarted.length],
				]);

			var chart = new google.visualization.PieChart(document.getElementById(slot+"-focuschart"));
			var options = {};
			options['title'] = data[0].slot;
			options['enableInteractivity'] = true;
			options['width'] = 150;
			options['height'] = 200;
			options['slices'] = { 	0: {offset: 0.2},
						1: {offset: 0.1},
						2: {offset: 0.2},
						};
			options['tooltip'] = { trigger: 'selection' };
			options['pieSliceText']='value';
	
			chart.setAction({
				id: 'sample',
				text: 'LOAD PROJECTS',
				action: function() {

				selection = chart.getSelection();
					switch (selection[0].row) {
					case 0:
						loadTimelinebyProjects(data[0].slot,data[0].finished);	
						break;
					case 1:
						loadTimelinebyProjects(data[0].slot,data[0].unfinished);
						break;
					case 2:
						console.log(data[0].unstarted);
						loadTimelinebyProjects(data[0].slot,data[0].unstarted);
						break;
					}

				}
			});

			chart.draw(stats, options);
			appendTimeInfoTable(slot);
			loadTimelinebyProjects(slot,data[0].projects);	
			$('.slotfocus').show();
	});
}


function loadTimelinebyProjects(slot,projects){

	$('.columnchart').remove();
	$('.slotfocus').append('<div id='+slot + '-timelinechart'+' class="columnchart"></div>');

	$.get('slotResults/'+slot,function(data){

		data = jQuery.parseJSON(data);
		console.log("UNSTARTED");
		var results = [];
		for (var d in projects){
			var x = projects[d];
			for (var p in data[x]){
				for (var set in data[x][p]){
					startdate = data[x][p][set]["started"].split('T')[0];
					enddate = data[x][p][set]["completed"].split('T')[0];
					starttime = data[x][p][set]["started"].split('T')[1];
					endtime = data[x][p][set]["completed"].split('T')[1];	

					var temp = [x,set,new Date(startdate.split('-')[0],startdate.split('-')[1],startdate.split('-')[2],
								   starttime.split(':')[0],starttime.split(':')[1],starttime.split(':')[2]),
							  new Date(enddate.split('-')[0],enddate.split('-')[1],enddate.split('-')[2],
								   endtime.split(':')[0],endtime.split(':')[1],endtime.split(':')[2])];

					results.push(temp);

					console.log(temp);
				}
			}
		}
			
		google.load("visualization", "1", {packages:["corechart"],callback: drawProjectsChart});

		function drawProjectsChart(){
			var container = document.getElementById(slot+'-timelinechart');
			var chart = new google.visualization.Timeline(container);
			var dataTable = new google.visualization.DataTable();

			dataTable.addColumn({ type: 'string', id: 'Project' });
			dataTable.addColumn({ type: 'string', id: 'type' });
			dataTable.addColumn({ type: 'date', id: 'Start' });
			dataTable.addColumn({ type: 'date', id: 'End' });
			dataTable.addRows(results);

			var options={
				width:400,	
			};
			chart.draw(dataTable,options);
		}
	});
}

function loadPieCharts(slots){
	for (var i in slots){
		google.load("visualization", "1.0", {packages:["corechart"]});
		makeSlotPieChart(slots[i]);
	}

}

function makeWeekLineChart(){

	$.get('makechart/',{},function(data){
		var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		data = jQuery.parseJSON(data);

		var dataarray = []
		for (var d in data){

			var year = parseInt(d.split("-")[0]);
			var month = parseInt(d.split("-")[1]);
			var day = parseInt(d.split("-")[2]);
			var minhours   = Math.floor(data[d].minseconds / 3600);
			var minminutes = Math.floor((data[d].minseconds - (minhours * 3600)) / 60);
			var minseconds = data[d].minseconds - (minhours * 3600) - (minminutes * 60);
			var maxhours   = Math.floor(data[d].maxseconds / 3600);
			var maxminutes = Math.floor((data[d].maxseconds - (maxhours * 3600)) / 60);
			var maxseconds = data[d].maxseconds - (maxhours * 3600) - (maxminutes * 60);

			weekday = new Date(year,month-1,day);

			var temp = [ days[weekday.getDay()], "Completed..." , new Date(0,0,0,minhours,minminutes,minseconds),
			new Date(0,0,0,maxhours,maxminutes,maxseconds)];
			dataarray.push(temp);
		}

			
		dataarray[6] = [ days[weekday.getDay()], "Running..." , new Date(0,0,0,minhours,minminutes,minseconds),
								     new Date(0,0,0,maxhours,maxminutes,maxseconds)];
	
		var chart = new google.visualization.Timeline(document.getElementById('weekchart'));
		var data = new google.visualization.DataTable();

		data.addColumn({type:'string',id:'Day'});
		data.addColumn({type:'string',id:'time spent'})
		data.addColumn({type:'date',id: 'starttime'});
		data.addColumn({type:'date',id: 'endtime'});
		data.addRows(dataarray);

		var options = {
			title: 'Week Statistics',
			pointSize: 5,
			width: 800,
			height: 400,
		};

		chart.draw(data, options);
	});
}

function loadTodayStatistics(){

	$.get('todayStats/',{},function(data){
		var data = jQuery.parseJSON(data);	
		var stats = new google.visualization.DataTable();
		
		stats.addColumn('string', 'Topping');
		stats.addColumn('number', 'Slices');
		stats.addRows([['Finished', data[0].finished],
				['Unfinished', data[0].unfinished],
				['Unstarted', data[0].unstarted],
				]);

		var options = {backgroundColor: '#EEEEEE'};
		options['title'] = "Today's total is "+data[0].total +" slots";
		options['titleTextStyle'] = {   color:'#4D4D4D',
						fontSize: 18,
						bold: 1};
		options['pieSliceTextStyle'] = {   color:'#F5F5F5',
						fontSize: 16,
						bold: 1};
		options['pieSliceText']='value';
		options['legend'] = {position:'labeled'};
		options['width'] = 500;
		options['height'] = 300;
		options['slices'] = {   0: {offset: 0.1},
					1: {offset: 0.1},
					2: {offset: 0.1},
				    };


		var now = new Date();
		var currenttime = ((now.toTimeString()).split(" "))[0];
		var startingtime = TranslateToTime(data[0].todaymin);
		var timetocomplet = TranslateToTime(data[0].avgcompletion);

		InitializeProgressbar();			
		
		loadPieCharts(data[0].all);
		loadSlideshow();

		//create piechart
		var chart = new google.visualization.PieChart(document.getElementById('piechart'));

		chart.draw(stats, options);
		google.visualization.events.addListener(chart, 'onmouseover', PieMouseOver);
		google.visualization.events.addListener(chart, 'onmouseout', PieMouseOut);

	function PieMouseOver(e) {
    		chart.setSelection([e]);
			$('.slotfocus').slideUp('slow');
			$('.slotfocus').empty();
			$('.slotfocus').hide();
			$('#frame ul').empty();

		if(e.row==0){
		       	loadPieCharts(data[0].listofcompleted);
                	loadSlideshow();
			$('#label').text("Finished");
			$('#label').css("background-color","#3366cc");
	
		}
    		else if(e.row==1){
			loadPieCharts(data[0].listofunfinished);
                	loadSlideshow();
			$('#label').text("Unfinished");
			$('#label').css("background-color","#dc3912");
	
		}
   		else if(e.row==2){
                	loadPieCharts(data[0].listofunstarted);
                	loadSlideshow();
			$('#label').text("Unstarted");
			$('#label').css("background-color","#ff9900");
	
		}
  	}

	function PieMouseOut(e) {
    		chart.setSelection([{'row': null, 'column': null}]);
  	}


	function InitializeProgressbar(){
		var secsnow = now.getHours()*3600 + now.getMinutes()*60+now.getSeconds();
		var secsrunning = secsnow-data[0].todaymin;
		var secstofinish = data[0].avgcompletion;

		var progress = secsrunning*100/secstofinish;

		if(data[0].finished == data[0].total){
			progress = 100;
		}

		if(progress > 100 ){
			($("#progressbar").find(".ui-progressbar-value")).css({
				"background": '#FF0000'
			});
		}

		$( "#progressbar" ).progressbar({
			value: progress,
		});

		($("#progressbar").find(".ui-progressbar-value")).css({
			"background": '#85E085'
		});
		
		$("#textinbar").text(currenttime);
		$("#progressstart").append(startingtime);
		
		$("#progressend").append(timetocomplet);
		
	}

				
		$(".round-button").hover(
			function(){
				$(this).text(data[0].total+' Slots');
			},
		   	function() {
        			$(this).text('View All');
    		});


     });


}

$(document).ready(function(){

	//hide the slideshow div
	$('.wrap').hide();

	$('.slotfocus').hide();
	//make todays Pie Chart and slideshow of slots
	google.load("visualization", "1.0", {packages:["corechart"], callback: loadTodayStatistics});

	//make all week's Line Chart
	google.load("visualization", "1.0", {packages:["corechart"], callback: makeWeekLineChart});

	//view all button function on click
	$(".round-button").click(function(){
		$.get('todayStats/',{},function(data){
			$('.slidee').empty();
			data = jQuery.parseJSON(data);		
			loadPieCharts(data[0].all);
			$('.slotfocus').hide();
			$('.slotfocus').empty();
			loadSlideshow();
                        $('#label').text("All the slots");
                        $('#label').css("background-color","#4D4D4D");
		});

	});

});


$(document).keydown(function(e) {

	switch(e.which) {
	case 37: // left
		$('.prev').click();
		break;

	case 39: // right
		$('.next').click();
		break;

	default: return; // exit this handler for other keys
	}

	e.preventDefault(); // prevent the default action (scroll / move caret)
});

$(window).resize(function(e) {	
	$('#frame').sly('reload');
	$('.subframe').sly('reload');
});
