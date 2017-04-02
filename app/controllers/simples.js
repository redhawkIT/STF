//faq, about, contact and other likewise simple, static pages
//this document also holds the data that is displayed on the pages

var express = require('express');
var	router = express.Router();
var fs = require('fs');
var shib = require('passport-uwshib');


module.exports = function(app) {
	app.use('/', router);
};


router.get('/loginuser*', shib.ensureAuth('/login'), function(req, res) {
	console.log(req.originalUrl)
	url = req.originalUrl.substring(10)
	console.log('url is ' + url)
	if (url)
		res.redirect(url)
	else
		res.redirect('/')
})

router.get('/user', shib.ensureAuth('/login'), function(req, res) {
	console.log(req)
	res.redirect('/proposals/myproposals')
})

//displays the homepage
router.get('/', function(req, res, next) {
	res.render('index', {
		title : 'Student Technology Fee'
	});
});


//shows the calendar
router.get('/calendar', function serveCalendar(req, res) {
	console.log(req.originalUrl)
	res.render('simples/calendar',
		{title : 'Calendar'}
	);
});


//displays the hellowworld page
router.get('/helloworld', shib.ensureAuth('/login'), shib.ensureAuth('/login'), function serveHelloWorld(req, res) {
	res.render('simples/helloworld',
		{message : req.session.message}
	);
});


