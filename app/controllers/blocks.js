var router = require('express').Router();
var db = require('../models');
var shib = require('passport-uwshib');
var h = require('../helper');

module.exports = function(app) {
	app.use('/', router);
}

router.get('/blocks', function(req, res) {
	db.Block.findAll().then(function(blocks) {
		res.render('blocks/browse', {
			blocks: blocks,
			title: 'Blocks'
		})
	})
})

router.get('/blocks/create', shib.ensureAuth('/login'), function(req, res) {
	h.netIdCommitteeMember(res, req.user.netId, function(user) {
		res.render('blocks/create', {
			title: 'Create New Block'
		})
	})
})

router.post('/blocks/create', shib.ensureAuth('/login'), function(req, res) {
	h.netIdCommitteeMember(res, req.user.netId, function(user) {
		if (!req.body.Name ||
		    !req.body.PrimaryNetId ||
		    !req.body.PrimaryName ||
		    !req.body.ProposedAbstract) {
			h.displayErrorPage(res, 'Missing Information', 'Please fill out all required fields')
		} else {
			var fields = {};
			for (i in req.body) {
				fields[i] = req.body[i]
			}


			fields.PrimarySignature = 0;
			fields.HeadSignature = 0;
			fields.BudgetSignature = 0;			

			fields.Status = 0;
			fields.ProposerId = req.user.id;
			db.Block.create(fields).then(function(block) {
				res.redirect('/blocks/' + block.id)
			})
		}
	})
})


router.get('/blocks/delete/:id', shib.ensureAuth('/login'), function(req, res) {
	h.netIdCommitteeMember(res, req.user.netId, function(user) {
		db.Block.findById(req.params.id).then(function(block) {
			if (user.Permissions > 2) {
				block.destroy().then(res.redirect('/blocks'))
			} else if (block.ProposerId == user.id && block.Status == 0) {
				block.destroy().then(res.redirect('/blocks'))
			} else {
				h.displayErrorPage(res, 'Insufficient Privileges', 'You must be the initiator or an admin to delete a block, and the status of the application must not have continued past a voting stage')
			}
		})
	})
})


router.get('/blocks/:id', function(req, res) {
	db.Block.findById(req.params.id).then(function(block) {
		if (!block) {
			h.displayErrorPage(res, 'No Such Block', 'The block does not exist')
		} else {
			h.blockApprovedEditor(res, req.user, block, function(editor) {
				db.Vote.findAll({where: {BlockId: req.params.id}}).then(function(votes) {
					db.User.findById(block.ProposerId).then(function(proposer) {
						var votedFirst = false;
						var votedSecond = false;
						var one = 0;
						var two = 0;
						var three = 0;
						var four = 0;

						for (vote in votes) {
							var v = votes[vote]
							if (req.user && v.VoterId == req.user.id) {
								if (v.Value < 3) {
									votedFirst = true;
								} else {
									votedSecond = true;
								}
							}
							switch(v.Value) {
								case 1:
									one++;
									break;
								case 2:
									two++;
									break;
								case 3:
									three++;
									break;
								case 4:
									four++;
									break;
							}
						}

						console.log()


						res.render('blocks/view', {
							block: block,
							status: h.blockStatus(block.Status),
							background: '/img/' + block.Background,
							proposer: proposer,
							isApproved: editor,
							votes: votes,
							votedFirst: votedFirst,
							votedSecond: votedSecond,
							one: one,
							two: two,
							three: three,
							four: four,
							title: block.Name
						})
					})
				})
			})
		}
	})
})

router.post('/blocks/invitationvote/:id', shib.ensureAuth('/login'), function(req, res) {
	if (!res.locals.isCommitteeMember) {
		h.displayErrorPage(res, 'Not a Member', 'You are not a committee member')
	} else {
		db.Vote.find({
			where: {
				VoterId: req.user.id,
				BlockId: req.params.id
			}
		}).then(function(vote) {
			if (vote) {
				h.displayErrorPage(res, 'Already Voted', 'You have already voted on this block')
			} else {
				db.Vote.create({
					BlockId: req.params.id,
					VoterId: req.user.id,
					Value: req.body.Value
				}).then(res.redirect('/blocks/' + req.params.id))
			}
		})
	}
})

router.post('/blocks/finalvote/:id', shib.ensureAuth('/login'), function(req, res) {
	if (!res.locals.isCommitteeMember) {
		h.displayErrorPage(res, 'Not a Member', 'You are not a committee member')
	} else {
		db.Vote.find({
			where: {
				VoterId: req.user.id,
				BlockId: req.params.id
			}
		}).then(function(vote) {
			if (vote) {
				if (vote.Value == 3 || vote.Value == 4) {
					h.displayErrorPage(res, 'Already Voted', 'You have already voted on this block')
				} else {
					vote.update({
						Value: req.body.Value
					}).then(res.redirect('/blocks/' + req.params.id))
				}
			} else {
				db.Vote.create({
					BlockId: req.params.id,
					VoterId: req.user.id,
					Value: req.body.Value
				}).then(res.redirect('/blocks/' + req.params.id))
			}
		})
	}
})

