from datetime import datetime


from couchdbkit import Document, StringProperty, DateTimeProperty, IntegerProperty, ListProperty

# Create your models here.

class Projects(Document):
	name = StringProperty()
	version = StringProperty()
#	build_id = IntegerProperty()
#	type = StringProperty()
#	platform = StringProperty()
#	stime = DateTimeProperty(default = datetime.utcnow)
#	etime = DateTimeProperty(default = datetime.utcnow)


class Slot_Conf(Document):
	name = StringProperty()
	build_id = IntegerProperty()
	projects = ListProperty(default = [])
	platforms = ListProperty(default = [])

class TimeInfo(Document):
	type = StringProperty(default="TimeInfo")
	max = IntegerProperty()

class Job(Document):
	platforms = ListProperty()
	slot = StringProperty()
	value = StringProperty()
	doc_type = StringProperty(default="Job")

class Results(Document):
	project = StringProperty()
	platform = StringProperty()
	started = StringProperty()
	completed = StringProperty()
	set = StringProperty()

class ProjNames(Document):
	names = ListProperty()

class slotStartEnd(Document):
	platform = StringProperty()
	time = IntegerProperty()

class SlotTimes(Document):
	platform = StringProperty()
	time = StringProperty()

class ProjectTimes(Document):
	started = StringProperty()
	completed = StringProperty()
	project = StringProperty()