//displays the about page
router.get('/about', function serveAbout(req, res) {
	res.render('simples/about', {
		title : 'About',
		examples : ['Over 200 iMacs for Odegaard',
				'Equipment for the Undergraduate Theater Society',
				'U-Drive Storage',
				'Ionization Source for Department of Chemistry',
				'Clickers for the ASUW Senate',
				'Space Scout appropriated',
				'Dozens of computer labs accross campus',
				'Microsoft Software for all students',
				'Hardware and Software for The Daily',
				'Next Generation Sequencing Pipeline for the Biology Department',
				'Equipment for Earth and Space Sciences',
				'Graphics Processing Units for Applied Mathematics'],
		members: [
			{
				name: 'Navid Azodi',
				title: 'ASUW Representative',
				desc: 'Navid is a junior studying Business Administration and this is his second year on the STF Committee. Navid has had widespread campus involvement during his time at UW from ASUW, RCSA, First Year Programs, CoMotion, and the Foster School of Business. He works as a Lead for UW Information Technology in Odegaard and is the Director for DubHacks, UW’s hackathon. He is involved in numerous groups on campus promoting innovation, entrepreneurship, inclusion, and diversity. Navid is also a mentor for the UW Leaders program and member of the Provost Advisory Committee for Students.'
			}, {
				name: 'Erin Firth',
				title: 'GPSS Representative',
				desc: 'Erin Firth is a 5th year graduate student in the school of Oceanography with interest in microbiology and education. She has served in student government for the entire length of her tenure at UW, and has held a position on both the Services and Activities Fee Committee, and Student Technology Fee Committee for multiple years. Erin is a Southern California native, and despite missing the ability to surf during the winter holidays, she greatly enjoys the clouds and rain of Seattle. Erin is also passionate about social justice and activism, especially in regards to the LGBTQ+ community.'
			}, {
				name: 'Pari Gabriel',
				title: 'ASUW Representative',
				desc: 'Pari Gabriel is a sophomore currently in the pre-engineering program soon to be applying to the college of Human Centered Design &amp; Engineering. He grew up in the rural city of Prosser, Washington and moved to Seattle in 2015 to attend UW. He loves to stay fit by playing basketball and lifting weights, is a freelance graphic designer, and also works for ASUW as a visual designer under the Office of Communications'
			}, {
				name: 'Kristen Garofali',
				title: 'GPSS Representative',
				desc: ''
			}, {
				name: 'Peder Digre',
				title: 'GPSS Representative',
				desc: 'Peder Digre is a dual student in the Evans School of Public Policy and Governance and the Department of Global Health pursuing a Master of Public Administration and a Master of Public Health in Health Metrics and Evaluation. Peder became involved in student government last year when he was appointed to be a Graduate and Professional Student Senate (GPSS) Senator from the Department of Global Health. Peder is involved in numerous councils across campus, including as Vice Chair of the Services and Activities Fee Committee, the GPSS Finance and Budget Committee, the GPSS State Legislative Advisory Board, and the Dean’s Advisory Council for Students in the School of Public Health. Peder’s background is in global health, having worked at PATH—a local non-profit—for the past four years. Peder graduated from the University of Washington in 2013 with a BS in Molecular, Cellular, and Developmental Biology and a BA in Scandinavian Studies. '
			}, {
				name: 'Kai Frenay',
				title: 'ASUW Student Senate Liaison',
				desc: 'Kai is a Senior from Guam currently studying International Security and Foreign Policy through the Jackson School’s International Studies major. Having also heavily studied Korean language and society he plans to work for the CIA/FBI with a focus on regional stability and foreign policy in Southeast Asia. During his free time he enjoys going on road trips with friends, going to music festivals, playing video games, engaging in politics, investing, and he tries to go to the gym semi-routinely. Outside of his responsibilities to ASUW and STF, he serves as a board officer of the UW College Republicans and is a consultant for the UWIT.'
			}, {
				name: 'Lizzie Palmer',
				title: 'ASUW Finance and Budget Director',
				desc: 'Lizzie Palmer is a junior from Little Rock, Arkansas studying Accounting in the Foster School of Business. Lizzie hopes to pursue a career in tax accounting with either a nonprofit organization or a company known for their corporate social responsibility and community service. During her free time, Lizzie likes to go hiking, travel, and play board games/solve puzzles. She serves as a liaison between the STF Committee and the ASUW Board of Directors as the ASUW Finance &amp; Budget Director. Outside of student government, Lizzie is involved in the Global Case Competition Club and Delta Gamma Sorority as well as various volunteer opportunities across Seattle.'
			}, {
				name: 'Michaella Rogers',
				title: 'GPSS Treasurer',
				desc: 'Michaella Rogers is a second year Master of Public Administration student at the Evans School of Public Policy and Governance and is also pursuing a Technology Entrepreneurship Certificate from the Foster School of Business. She is interested in working on public-private partnerships or in the business for social good sector. She became involved in student government during her first year of grad school and currently serves as Treasurer for the Graduate and Professional Student Senate. She sits on the Services and Activities Fee Committee and Student Technology Fee Committee and chairs the Finance and Budget Committee and the Travel Grants Committee. Michaella is a Colorado native and graduated from the University of Colorado with a BA in International Relations and Italian. She loves to travel, do yoga, paint, hike, try new restaurants and cook'
			}, {
				name: 'Bryce Kolton',
				title: 'Chair, ASUW Representative',
				desc: 'Bryce Kolton is the current Chair of the Student Technology Fee Committee, and an ASUW representative at large. This is his fourth year in STF and student government overall. Outside of the Committee, Bryce is a senior in Informatics, taking a custom track which covers a broad range of technological topics. He doesn\'t get much time off of campus, but when he does, Bryce enjoys playing games, hanging with friends, and biking. After graduation, Bryce hopes to work in the technology industry and eventually pivot to politics.'
			}, {
				name: 'Alec Meade',
				title: 'Proposal Officer',
				desc: 'Alec Meade the current STF Proposal Officer. This is his third year at the University of Washington, and his second year with the STF. Alec is studying Environmental Science and Resource Management, with a focus in Landscape Ecology, and hopes to pursue a career related to environmental policy and planning. When he\'s not in class, Alec enjoys exploring the outdoors, memes, and literature.'
			}, {
				name: 'Rajiv Raina',
				title: 'Operations and Finance Manager',
				desc: 'Rajiv has been the STF finance and operations manager since March of 2016. This is his second year at the University of Washington and he is studying finance in the Foster School of Business. Outside of academia, Rajiv enjoys being active and spends most of his time either at the IMA or hanging out with friends. Rajiv is graduating this spring and looking to pursue a career in investment banking'
			}, {
				name: 'Sara Tores',
				title: 'Student Life Advisor',
				desc: 'Sara Torres is the Web Computing Specialist, Technology Manger, and Social Media Coordinator for the Husky Union Building. Sara has served as the Student Life advisor and ex-officio member to the Student Technology Fee Committee since 2010. Outside of UW, Sara enjoys playing softball and is an avid movie and trivia buff. A huge baseball fan, Sara is more than halfway done to touring and/or attending baseball games in all MLB stadiums. Originally from New Mexico, Sara is always on the lookout for restaurants in the greater Seattle area which properly use green chile or have good tamales or sopaipillas on their menu. Suggestions welcomed.'
			}, {
				name: 'Jeremy Caci',
				title: 'Ex-Officio from Undergraduate Academic Affairs',
				desc: 'Jeremy Caci is a software engineer and research analyst for the University of Washington’s division of Undergraduate Academic Affairs. For the past two years he has been using student, financial, and community data to drive program direction and further advancement efforts. He eagerly contributes both his technical and interdepartmental professional experience to the Student Technology Fee Committee through his role as an ex officio member.'
			}, {
				name: 'Jennifer Ward',
				title: 'Ex-Officio from UW Libraries',
				desc: 'Jennifer Ward is Director of Information Technology Services & Digital Strategies at the UW Libraries. Her unit oversees technology development and deployment for most library systems and services used across the UW. She has served as an ex-officio member on the Student Technology Fee Committee for the last six years. Outside work she plays bassoon and keeps bees, and holds out hope for her own hive on the roof of Suzzallo library.'
			}, {	
				name: 'Nate McKee',
				title: 'Ex-Officio from UW IT',
				desc: 'Nate McKee is the Director of Learning Technologies in UW-Information Technology and serves as an ex-officio member on the Student Technology Fee Committee. His unit provides support for teaching and learning technologies like Canvas and Panopto as well as instructional design, multimedia studios, and the Learning Commons in Odegaard Library'

			}
		]
	});
});

