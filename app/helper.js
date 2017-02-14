//a bunch of commonly used helper functions

var db = require('/STF/app/models');
var shib = require('passport-uwshib');
var bb = require('bluebird');

module.exports = {

	//This function accepts the response express parameter, The user from
	//req.user, and a Proposal ID (or proposal), and finally a bool redirect
	//flag. It will check the proposal in question for if a user's netId is
	//listed somewhere in it as an approved editor
	
	//Returns true if approved, false and redirects to error page if not, 
	//and false if redirect flag is false
	approvedEditor: function(res, u, pId, redir) {
		
		if (pId.id === undefined) {
			return db.Proposal.find({where: {id: pId} }).then(function(p) {
				testUser(res, u, p, redir)
			})
		}

		return testUser(res, u, pId, redir);
				
		// checks if user is associated with proposal (Primary, Budget, Dean, Additional...)
		function testUser(res, u, p, redir) {
			if (redir === null) {
				redir = true;
			} if (res.locals.isAdmin || (
				(u.regId == p.PrimaryRegId) ||
				(u.netId.toLowerCase() == p.PrimaryNetId) ||
				(u.netId.toLowerCase() == p.BudgetNetId) ||
				(u.netId.toLowerCase() == p.DeanNetId) || 
				(u.netId.toLowerCase() == p.StudentNetId) ||
				(u.netId.toLowerCase() == p.AdditionalContactNetId1) ||
				(u.netId.toLowerCase() == p.AdditionalContactNetId2) ||
				(u.netId.toLowerCase() == p.AdditionalContactNetId3)
				)&& p.Status < 2)	{ 
				return true;
			} else {
				if (redir) {
					module.exports.displayErrorPage(res, 'You are not an Approved editor of this Proposal', 'Access Denied');
				}
				return false;
			}
		}
	},



	//approved block editor, like above but for blocks
	blockApprovedEditor: function(res, u, bId, callback) {
		if (!u) {
			callback(false)
		} else if (!bId.id) {
			db.Block.findById(b).then(test(res, u, b, callback))
		} else {
			test(res, u, bId, callback)
		}

		function test(res, u, b, callback) {
			if (res.locals.isAdmin) {
				return callback(true);
			} else if (b.Status == 2 && (u.netId.toLowerCase() == b.PrimaryNetId ||
			                             u.netId.toLowerCase() == b.BudgetNetId ||
			                             u.netId.toLowerCase() == b.HeadNetId)) {
				return callback(true);
			}
			else if(b.Status == 0 && b.ProposerId == u.id) {
				callback(true)
			} else {
				callback(false)
			}
		}
	},

	
	approvedReporter: function(res, u, pId, redir) {
		
		if (pId.id === undefined) {
			return db.Proposal.find({where: {id: pId} }).then(function(p) {
				testUser(res, u, p, redir)
			})
		}

		return testUser(res, u, pId, redir);
				
		// checks if user is associated with proposal (Primary, Budget, Dean, Additional...)
		function testUser(res, u, p, redir) {
			if (redir === null) {
				redir = true;
			} if (res.locals.isAdmin || (
				(u.regId == p.PrimaryRegId) ||
				(u.netId.toLowerCase() == p.PrimaryNetId) ||
				(u.netId.toLowerCase() == p.BudgetNetId) ||
				(u.netId.toLowerCase() == p.DeanNetId) || 
				(u.netId.toLowerCase() == p.StudentNetId) ||
				(u.netId.toLowerCase() == p.AdditionalContactNetId1) ||
				(u.netId.toLowerCase() == p.AdditionalContactNetId2) ||
				(u.netId.toLowerCase() == p.AdditionalContactNetId3)
				) && (p.Status == 4 || p.Status == 5))	{ 
				return true;
			} else {
				if (redir) {
					module.exports.displayErrorPage(res, 'You are not an Approved reporter of this Proposal', 'Access Denied');
				}
				return false;
			}
		}
	},

	//a rewrite of the below fnction
	netIdCommitteeMember: function(res, netId, callback) {
		db.User.find({
			where: {
				NetId: netId,
				Permissions: {$gt: 0}
			}
		}).then(function(user) {
			if (!user) {
				module.exports.displayErrorPage(res, 'Access Denied', 'You are not an active committee member');
			} else {
				callback(user);
			}
		})
	},

	activeCommitteeMember: function(res, uRegId, redir) {

		if (uRegId.id === undefined) {
			db.User.find({where: {RegId: uRegId}})
				.then(function(u) {
					return testUser(res, u, redir)
				})
		} else {
			return testUser(res, uRegId, redir)
		}

		function testUser(res, u, redir) {
			if (redir == null) {
				redir = true;
			}
			if (u && u.Permissions > 0) {
				return true;
			} else {
				if (redir) {
					module.exports.displayErrorPage(res, 'You are not an active committee member', 'Access Denied');
				}
				return false;
			}
		}
	},

	//A simple error page displayer. Accepts res, a message, and the status
	//of hte request
	displayErrorPage: function(res, mess, status) {
		res.render('error', {
			message: mess,
			error: {status: status}
		})
	},


	//
	proposalStatus: function(status) {
		var messages = [
			'Unsubmitted',
			'Submitted',
			'In Voting',
			'Awaiting Decision',
			'Funded',
			'Partially Funded',
			'Not Funded',
			'Cancelled by User',
			'Cancelled by Admin'];

		return "<div class='text-center status-wrap status-" + status + 
			"'><p><b>" + messages[status] + "</b></p></div>";
	},


	blockStatus: function(status) {
		var messages = [
		'Awaiting Preliminary Vote', //0
		'Preliminary Vote Failed',   //1
		'Preliminary Vote Passed',   //2
		'Awaiting Committee Review', //3
		'Block Status Denied',       //4
		'Current Block',             //5
		'Previous Block'];           //6

		return "<div class='text-center status-wrap status-block-" + status + 
			"'><p><b>" + messages[status] + "</b></p></div>";
	}


}