router.get('/blocks/close/:id', shib.ensureAuth('/login'), function(req, res) {
	if (!res.locals.isAdmin) {
		return h.displayErrorPage(res, 'Unauthorized', 'Lol you can\'t do that')
	}
	db.Vote.findAll({
		where: {
			BlockId: req.params.id
		}
	}).then(function(rawVotes) {
		db.Block.findById(req.params.id).then(function(block) {
			var votes = [0, 0, 0, 0, 0];

			//collates votes and counts and groups them
			for (v in rawVotes) {
				var vote = rawVotes[v].Value;
				votes[vote]++;
			}

			console.log((votes[3] + votes[4]) * 2/3)
			console.log(votes[3])
			console.log((votes[3] + votes[4]) * 2/3 <= votes[3])
			console.log('kekekek')
			console.log(votes[1])


			if (block.Status == 0) { //updates status to 1 or 2
				if (votes[1] > votes[2]) {
					block.update({Status: 2}) //ready for block edits
				} else {
					block.update({Status: 1}) //failed vote
				}
			} else if (block.Status == 3) { //updates status to 4 or 5
				if ((votes[3] + votes[4]) * 2/3 <= votes[3]) {
					block.update({Status: 5}) //approved block
				} else {
					block.update({Status: 4}) //failed vote
				}
			}


			res.redirect('/blocks/' + req.params.id)
		})
	})
})


router.get('/blocks/update/:id', shib.ensureAuth('/login'), function(req, res) {
	db.Block.findById(req.params.id).then(function(block) {
		h.blockApprovedEditor(res, req.user, block, function(approved) {
			if (!approved) 
				return h.displayErrorPage(res, 'Unauthorized', 'You are not allowed to update this block')
			res.render('blocks/update', {
				block: block,
				title: 'Update Block'
			})
		})
	})
})

router.post('/blocks/update/:id', shib.ensureAuth('/login'), function(req, res) {
	db.Block.findById(req.params.id).then(function(block) {
		h.blockApprovedEditor(res, req.user, block, function(approved) {
			if (!approved) {
				res.json({
					message: "Failure"
				}).end()
			} else {

				//copy the items in body out to a new object
				var items = {};
				for (i in req.body) {
					items[i] = req.body[i];
				}


				//if a NetId has changed, reset the signature
				contacts = ['Primary',
				            'Budget',
				            'Head']
				for (c in contacts) {
					var netId = contacts[c] + 'NetId';
					console.log(netId)
					if (block[netId] != items[netId]) {
						var signature = contacts[c] + 'Signature';
						items[signature] = 0;
						console.log('resetting signature ' + signature)
					}
				}

				console.log(items)

				block.update(items).then(function() {
					res.json({
						message: "Success"
					})
				})
			}
		})
	})
})



//submit for status 2
router.get('/blocks/submit/:id', shib.ensureAuth('/login'), function(req, res) {
	db.Block.findById(req.params.id).then(function(block) {
		h.blockApprovedEditor(res, req.user, block, function(approved) {
			if (!approved) {
				h.displayErrorPage(res, 'Not Submitted', 'You are not an approved editor')
			} else if (!allSigned(block)) {
				h.displayErrorPage(res, 'Not Signed', 'Not all signatories have signed the proposal')
			} else {
				block.update({
					Status: 3
				}).then(function(block) {
					res.redirect('/blocks/' + block.id)
				})
			}
		})	
	})
})


router.post('/blocks/sign', shib.ensureAuth('/login'), function(req, res) {
	if (!req.body['id']) {
		h.displayErrorPage(res, 'Bad Signature', 'An error has occurred');
	} else {
		db.Block.findById(req.body.id).then(function(block) {
			h.blockApprovedEditor(res, req.user, block, function(approved) {
				if (approved) {

					var signed = false;
					if (block.HeadNetId == req.user.netId) {
						signed = true;
						block.update({HeadSignature: 1});
					} if (block.PrimaryNetId == req.user.netId) {
						signed = true;
						block.update({PrimarySignature: 1});
					} if (block.BudgetNetId == req.user.netId) {
						signed = true;
						block.update({BudgetSignature: 1});
					}

					signed = (signed ? 'SignSuccess' : 'SignFailure');

					var finished = false;
					if (allSigned(block)) {
						finished = true;
					}

					res.json({
						message: signed,
						finished: finished
					})
				} else {
					h.displayErrorPage(res, 'Unauthorized', 'You\'re not authorized to sign this block')
				}
			})
		})
	}
});

function allSigned(block) {
	return (block.BudgetSignature == 1 &&
	        block.PrimarySignature == 1 &&
	        block.HeadSignature == 1);
}