//displays the policy page
router.get('/policies', function servePolicies(req, res) {
	res.redirect('/documents/Policy')
	// res.render('simples/policies', {
	// 	title : 'Policies'
	// });
});


//displays the contact page
router.get('/contact', function serveContact(req, res) {
	res.render('simples/contact', {
		title : 'Contact Us',
		
		contacts : [{
			title : 'Chair',
			name : 'Bryce Knolton',
			email : 'STFChair@uw.edu'
		}, {	
			title : 'Operations and Finance Manager',
			name : 'Rajiv Raina',
			email : 'TechFee@uw.edu'
		}, {
			title : 'Web Developer',
			name : 'Sanjay Sagar',
			email : 'STFCWeb@uw.edu'
		}, {
			title : 'Proposal Officer',
			name : 'Alec Meade',
			email : 'STFAgent@uw.edu'
		}]
	});
});


//displays the faq page. 
router.get('/faq', function serveFaq(req, res) {
	res.render('simples/faq', {
		title : 'Frequently Asked Questions',
		faqs : {
			students : [{
				q : 'May I attend a Meeting?',
				a : 'Yes! All meetings are open to any visitors. Due to time constraints, you may not be able to ask questions to presenters or the committee, but we encourage and welcome visitors. All of our meetings are posted on the <a href="/calendar">calendar</a>.'
			} , {
				q : 'Does the STF Committee use all of its funds?',
				a : 'Over several fiscal years, all money given to STF by the fee is expended for student technological needs. In any given year, the Committee may decide not to use all its funds, due to low proposal numbers, low quality proposals, or expected higher-than-average need the following year. These funds roll into the next fiscal year.'
			} ,{
				q : 'I\'m a Graduate or Professional Student, how does the STF work for me?',
				a : 'You pay the same STF that all other students at UW pays. As such, we consider your place in the general student body, and the needs you have. While a specific resource we fund may not be utilized very much by the graduate community, others usually will.'
			} , {
				q : 'I\'m a Student, am I required to pay the fee?',
				a : 'Yes. The STF is part of your tuition bill. All matriculated students of the University of Washington must pay the fee, as dictated by the Washington State Legislature. For more info, see <a href="/about">about the STF</a>.'
			}] , 
			authors : [{
				q : 'What happened to Fast Track?',
				a : 'The STFC is moving from a yearly funding schedule to a quarterly schedule. Fast Track proposals were for time-sensitive funding methods and were handled early Winter Quarter. As the committee now approves groups quarterly, there is no longer a need for the Fast Track process. '
			} , {
				q : 'When will I receive my funds?',
				a : 'Funds are sent out by the first day of the next quarter. The exception to this is Spring Quarter, the funds of which will be available starting July 1st. All budgets close on June 30th.'
			} , {
				q : 'Will you fund my department\'s basic technological needs?',
				a : 'Likely, no. The STF exists to supplement student technological needs, not as a crutch for departments. It is expected that a fictional Department of Underwater Basket Weaving would provide its students with wicker and water, which seem rather essential to the education of that department\'s students. The Committee expects departments to fund such basic requirements. A good rule of thumb is if the answer to the question "Could my students learn without [item]" is "no", the committee will likely ask the department to fund the item. More information is available in the Instructional Use document, <a href="/documents/Findings">here</a>.'
			} , {
				q : 'How can I best present to the committee?',
				a : 'A good presentation quickly goes over what the proposal is, the purpose of the proposal, how many students will use the funded proposal, any past similar proposals, any similar funded proposals already on campus, and departmental support.'
			} , {
				q : 'How long may I present for?',
				a : 'You will have about 3-5 minutes to present, and then will be questioned by the committee until seen fit. A lack or plethora of questions does not indicate how the committee will vote.'
			} , {
				q : 'Should I present for the whole time?',
				a : 'Often, no. Simple proposals, such as for printers or a small computer lab, often do not need to spend the whole allotted time. Committee members will ask questsions to fill in any knowledge gaps that they missed out on if confused. More complicated proposals generally should spend more time explaining, but if you run out of words to say, just end your presentation early to allow for more questions if need be.'
			} , {
				q : 'What are metrics?',
				a : 'At any time, although frequently during your presentation and in the time immediately after, the committee members will rank the perceived performance of your proposal, were the committee to fund it. This is a not an exact science, but we try to do the best we can to be impartial to the proposal. We use these metrics as a guide when voting on whether to fund a proposal later in the year. Metrics are never the be-all end-all of our decision making process, and are merely there as an additional help to our regular process of discussion during voting.'
			} , {
				q : 'Are there often conflicts of interest?',
				a : 'Most committee members have many roles throughout campus and ASUW, leading to frequent conflicts of interest were a member to vote on a proposal that would directly impact their other positions within the university. For this reason, members will recuse themselves during voting on a proposal were it to directly impact them.'
			}]
		}
	});
});


//to mess with those spambots
router.get('/wp-login.php', function(req, res) {
	res.render('simples/wp-login')
})